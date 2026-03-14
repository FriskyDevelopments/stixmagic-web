import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { store } from '../lib/store.js';

const createTriggerSchema = z.object({
  stickerId: z.string().min(1),
  actionType: z.enum(['send_message', 'run_command', 'call_webhook', 'bot_reaction']),
  actionPayload: z.record(z.unknown())
});

export const triggersRoutes: FastifyPluginAsync = async (app) => {
  app.get('/triggers', async () => ({ ok: true, data: store.listTriggers() }));

  app.post('/triggers', async (request, reply) => {
    const payload = createTriggerSchema.safeParse(request.body);

    if (!payload.success) {
      return reply.status(400).send({ ok: false, data: payload.error.flatten() });
    }

    return { ok: true, data: store.createTrigger(payload.data) };
  });
};
