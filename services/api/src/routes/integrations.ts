import { randomUUID } from 'node:crypto';
import type { FastifyPluginAsync, FastifyRequest } from 'fastify';
import {
  clearLoreIntegration,
  getLoreIntegration,
  saveLoreIntegration
} from '../lib/repositories.js';
import {
  createGoogleCalendarConnectSession,
  deleteGoogleCalendarConnection,
  getNangoIntegrationId,
  isNangoConfigured,
  listGoogleCalendarConnections,
  listUpcomingGoogleCalendarEvents,
  verifyNangoWebhook
} from '../integrations/nangoService.js';

type RawBodyRequest = FastifyRequest & { rawBody?: string };

type NangoWebhook = {
  type?: string;
  operation?: string;
  success?: boolean;
  connectionId?: string;
  providerConfigKey?: string;
  provider?: string;
  tags?: { organization_id?: string; end_user_id?: string; end_user_email?: string };
  error?: { type?: string; description?: string };
};

function traceId(): string {
  return `nango-${randomUUID()}`;
}

function safeError(reply: { status: (code: number) => { send: (body: unknown) => unknown } }, code: number, message: string, id: string) {
  return reply.status(code).send({ ok: false, data: { message, traceId: id } });
}

export const integrationsRoutes: FastifyPluginAsync = async (app) => {
  app.get('/integrations/google-calendar/status', { preHandler: [app.authorizeLoreAdmin] }, async (request, reply) => {
    if (!request.loreIdentity) return reply;
    const local = await getLoreIntegration(request.loreIdentity.tenantId, 'google-calendar');
    if (!isNangoConfigured()) {
      return { ok: true, data: { provider: 'google-calendar', status: 'not_configured', connection: null, lastTraceId: local?.lastTraceId ?? null } };
    }

    try {
      const connections = await listGoogleCalendarConnections(request.loreIdentity.tenantId);
      const connection = connections[0] ?? null;
      return {
        ok: true,
        data: {
          provider: 'google-calendar',
          status: connection ? (connection.errors.length ? 'error' : 'connected') : (local?.status ?? 'not_connected'),
          connection: connection ? { connectionId: connection.connectionId, createdAt: connection.createdAt, errors: connection.errors } : null,
          lastTraceId: local?.lastTraceId ?? null
        }
      };
    } catch {
      const id = traceId();
      console.error(`[${id}] Nango status request failed`);
      return safeError(reply, 502, 'Unable to read the Google Calendar connection status', id);
    }
  });

  app.post('/integrations/google-calendar/connect', { preHandler: [app.authorizeLoreAdmin] }, async (request, reply) => {
    if (!request.loreIdentity) return reply;
    const id = traceId();
    if (!isNangoConfigured()) return safeError(reply, 503, 'Nango is not configured for Google Calendar', id);

    try {
      const session = await createGoogleCalendarConnectSession({ userId: request.loreIdentity.userId, tenantId: request.loreIdentity.tenantId });
      await saveLoreIntegration({
        tenantId: request.loreIdentity.tenantId,
        provider: 'google-calendar',
        providerConfigKey: getNangoIntegrationId(),
        status: 'connecting',
        lastTraceId: id,
        updatedAt: new Date().toISOString()
      });
      return { ok: true, data: { status: 'connecting', connectLink: session.connectLink, expiresAt: session.expiresAt, traceId: id } };
    } catch {
      console.error(`[${id}] Nango connect session creation failed`);
      return safeError(reply, 502, 'Unable to start Google Calendar authorization', id);
    }
  });

  app.post('/integrations/google-calendar/test', { preHandler: [app.authorizeLoreAdmin] }, async (request, reply) => {
    if (!request.loreIdentity) return reply;
    const id = traceId();
    const local = await getLoreIntegration(request.loreIdentity.tenantId, 'google-calendar');
    if (!local?.connectionId) return safeError(reply, 409, 'Connect Google Calendar before testing the integration', id);

    try {
      const events = await listUpcomingGoogleCalendarEvents(local.connectionId);
      await saveLoreIntegration({ ...local, status: 'connected', lastSyncedAt: new Date().toISOString(), lastTraceId: id, updatedAt: new Date().toISOString() });
      return { ok: true, data: { status: 'connected', events, lastSyncedAt: new Date().toISOString(), traceId: id } };
    } catch {
      await saveLoreIntegration({ ...local, status: 'error', lastTraceId: id, updatedAt: new Date().toISOString() });
      console.error(`[${id}] Nango Google Calendar test action failed`);
      return safeError(reply, 502, 'Google Calendar test action failed', id);
    }
  });

  app.delete('/integrations/google-calendar', { preHandler: [app.authorizeLoreAdmin] }, async (request, reply) => {
    if (!request.loreIdentity) return reply;
    const id = traceId();
    const local = await getLoreIntegration(request.loreIdentity.tenantId, 'google-calendar');
    try {
      if (local?.connectionId && isNangoConfigured()) await deleteGoogleCalendarConnection(local.connectionId);
      await clearLoreIntegration(request.loreIdentity.tenantId, 'google-calendar');
      return { ok: true, data: { status: 'disconnected', traceId: id } };
    } catch {
      console.error(`[${id}] Nango Google Calendar disconnect failed`);
      return safeError(reply, 502, 'Unable to disconnect Google Calendar', id);
    }
  });

  app.post('/integrations/nango/webhook', { config: { rawBody: true } }, async (request, reply) => {
    const rawBody = (request as RawBodyRequest).rawBody;
    if (!rawBody) return reply.status(400).send({ ok: false, data: { message: 'Raw webhook body required' } });
    if (!verifyNangoWebhook(rawBody, request.headers as Record<string, unknown>)) {
      return reply.status(401).send({ ok: false, data: { message: 'Invalid Nango webhook signature' } });
    }

    let payload: NangoWebhook;
    try {
      payload = JSON.parse(rawBody) as NangoWebhook;
    } catch {
      return reply.status(400).send({ ok: false, data: { message: 'Invalid webhook JSON' } });
    }

    if (payload.type !== 'auth' || !payload.tags?.organization_id || payload.providerConfigKey !== getNangoIntegrationId() || !payload.connectionId) {
      return { ok: true, data: { accepted: true, ignored: true } };
    }

    const status = payload.success === false ? 'error' : 'connected';
    await saveLoreIntegration({
      tenantId: payload.tags.organization_id,
      provider: 'google-calendar',
      providerConfigKey: payload.providerConfigKey,
      connectionId: payload.connectionId,
      status,
      lastTraceId: traceId(),
      updatedAt: new Date().toISOString()
    });
    return { ok: true, data: { accepted: true } };
  });
};
