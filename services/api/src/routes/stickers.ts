import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { createSticker } from '../lib/repositories.js';

const createStickerSchema = z.object({
  packId: z.string().uuid(),
  imageUrl: z.string().url(),
  triggerId: z.string().uuid(),
  metadata: z.object({
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    format: z.enum(['webp', 'png', 'webm']),
    sizeBytes: z.number().int().positive(),
    maskType: z.enum(['default', 'circle', 'square', 'oval', 'diamond', 'star', 'heart']),
    interactive: z.boolean()
  })
});

export const stickersRoutes: FastifyPluginAsync = async (app) => {
  app.post('/stickers', { preHandler: [app.authorizeAdmin] }, async (request, reply) => {
    const payload = createStickerSchema.safeParse(request.body);

    if (!payload.success) {
      return reply.status(400).send({ ok: false, data: payload.error.flatten() });
    }

    // Persist only validated metadata. Processing is intentionally not queued
    // until the sticker-engine upload/storage contract is implemented end-to-end.
    const sticker = await createSticker(payload.data);
    return { ok: true, data: sticker };
  });
};
