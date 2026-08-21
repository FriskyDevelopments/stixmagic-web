import Fastify from 'fastify';
import cors from '@fastify/cors';
import rawBody from 'fastify-raw-body';
import fp from 'fastify-plugin';
import { packsRoutes } from './routes/packs.js';
import { stickersRoutes } from './routes/stickers.js';
import { triggersRoutes } from './routes/triggers.js';
import { telegramRoutes } from './routes/telegram.js';
import { adminAuthPlugin } from './auth/adminAuth.js';
import { loreAuthPlugin } from './auth/loreAuth.js';
import { loreRoutes } from './routes/lore.js';
import { integrationsRoutes } from './routes/integrations.js';
import { processOneJob } from './jobs/worker.js';

export async function buildApp() {
  const app = Fastify({ logger: false });
  await app.register(cors, { origin: true });
  await app.register(rawBody, { field: 'rawBody', global: false, encoding: 'utf8' });
  await app.register(fp(adminAuthPlugin));
  await app.register(fp(loreAuthPlugin));

  app.get('/health', async () => ({ ok: true, data: { service: 'api', status: 'up' } }));
  app.post('/internal/jobs/process-once', async () => ({ ok: true, data: { processed: await processOneJob() } }));

  await app.register(packsRoutes, { prefix: '/' });
  await app.register(stickersRoutes, { prefix: '/' });
  await app.register(triggersRoutes, { prefix: '/' });
  await app.register(telegramRoutes, { prefix: '/' });
  await app.register(loreRoutes, { prefix: '/' });
  await app.register(integrationsRoutes, { prefix: '/' });

  return app;
}
