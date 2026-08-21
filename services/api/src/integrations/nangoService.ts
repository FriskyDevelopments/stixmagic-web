import { createHmac, timingSafeEqual } from 'node:crypto';
import { Nango } from '@nangohq/node';

const integrationId = process.env.NANGO_GOOGLE_CALENDAR_INTEGRATION_ID ?? 'google-calendar';

let client: Nango | null = null;

function getClient(): Nango {
  const apiKey = process.env.NANGO_API_KEY;
  if (!apiKey) throw new Error('NANGO_API_KEY is not configured');
  if (!client) {
    client = new Nango({
      apiKey,
      webhookSigningKey: process.env.NANGO_WEBHOOK_SIGNING_KEY,
      host: process.env.NANGO_HOST
    });
  }
  return client;
}

export function isNangoConfigured(): boolean {
  return Boolean(process.env.NANGO_API_KEY && process.env.NANGO_GOOGLE_CALENDAR_INTEGRATION_ID);
}

export function getNangoIntegrationId(): string {
  return integrationId;
}

export async function createGoogleCalendarConnectSession(input: { userId: string; tenantId: string; email?: string }) {
  const response = await getClient().createConnectSession({
    tags: {
      end_user_id: input.userId,
      ...(input.email ? { end_user_email: input.email } : {}),
      organization_id: input.tenantId
    },
    allowed_integrations: [integrationId]
  });
  return {
    connectLink: response.data.connect_link ?? null,
    expiresAt: response.data.expires_at
  };
}

type SanitizedGoogleConnection = {
  connectionId: string;
  providerConfigKey: string;
  createdAt: string;
  errors: Array<{ type: string; logId: string }>;
  tags: Record<string, string>;
};

export async function listGoogleCalendarConnections(tenantId: string): Promise<SanitizedGoogleConnection[]> {
  const response = await getClient().listConnections({
    integrationId,
    tags: { organization_id: tenantId },
    limit: 10
  });
  return response.connections.map((connection) => ({
    connectionId: connection.connection_id,
    providerConfigKey: connection.provider_config_key,
    createdAt: connection.created,
    errors: connection.errors?.map((error) => ({ type: error.type, logId: error.log_id })) ?? [],
    tags: connection.tags
  }));
}

export async function listUpcomingGoogleCalendarEvents(connectionId: string) {
  const response = await getClient().proxy<{
    items?: Array<{
      id?: string;
      summary?: string;
      description?: string;
      start?: { dateTime?: string; date?: string };
      end?: { dateTime?: string; date?: string };
      htmlLink?: string;
    }>;
  }>({
    method: 'GET',
    endpoint: '/calendar/v3/calendars/primary/events',
    providerConfigKey: integrationId,
    connectionId,
    params: {
      maxResults: '10',
      singleEvents: 'true',
      orderBy: 'startTime',
      timeMin: new Date().toISOString()
    }
  });

  return (response.data.items ?? []).map((event) => ({
    id: event.id ?? null,
    title: event.summary ?? 'Untitled event',
    start: event.start?.dateTime ?? event.start?.date ?? null,
    end: event.end?.dateTime ?? event.end?.date ?? null,
    link: event.htmlLink ?? null
  }));
}

export async function deleteGoogleCalendarConnection(connectionId: string): Promise<void> {
  await getClient().deleteConnection(integrationId, connectionId);
}

export function verifyNangoWebhook(body: string, headers: Record<string, unknown>): boolean {
  const signingKey = process.env.NANGO_WEBHOOK_SIGNING_KEY;
  const receivedHeader = headers['x-nango-hmac-sha256'] ?? headers['X-Nango-Hmac-Sha256'];
  const received = Array.isArray(receivedHeader) ? receivedHeader[0] : receivedHeader;
  if (!signingKey || typeof received !== 'string') return false;

  const expected = createHmac('sha256', signingKey).update(body).digest('hex');
  const expectedBuffer = Buffer.from(expected, 'utf8');
  const receivedBuffer = Buffer.from(received, 'utf8');
  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
}
