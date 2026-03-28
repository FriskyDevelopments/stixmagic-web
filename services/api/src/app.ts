import Fastify from 'fastify';
import cors from '@fastify/cors';
import { packsRoutes } from './routes/packs.js';
import { stickersRoutes } from './routes/stickers.js';
import { triggersRoutes } from './routes/triggers.js';
import { telegramRoutes } from './routes/telegram.js';
import { adminAuthPlugin } from './auth/adminAuth.js';
import { processOneJob } from './jobs/worker.js';

export async function buildApp() {
  const app = Fastify({ logger: false });
  await app.register(cors, { origin: true });
  await app.register(adminAuthPlugin);

  app.get('/health', async () => ({ ok: true, data: { service: 'api', status: 'up' } }));
  app.post('/internal/jobs/process-once', async () => ({ ok: true, data: { processed: await processOneJob() } }));

  await app.register(packsRoutes, { prefix: '/' });
  await app.register(stickersRoutes, { prefix: '/' });
  await app.register(triggersRoutes, { prefix: '/' });
  await app.register(telegramRoutes, { prefix: '/' });

  return app;
}
