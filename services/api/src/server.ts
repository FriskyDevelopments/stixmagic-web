import Fastify from 'fastify';
import cors from '@fastify/cors';
import { loadApiConfig } from '@stixmagic/config';
import { packsRoutes } from './routes/packs.js';
import { stickersRoutes } from './routes/stickers.js';
import { triggersRoutes } from './routes/triggers.js';
import { telegramRoutes } from './routes/telegram.js';

const config = loadApiConfig();

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });

app.get('/health', async () => ({ ok: true, data: { service: 'api', status: 'up' } }));

await app.register(packsRoutes, { prefix: '/' });
await app.register(stickersRoutes, { prefix: '/' });
await app.register(triggersRoutes, { prefix: '/' });
await app.register(telegramRoutes, { prefix: '/' });

await app.listen({ host: '0.0.0.0', port: config.API_PORT });
