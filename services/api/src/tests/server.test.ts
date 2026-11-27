import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import path from 'node:path';
import test from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import type { JobRecord } from '../jobs/queue.js';

const serverPath = fileURLToPath(new URL('../server.ts', import.meta.url));
const tsxLoader = import.meta.resolve('tsx');

async function unusedPort(): Promise<number> {
  const server = createServer();
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  assert(address && typeof address !== 'string');
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  return address.port;
}

async function startServer(t: test.TestContext, worker: string) {
  const directory = await mkdtemp(path.join(process.cwd(), '.server-test-'));
  let stopServer: (() => Promise<void>) | undefined;
  t.after(async () => {
    try {
      await stopServer?.();
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
  const jobsPath = path.join(directory, 'data', 'jobs.json');
  await mkdir(path.dirname(jobsPath));
  const jobs: JobRecord[] = [
    { id: 'valid', jobType: 'trigger.execute', payload: { updateId: 1, message: null }, status: 'queued', attempts: 0, maxAttempts: 3, runAt: new Date(0).toISOString() },
    { id: 'invalid', jobType: 'trigger.execute', payload: {}, status: 'queued', attempts: 0, maxAttempts: 3, runAt: new Date(0).toISOString() }
  ];
  await writeFile(jobsPath, JSON.stringify(jobs));
  const port = await unusedPort();
  const child = spawn(process.execPath, ['--import', tsxLoader, serverPath], {
    cwd: directory,
    env: {
      NODE_ENV: 'test',
      API_PORT: String(port),
      ENABLE_JOB_WORKER: worker,
      POSTGRES_URL: 'postgres://test:test@localhost:5432/test',
      S3_ENDPOINT: 'http://localhost:9000',
      S3_REGION: 'test',
      S3_BUCKET: 'test',
      S3_ACCESS_KEY: 'test',
      S3_SECRET_KEY: 'test',
      TELEGRAM_BOT_TOKEN: 'test-token',
      TELEGRAM_MINI_APP_URL: 'http://localhost:3000',
      STIXMAGIC_API_BASE_URL: 'http://localhost:4000',
      STIXMAGIC_PUBLIC_WEB_URL: 'http://localhost:3000'
    },
    stdio: ['ignore', 'ignore', 'pipe']
  });
  let stderr = '';
  child.stderr.setEncoding('utf8').on('data', (data: string) => { stderr += data; });
  const exited = new Promise<void>((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', () => resolve());
  });
  stopServer = async () => {
    if (child.exitCode === null && child.signalCode === null) child.kill();
    await exited;
  };

  const baseUrl = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null || child.signalCode !== null) throw new Error(`Server exited during startup: ${stderr}`);
    let response: Response;
    try {
      response = await fetch(`${baseUrl}/health`);
    } catch (error) {
      if (!(error instanceof TypeError)) throw error;
      await delay(100);
      continue;
    }
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true, data: { service: 'api', status: 'up' } });
    return { baseUrl, jobsPath, child };
  }
  throw new Error(`Server did not start: ${stderr}`);
}

async function readJobs(jobsPath: string): Promise<JobRecord[]> {
  return JSON.parse(await readFile(jobsPath, 'utf8')) as JobRecord[];
}

test('server listens on the configured port without starting the worker for non-true values', async (t) => {
  const { baseUrl, jobsPath, child } = await startServer(t, 'TRUE');
  await delay(1_500);
  assert.equal(child.exitCode, null);
  assert.deepEqual((await readJobs(jobsPath)).map((job) => job.status), ['queued', 'queued']);

  const response = await fetch(`${baseUrl}/internal/jobs/process-once`, { method: 'POST' });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, data: { processed: true } });
  assert.deepEqual((await readJobs(jobsPath)).map((job) => job.status), ['completed', 'queued']);
});

test('enabled worker processes jobs and records failures without stopping the server', async (t) => {
  const { baseUrl, jobsPath, child } = await startServer(t, 'true');
  const deadline = Date.now() + 8_000;
  let jobs = await readJobs(jobsPath);
  while (jobs[1].status !== 'retry' && Date.now() < deadline) {
    assert.equal(child.exitCode, null);
    await delay(100);
    jobs = await readJobs(jobsPath);
  }
  assert.equal(jobs[0].status, 'completed');
  assert.equal(jobs[1].status, 'retry');
  assert.equal(jobs[1].attempts, 1);
  assert.ok(jobs[1].lastError);
  assert.equal((await fetch(`${baseUrl}/health`)).status, 200);
});