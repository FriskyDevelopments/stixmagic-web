import Fastify from 'fastify';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { loadStickerEngineConfig } from '@stixmagic/config';

const config = loadStickerEngineConfig();
const app = Fastify({ logger: true });

const processSchema = z.object({
  sourceUrl: z.string().url(),
  maskType: z.enum(['default', 'circle', 'square', 'oval', 'diamond', 'star', 'heart']),
  outputFormat: z.enum(['webp', 'webm']).default('webp')
});

app.get('/health', async () => ({ ok: true, data: { service: 'sticker-engine', status: 'up' } }));

app.post('/process', async (request, reply) => {
  const payload = processSchema.safeParse(request.body);

  if (!payload.success) {
    return reply.status(400).send({ ok: false, data: payload.error.flatten() });
  }

  const id = randomUUID();

  return {
    ok: true,
    data: {
      assetId: id,
      input: payload.data,
      pipeline: [
        'Upload image',
        'Apply optional mask',
        'Resize and optimize',
        'Convert to sticker format',
        'Store sticker asset',
        'Attach metadata'
      ],
      outputUrl: `${config.S3_ENDPOINT}/${config.S3_BUCKET}/stickers/${id}.${payload.data.outputFormat}`
    }
  };
});

await app.listen({ host: '0.0.0.0', port: config.STICKER_ENGINE_PORT });
