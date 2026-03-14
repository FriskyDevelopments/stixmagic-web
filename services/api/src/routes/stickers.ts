import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import type { MaskType } from '@stixmagic/types';
import { store } from '../lib/store.js';

const createStickerSchema = z.object({
  packId: z.string().min(1),
  imageUrl: z.string().url(),
  triggerId: z.string().min(1),
  metadata: z.object({
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    format: z.enum(['webp', 'png', 'webm']),
    sizeBytes: z.number().int().positive(),
    maskType: z.custom<MaskType>(),
    interactive: z.boolean()
  })
});

export const stickersRoutes: FastifyPluginAsync = async (app) => {
  app.post('/stickers', async (request, reply) => {
    const payload = createStickerSchema.safeParse(request.body);

    if (!payload.success) {
      return reply.status(400).send({ ok: false, data: payload.error.flatten() });
    }

    return { ok: true, data: store.createSticker(payload.data) };
  });
};
