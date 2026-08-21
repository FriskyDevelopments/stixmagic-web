import { randomUUID } from 'node:crypto';
import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import type { LoreFunnelEventName, LoreMemberStatus } from '@stixmagic/types';
import { createLoreEmailPayload, deliverLoreEmail } from '../lore/messaging.js';
import {
  getLoreFunnelSummary,
  getOrCreateLoreMember,
  hasLoreDropRead,
  listLoreResponses,
  markLoreDropRead,
  recordLoreEvent,
  saveLoreProgress,
  saveLoreResponse
} from '../lib/repositories.js';

const auraIds = ['tender-static', 'deep-water', 'afterglow', 'night-bloom'] as const;
const statuses: LoreMemberStatus[] = ['invited', 'in_progress', 'complete', 'revoked'];
const auraVersion = 'v1';
const eventNames: LoreFunnelEventName[] = [
  'invitation_opened',
  'journey_started',
  'decision_answered',
  'aura_discovered',
  'drop_opened',
  'community_cta_clicked'
];

const progressSchema = z.object({
  currentStep: z.number().int().min(0).max(7),
  status: z.enum(statuses as [LoreMemberStatus, ...LoreMemberStatus[]]),
  auraId: z.enum(auraIds).optional(),
  auraVersion: z.string().max(32).optional()
});

const responseSchema = z.object({
  questionId: z.string().min(1).max(80),
  optionId: z.string().min(1).max(80)
});

const eventSchema = z.object({
  name: z.enum(eventNames as [LoreFunnelEventName, ...LoreFunnelEventName[]]),
  properties: z.record(z.union([z.string(), z.number(), z.boolean()])).default({})
});

const memberMessageSchema = z.object({
  memberId: z.string().min(1).max(128),
  email: z.string().email().max(320)
});

