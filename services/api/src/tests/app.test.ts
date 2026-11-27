import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

process.env = {
  NODE_ENV: 'test',
  POSTGRES_URL: 'postgres://test:test@localhost:5432/test',
  S3_ENDPOINT: 'http://localhost:9000',
  S3_REGION: 'us-east-1',
  S3_BUCKET: 'test',
  S3_ACCESS_KEY: 'test',
  S3_SECRET_KEY: 'test',
  TELEGRAM_BOT_TOKEN: 'test-token',
  TELEGRAM_MINI_APP_URL: 'http://localhost:3000',
  STIXMAGIC_API_BASE_URL: 'http://localhost:4000',
  STIXMAGIC_PUBLIC_WEB_URL: 'http://localhost:3000',
  ADMIN_TELEGRAM_USER_ID: '42'
};

function initData(userId: number, botToken = 'test-token'): string {
  const params = new URLSearchParams({
    auth_date: String(Math.floor(Date.now() / 1000)),
    user: JSON.stringify({ id: userId })
  });
  const check = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  const secret = createHmac('sha256', 'WebAppData').update(botToken).digest();
  params.set('hash', createHmac('sha256', secret).update(check).digest('hex'));
  return params.toString();
}

test('job processing requires an authenticated admin', async (t) => {
  const originalDir = process.cwd();
  const testDir = await mkdtemp(path.join(originalDir, 'app-test-'));
  process.chdir(testDir);
  t.after(async () => {
    process.chdir(originalDir);
    await rm(testDir, { recursive: true, force: true });
  });

  const { buildApp } = await import('../app.js');
  const { enqueueJob } = await import('../jobs/queue.js');
  const app = await buildApp();
  t.after(() => app.close());

  const jobId = await enqueueJob('trigger.execute', { updateId: 1, message: null });
  const requests = [
    { headers: {}, statusCode: 401 },
    { headers: { 'x-telegram-init-data': initData(42, 'wrong-token') }, statusCode: 401 },
    { headers: { 'x-telegram-init-data': initData(43) }, statusCode: 403 }
  ];

  for (const { headers, statusCode } of requests) {
    const response = await app.inject({ method: 'POST', url: '/internal/jobs/process-once', headers });
    assert.equal(response.statusCode, statusCode);
    const jobs = JSON.parse(await readFile(path.join(testDir, 'data/jobs.json'), 'utf8'));
    assert.equal(jobs.find((job: { id: string }) => job.id === jobId)?.status, 'queued');
  }

  const response = await app.inject({
    method: 'POST',
    url: '/internal/jobs/process-once',
    headers: { 'x-telegram-init-data': initData(42) }
  });
  assert.equal(response.statusCode, 200);
  assert.equal(response.json().data.processed, true);
  const jobs = JSON.parse(await readFile(path.join(testDir, 'data/jobs.json'), 'utf8'));
  assert.equal(jobs.find((job: { id: string }) => job.id === jobId)?.status, 'completed');

  const health = await app.inject({ method: 'GET', url: '/health' });
  assert.equal(health.statusCode, 200);
});