import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { createTrigger, listTriggers } from '../lib/repositories.js';

const createTriggerSchema = z.object({
  stickerId: z.string().uuid(),
  actionType: z.enum(['send_message', 'run_command', 'call_webhook', 'bot_reaction']),
  actionPayload: z.record(z.unknown())
});

export const triggersRoutes: FastifyPluginAsync = async (app) => {
  app.get('/triggers', { preHandler: [app.authorizeAdmin] }, async () => ({ ok: true, data: await listTriggers() }));

  app.post('/triggers', { preHandler: [app.authorizeAdmin] }, async (request, reply) => {
    const payload = createTriggerSchema.safeParse(request.body);

    if (!payload.success) {
      return reply.status(400).send({ ok: false, data: payload.error.flatten() });
    }

    return { ok: true, data: await createTrigger(payload.data) };
  });
};
