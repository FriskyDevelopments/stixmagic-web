import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import type { MaskType } from '@stixmagic/types';
import { createSticker } from '../lib/repositories.js';
import { enqueueJob } from '../jobs/queue.js';

const createStickerSchema = z.object({
  packId: z.string().uuid(),
  imageUrl: z.string().url(),
  triggerId: z.string().uuid(),
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
  app.post('/stickers', { preHandler: [app.authorizeAdmin] }, async (request, reply) => {
    const payload = createStickerSchema.safeParse(request.body);

    if (!payload.success) {
      return reply.status(400).send({ ok: false, data: payload.error.flatten() });
    }

    const sticker = await createSticker(payload.data);
    await enqueueJob('sticker.process', { stickerId: sticker.id, packId: sticker.packId });

    return { ok: true, data: sticker };
  });
};
