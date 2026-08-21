import { createHmac } from 'node:crypto';
import test from 'node:test';
import assert from 'node:assert/strict';
const originalEnv = { ...process.env };
Object.assign(process.env, {
  POSTGRES_URL: 'postgres://test:test@localhost:5432/test',
  S3_ENDPOINT: 'http://localhost:9000',
  S3_REGION: 'us-east-1',
  S3_BUCKET: 'test',
  S3_ACCESS_KEY: 'test',
  S3_SECRET_KEY: 'test',
  TELEGRAM_BOT_TOKEN: 'test-token',
  TELEGRAM_MINI_APP_URL: 'http://localhost:3000',
  STIXMAGIC_API_BASE_URL: 'http://localhost:4000',
  STIXMAGIC_PUBLIC_WEB_URL: 'http://localhost:3000'
});

const { buildApp } = await import('../app.js');
const { createLoreInviteToken } = await import('../auth/loreAuth.js');

function token(userId: string, role: 'member' | 'admin' = 'member') {
  return createLoreInviteToken({
    userId,
    tenantId: 'lore-test-tenant',
    role,
    expiresAt: Math.floor(Date.now() / 1000) + 3600
  }, 'lore-test-secret');
}

test.beforeEach(() => {
  process.env.LORE_MEMBER_INVITE_SECRET = 'lore-test-secret';
  process.env.LORE_PRIVATE_COMMUNITY_URL = 'https://t.me/+test-private-door';
  process.env.NANGO_API_KEY = 'test-nango-api-key';
  process.env.NANGO_WEBHOOK_SIGNING_KEY = 'lore-webhook-secret';
  process.env.NANGO_GOOGLE_CALENDAR_INTEGRATION_ID = 'google-calendar';
});

test.after(() => {
  process.env = originalEnv;
});

test('member progress is tenant-scoped and unlocks the private drop after Aura discovery', async () => {
  const app = await buildApp();
  const invite = token(`member-${Date.now()}`);

  const me = await app.inject({ method: 'GET', url: '/lore/me', headers: { 'x-lore-invite-token': invite } });
  assert.equal(me.statusCode, 200);
  assert.equal(me.json().data.member.status, 'invited');

  const inProgress = await app.inject({
    method: 'POST',
    url: '/lore/progress',
    headers: { 'x-lore-invite-token': invite },
    payload: { currentStep: 3, status: 'in_progress' }
  });
  assert.equal(inProgress.statusCode, 200);
  assert.equal(inProgress.json().data.member.currentStep, 3);

  const locked = await app.inject({ method: 'POST', url: '/lore/drops/the-soft-machinery/read', headers: { 'x-lore-invite-token': invite } });
  assert.equal(locked.statusCode, 403);

  const complete = await app.inject({
    method: 'POST',
    url: '/lore/progress',
    headers: { 'x-lore-invite-token': invite },
    payload: { currentStep: 6, status: 'complete', auraId: 'deep-water', auraVersion: 'v1' }
  });
  assert.equal(complete.statusCode, 200);

  const drop = await app.inject({ method: 'POST', url: '/lore/drops/the-soft-machinery/read', headers: { 'x-lore-invite-token': invite } });
  assert.equal(drop.statusCode, 200);

  const community = await app.inject({ method: 'GET', url: '/lore/community-destination', headers: { 'x-lore-invite-token': invite } });
  assert.equal(community.statusCode, 200);
  assert.equal(community.json().data.destination, 'https://t.me/+test-private-door');

  await app.close();
});

test('invalid invite tokens cannot read or mutate LORE state', async () => {
  const app = await buildApp();
  const response = await app.inject({ method: 'GET', url: '/lore/me', headers: { 'x-lore-invite-token': 'invalid.token' } });
  assert.equal(response.statusCode, 401);
  await app.close();
});

test('admin funnel reports aggregate events without returning sensitive payloads', async () => {
  const app = await buildApp();
  const memberInvite = token(`member-admin-${Date.now()}`);
  const adminInvite = token(`admin-${Date.now()}`, 'admin');

  const event = await app.inject({
    method: 'POST',
    url: '/lore/events',
    headers: { 'x-lore-invite-token': memberInvite },
    payload: { name: 'journey_started', properties: { surface: 'test' } }
  });
  assert.equal(event.statusCode, 200);

  const funnel = await app.inject({ method: 'GET', url: '/lore/admin/funnel', headers: { 'x-lore-invite-token': adminInvite } });
  assert.equal(funnel.statusCode, 200);
  assert.equal(typeof funnel.json().data.journey_started.events, 'number');
  assert.equal(JSON.stringify(funnel.json()).includes('test'), false);
  assert.equal(JSON.stringify(funnel.json()).includes('member-admin-'), false);

  await app.close();
});

test('Nango auth webhook accepts only the configured HMAC signature and stores no credential fields', async () => {
  const app = await buildApp();
  const body = JSON.stringify({
    type: 'auth',
    operation: 'creation',
    success: true,
    connectionId: 'calendar-connection-1',
    providerConfigKey: 'google-calendar',
    tags: { organization_id: 'lore-test-tenant' }
  });
  const signature = createHmac('sha256', 'lore-webhook-secret').update(body).digest('hex');

  const webhook = await app.inject({
    method: 'POST',
    url: '/integrations/nango/webhook',
    headers: { 'content-type': 'application/json', 'x-nango-hmac-sha256': signature },
    payload: body
  });
  assert.equal(webhook.statusCode, 200);

  process.env.NANGO_API_KEY = '';
  const status = await app.inject({ method: 'GET', url: '/integrations/google-calendar/status', headers: { 'x-lore-invite-token': token(`nango-admin-${Date.now()}`, 'admin') } });
  assert.equal(status.statusCode, 200);
  assert.equal(status.json().data.connection, null);

  const invalid = await app.inject({
    method: 'POST',
    url: '/integrations/nango/webhook',
    headers: { 'content-type': 'application/json', 'x-nango-hmac-sha256': 'bad' },
    payload: body
  });
  assert.equal(invalid.statusCode, 401);

  await app.close();
});
