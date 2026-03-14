import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { store } from '../lib/store.js';

const createPackSchema = z.object({
  name: z.string().min(2),
  ownerId: z.string().min(1)
});

export const packsRoutes: FastifyPluginAsync = async (app) => {
  app.get('/packs', async () => ({ ok: true, data: store.listPacks() }));

  app.post('/packs', async (request, reply) => {
    const payload = createPackSchema.safeParse(request.body);

    if (!payload.success) {
      return reply.status(400).send({ ok: false, data: payload.error.flatten() });
    }

    return { ok: true, data: store.createPack(payload.data) };
  });
};
