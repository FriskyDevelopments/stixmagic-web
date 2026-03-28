import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { getTelegramPlatformConfigFromApiEnv, parseTelegramMiniAppContext } from '@stixmagic/config';
import type { CreateReactionRuleRequest } from '@stixmagic/types';
import {
  createReactionRule,
  deleteReactionRule,
  getTelegramGroup,
  listReactionRules,
  listTelegramGroups,
  upsertWebhookUpdate,
  updateReactionRule
} from '../lib/repositories.js';
import { enqueueJob } from '../jobs/queue.js';

const groupParamsSchema = z.object({ groupId: z.string().min(1) });
const ruleParamsSchema = z.object({ groupId: z.string().min(1), ruleId: z.string().uuid() });
const createReactionRuleSchema = z.object({
  name: z.string().min(1),
  triggerType: z.enum(['sticker', 'emoji']),
  triggerValue: z.string().min(1),
  responseType: z.enum(['message', 'sticker', 'animation', 'button_action']),
  responseContent: z.string().min(1),
  enabled: z.boolean()
});
const updateReactionRuleSchema = z.object({ enabled: z.boolean() });

const updateSchema = z.object({
  update_id: z.number().int().nonnegative(),
  message: z
    .object({
      message_id: z.number().int(),
      chat: z.object({ id: z.number(), type: z.string(), title: z.string().optional() }),
      text: z.string().optional(),
      sticker: z.object({ file_id: z.string() }).optional()
    })
    .optional()
});

export const telegramRoutes: FastifyPluginAsync = async (app) => {
  app.get('/telegram/platform', async () => ({ ok: true, data: getTelegramPlatformConfigFromApiEnv() }));

  app.get('/telegram/mini-app/bootstrap', { preHandler: [app.authenticateTelegramUser] }, async (request, reply) => {
    if (!request.principal) return reply;
    const groups = await listTelegramGroups();
    return {
      ok: true,
      data: {
        config: getTelegramPlatformConfigFromApiEnv(),
        context: parseTelegramMiniAppContext(request.principal.raw),
        groups: groups.filter((group) => group.isAdmin)
      }
    };
  });

  app.get('/groups', { preHandler: [app.authorizeAdmin] }, async () => ({ ok: true, data: await listTelegramGroups() }));

  app.get('/groups/:groupId', { preHandler: [app.authorizeAdmin] }, async (request, reply) => {
    const params = groupParamsSchema.safeParse(request.params);
    if (!params.success) return reply.status(400).send({ ok: false, data: params.error.flatten() });

    const group = await getTelegramGroup(params.data.groupId);
    if (!group) return reply.status(404).send({ ok: false, data: { message: 'Group not found' } });
    return { ok: true, data: group };
  });

  app.get('/groups/:groupId/rules', { preHandler: [app.authorizeAdmin] }, async (request, reply) => {
    const params = groupParamsSchema.safeParse(request.params);
    if (!params.success) return reply.status(400).send({ ok: false, data: params.error.flatten() });
    return { ok: true, data: await listReactionRules(params.data.groupId) };
  });

  app.post('/groups/:groupId/rules', { preHandler: [app.authorizeAdmin] }, async (request, reply) => {
    const params = groupParamsSchema.safeParse(request.params);
    const payload = createReactionRuleSchema.safeParse(request.body);

    if (!params.success || !payload.success) {
      return reply.status(400).send({
        ok: false,
        data: {
          params: params.success ? null : params.error.flatten(),
          body: payload.success ? null : payload.error.flatten()
        }
      });
    }

    const group = await getTelegramGroup(params.data.groupId);
    if (!group) return reply.status(404).send({ ok: false, data: { message: 'Group not found' } });

    return {
      ok: true,
      data: await createReactionRule(params.data.groupId, payload.data satisfies CreateReactionRuleRequest)
    };
  });

  app.patch('/groups/:groupId/rules/:ruleId', { preHandler: [app.authorizeAdmin] }, async (request, reply) => {
    const params = ruleParamsSchema.safeParse(request.params);
    const payload = updateReactionRuleSchema.safeParse(request.body);

    if (!params.success || !payload.success) {
      return reply.status(400).send({
        ok: false,
        data: {
          params: params.success ? null : params.error.flatten(),
          body: payload.success ? null : payload.error.flatten()
        }
      });
    }

    const rule = await updateReactionRule(params.data.groupId, params.data.ruleId, payload.data.enabled);
    if (!rule) return reply.status(404).send({ ok: false, data: { message: 'Rule not found' } });
    return { ok: true, data: rule };
  });

  app.delete('/groups/:groupId/rules/:ruleId', { preHandler: [app.authorizeAdmin] }, async (request, reply) => {
    const params = ruleParamsSchema.safeParse(request.params);
    if (!params.success) return reply.status(400).send({ ok: false, data: params.error.flatten() });

    const deleted = await deleteReactionRule(params.data.groupId, params.data.ruleId);
    if (!deleted) return reply.status(404).send({ ok: false, data: { message: 'Rule not found' } });

    return { ok: true, data: { deleted: true } };
  });

  app.post('/telegram/webhook', async (request, reply) => {
    const secretHeader = request.headers['x-telegram-bot-api-secret-token'];
    const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (expectedSecret && secretHeader !== expectedSecret) {
      return reply.status(401).send({ ok: false, data: { message: 'Invalid webhook secret' } });
    }

    const parsed = updateSchema.safeParse(request.body);
    if (!parsed.success) {
      request.log.warn({ err: parsed.error }, 'invalid telegram update payload');
      return reply.status(400).send({ ok: false, data: parsed.error.flatten() });
    }

    const accepted = await upsertWebhookUpdate(parsed.data.update_id);
    if (!accepted) {
      return reply.send({ ok: true, data: { duplicate: true } });
    }

    await enqueueJob('trigger.execute', {
      updateId: parsed.data.update_id,
      message: parsed.data.message ?? null
    });

    return reply.send({ ok: true, data: { accepted: true } });
  });
};
