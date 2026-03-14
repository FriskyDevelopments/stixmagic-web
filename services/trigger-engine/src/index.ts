import Fastify from 'fastify';
import { z } from 'zod';
import { loadTriggerEngineConfig } from '@stixmagic/config';

const config = loadTriggerEngineConfig();
const app = Fastify({ logger: true });

const executeSchema = z.object({
  stickerId: z.string().min(1),
  actionType: z.enum(['send_message', 'run_command', 'call_webhook', 'bot_reaction']),
  actionPayload: z.record(z.unknown()),
  context: z.object({
    platform: z.string(),
    chatId: z.string(),
    actorId: z.string()
  })
});

app.get('/health', async () => ({ ok: true, data: { service: 'trigger-engine', status: 'up' } }));

app.post('/execute', async (request, reply) => {
  const payload = executeSchema.safeParse(request.body);

  if (!payload.success) {
    return reply.status(400).send({ ok: false, data: payload.error.flatten() });
  }

  const result = {
    executed: true,
    stickerId: payload.data.stickerId,
    actionType: payload.data.actionType,
    context: payload.data.context,
    timestamp: new Date().toISOString()
  };

  return { ok: true, data: result };
});

await app.listen({ host: '0.0.0.0', port: config.TRIGGER_ENGINE_PORT });