export const loreRoutes: FastifyPluginAsync = async (app) => {
  app.get('/lore/me', { preHandler: [app.authenticateLoreMember] }, async (request, reply) => {
    if (!request.loreIdentity) return reply;
    const member = await getOrCreateLoreMember(request.loreIdentity.userId, request.loreIdentity.tenantId);
    const responses = await listLoreResponses(request.loreIdentity.userId);
    const firstDropRead = await hasLoreDropRead(request.loreIdentity.userId, 'the-soft-machinery');
    return { ok: true, data: { member, responses, firstDropRead } };
  });

  app.post('/lore/progress', { preHandler: [app.authenticateLoreMember] }, async (request, reply) => {
    if (!request.loreIdentity) return reply;
    const payload = progressSchema.safeParse(request.body);
    if (!payload.success) return reply.status(400).send({ ok: false, data: payload.error.flatten() });
    if (payload.data.auraVersion && payload.data.auraVersion !== auraVersion) {
      return reply.status(400).send({ ok: false, data: { message: 'Unsupported Aura rules version' } });
    }
    if (payload.data.status === 'complete' && (!payload.data.auraId || payload.data.currentStep < 5)) {
      return reply.status(400).send({ ok: false, data: { message: 'Complete progress requires a discovered Aura' } });
    }

    const member = await saveLoreProgress({
      ...payload.data,
      auraVersion: payload.data.auraVersion ?? (payload.data.auraId ? auraVersion : undefined),
      userId: request.loreIdentity.userId,
      tenantId: request.loreIdentity.tenantId
    });
    return { ok: true, data: { member } };
  });

  app.post('/lore/responses', { preHandler: [app.authenticateLoreMember] }, async (request, reply) => {
    if (!request.loreIdentity) return reply;
    const payload = responseSchema.safeParse(request.body);
    if (!payload.success) return reply.status(400).send({ ok: false, data: payload.error.flatten() });
    const response = await saveLoreResponse({
      ...payload.data,
      userId: request.loreIdentity.userId,
      tenantId: request.loreIdentity.tenantId,
      answeredAt: new Date().toISOString()
    });
    await recordLoreEvent({
      id: randomUUID(),
      userId: request.loreIdentity.userId,
      tenantId: request.loreIdentity.tenantId,
      name: 'decision_answered',
      occurredAt: response.answeredAt,
      properties: { questionId: response.questionId }
    });
    return { ok: true, data: { response } };
  });

  app.post('/lore/drops/:dropId/read', { preHandler: [app.authenticateLoreMember] }, async (request, reply) => {
    if (!request.loreIdentity) return reply;
    const member = await getOrCreateLoreMember(request.loreIdentity.userId, request.loreIdentity.tenantId);
    if (member.status !== 'complete' || !member.auraId) {
      return reply.status(403).send({ ok: false, data: { message: 'Discover an Aura before opening this drop' } });
    }
    const params = request.params as { dropId: string };
    const read = await markLoreDropRead(request.loreIdentity.userId, params.dropId);
    await recordLoreEvent({
      id: randomUUID(),
      userId: request.loreIdentity.userId,
      tenantId: request.loreIdentity.tenantId,
      name: 'drop_opened',
      occurredAt: read.readAt,
      properties: { dropId: params.dropId }
    });
    return { ok: true, data: { read } };
  });

  app.get('/lore/community-destination', { preHandler: [app.authenticateLoreMember] }, async (request, reply) => {
    if (!request.loreIdentity) return reply;
    const member = await getOrCreateLoreMember(request.loreIdentity.userId, request.loreIdentity.tenantId);
    if (member.status !== 'complete') return reply.status(403).send({ ok: false, data: { message: 'Community access unlocks after Aura discovery' } });
    return { ok: true, data: { enabled: Boolean(process.env.LORE_PRIVATE_COMMUNITY_URL), destination: process.env.LORE_PRIVATE_COMMUNITY_URL ?? null } };
  });

  app.post('/lore/events', { preHandler: [app.authenticateLoreMember] }, async (request, reply) => {
    if (!request.loreIdentity) return reply;
    const payload = eventSchema.safeParse(request.body);
    if (!payload.success) return reply.status(400).send({ ok: false, data: payload.error.flatten() });
    await recordLoreEvent({
      id: randomUUID(),
      userId: request.loreIdentity.userId,
      tenantId: request.loreIdentity.tenantId,
      name: payload.data.name,
      occurredAt: new Date().toISOString(),
      properties: payload.data.properties
    });
    return { ok: true, data: { accepted: true } };
  });

  app.get('/lore/admin/funnel', { preHandler: [app.authorizeLoreAdmin] }, async () => ({ ok: true, data: await getLoreFunnelSummary() }));

  app.post('/lore/admin/invitations', { preHandler: [app.authorizeLoreAdmin] }, async (request, reply) => {
    if (!request.loreIdentity) return reply;
    const payload = memberMessageSchema.safeParse(request.body);
    if (!payload.success) return reply.status(400).send({ ok: false, data: payload.error.flatten() });
    const trace = `lore-mail-${randomUUID()}`;
    try {
      await getOrCreateLoreMember(payload.data.memberId, request.loreIdentity.tenantId);
      const email = createLoreEmailPayload({ userId: payload.data.memberId, tenantId: request.loreIdentity.tenantId, email: payload.data.email, kind: 'invitation' });
      const delivery = await deliverLoreEmail(email);
      return { ok: true, data: { delivery, expiresAt: email.expiresAt, ...(process.env.LORE_ALLOW_ADMIN_INVITE_PREVIEW === 'true' ? { previewLink: email.link } : {}) } };
    } catch {
      console.error(`[${trace}] LORE invitation delivery failed`);
      return reply.status(502).send({ ok: false, data: { message: 'Invitation delivery failed', traceId: trace } });
    }
  });

  app.post('/lore/admin/recovery', { preHandler: [app.authorizeLoreAdmin] }, async (request, reply) => {
    if (!request.loreIdentity) return reply;
    const payload = memberMessageSchema.safeParse(request.body);
    if (!payload.success) return reply.status(400).send({ ok: false, data: payload.error.flatten() });
    const member = await getOrCreateLoreMember(payload.data.memberId, request.loreIdentity.tenantId);
    if (member.status !== 'in_progress') return reply.status(409).send({ ok: false, data: { message: 'Recovery is only available for an incomplete journey' } });
    const trace = `lore-mail-${randomUUID()}`;
    try {
      const email = createLoreEmailPayload({ userId: payload.data.memberId, tenantId: request.loreIdentity.tenantId, email: payload.data.email, kind: 'recovery' });
      const delivery = await deliverLoreEmail(email);
      return { ok: true, data: { delivery, expiresAt: email.expiresAt } };
    } catch {
      console.error(`[${trace}] LORE recovery delivery failed`);
      return reply.status(502).send({ ok: false, data: { message: 'Recovery delivery failed', traceId: trace } });
    }
  });
};
