import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { createPack, listPacks } from '../lib/repositories.js';
import { enqueueJob } from '../jobs/queue.js';

const createPackSchema = z.object({
  name: z.string().min(2),
  ownerId: z.string().min(1)
});

const publishSchema = z.object({
  packId: z.string().uuid(),
  mode: z.enum(['create_pack', 'add_sticker']),
  packName: z.string().min(1),
  title: z.string().min(1),
  pngSticker: z.string().min(1),
  emojis: z.string().min(1).default('✨')
});

export const packsRoutes: FastifyPluginAsync = async (app) => {
  app.get('/packs', { preHandler: [app.authorizeAdmin] }, async () => ({ ok: true, data: await listPacks() }));

  app.post('/packs', { preHandler: [app.authorizeAdmin] }, async (request, reply) => {
    const payload = createPackSchema.safeParse(request.body);
    if (!payload.success) return reply.status(400).send({ ok: false, data: payload.error.flatten() });

    return { ok: true, data: await createPack(payload.data) };
  });

  app.post('/packs/publish', { preHandler: [app.authorizeAdmin] }, async (request, reply) => {
    const payload = publishSchema.safeParse(request.body);
    if (!payload.success) return reply.status(400).send({ ok: false, data: payload.error.flatten() });

    await enqueueJob('sticker.publish', {
      ...payload.data,
      userId: request.principal!.userId
    });

    return { ok: true, data: { enqueued: true } };
  });
};
