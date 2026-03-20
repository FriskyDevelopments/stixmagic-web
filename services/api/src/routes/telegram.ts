import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { getTelegramPlatformConfigFromApiEnv, parseTelegramMiniAppContext } from '@stixmagic/config';
import type { CreateReactionRuleRequest } from '@stixmagic/types';
import { store } from '../lib/store.js';

const groupParamsSchema = z.object({
  groupId: z.string().min(1)
});

const ruleParamsSchema = z.object({
  groupId: z.string().min(1),
  ruleId: z.string().min(1)
});

const createReactionRuleSchema = z.object({
  name: z.string().min(1),
  triggerType: z.enum(['sticker', 'emoji']),
  triggerValue: z.string().min(1),
  responseType: z.enum(['message', 'sticker', 'animation', 'button_action']),
  responseContent: z.string().min(1),
  enabled: z.boolean()
});

const updateReactionRuleSchema = z.object({
  enabled: z.boolean()
});

export const telegramRoutes: FastifyPluginAsync = async (app) => {
  app.get('/telegram/platform', async () => ({
    ok: true,
    data: getTelegramPlatformConfigFromApiEnv()
  }));

  app.get('/telegram/mini-app/bootstrap', async (request) => {
    const rawInitData =
      (request.headers['x-telegram-init-data'] as string | undefined) ??
      (request.query as { tgWebAppData?: string }).tgWebAppData;

    return {
      ok: true,
      data: {
        config: getTelegramPlatformConfigFromApiEnv(),
        context: parseTelegramMiniAppContext(rawInitData),
        groups: store.listTelegramGroups().filter((group) => group.isAdmin)
      }
    };
  });

  app.get('/groups', async () => ({
    ok: true,
    data: store.listTelegramGroups()
  }));

  app.get('/groups/:groupId', async (request, reply) => {
    const params = groupParamsSchema.safeParse(request.params);
    if (!params.success) {
      return reply.status(400).send({ ok: false, data: params.error.flatten() });
    }

    const group = store.getTelegramGroup(params.data.groupId);
    if (!group) {
      return reply.status(404).send({ ok: false, data: { message: 'Group not found' } });
    }

    return { ok: true, data: group };
  });

  app.get('/groups/:groupId/rules', async (request, reply) => {
    const params = groupParamsSchema.safeParse(request.params);
    if (!params.success) {
      return reply.status(400).send({ ok: false, data: params.error.flatten() });
    }

    return { ok: true, data: store.listReactionRules(params.data.groupId) };
  });

  app.post('/groups/:groupId/rules', async (request, reply) => {
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

    const group = store.getTelegramGroup(params.data.groupId);
    if (!group) {
      return reply.status(404).send({ ok: false, data: { message: 'Group not found' } });
    }

    return {
      ok: true,
      data: store.createReactionRule(params.data.groupId, payload.data satisfies CreateReactionRuleRequest)
    };
  });

  app.patch('/groups/:groupId/rules/:ruleId', async (request, reply) => {
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

    const rule = store.updateReactionRule(params.data.groupId, params.data.ruleId, payload.data);
    if (!rule) {
      return reply.status(404).send({ ok: false, data: { message: 'Rule not found' } });
    }

    return { ok: true, data: rule };
  });

  app.delete('/groups/:groupId/rules/:ruleId', async (request, reply) => {
    const params = ruleParamsSchema.safeParse(request.params);
    if (!params.success) {
      return reply.status(400).send({ ok: false, data: params.error.flatten() });
    }

    const deleted = store.deleteReactionRule(params.data.groupId, params.data.ruleId);
    if (!deleted) {
      return reply.status(404).send({ ok: false, data: { message: 'Rule not found' } });
    }

    return { ok: true, data: { deleted: true } };
  });
};
