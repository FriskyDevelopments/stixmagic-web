import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export type JobType = 'trigger.execute' | 'sticker.process' | 'sticker.publish';

export interface JobRecord<T = Record<string, unknown>> {
  id: string;
  jobType: JobType;
  payload: T;
  status: 'queued' | 'processing' | 'retry' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
  runAt: string;
  lastError?: string;
}

const jobsPath = path.resolve(process.cwd(), 'data/jobs.json');
let cache: JobRecord[] | null = null;

async function loadJobs(): Promise<JobRecord[]> {
  if (cache) return cache;
  try {
    cache = JSON.parse(await readFile(jobsPath, 'utf8')) as JobRecord[];
  } catch {
    cache = [];
    await persistJobs(cache);
  }
  return cache;
}

async function persistJobs(jobs: JobRecord[]): Promise<void> {
  await mkdir(path.dirname(jobsPath), { recursive: true });
  await writeFile(jobsPath, JSON.stringify(jobs, null, 2));
}

export async function enqueueJob(jobType: JobType, payload: Record<string, unknown>, runAt = new Date()): Promise<string> {
  const jobs = await loadJobs();
  const job: JobRecord = {
    id: randomUUID(),
    jobType,
    payload,
    status: 'queued',
    attempts: 0,
    maxAttempts: 3,
    runAt: runAt.toISOString()
  };
  jobs.push(job);
  await persistJobs(jobs);
  return job.id;
}

export async function claimNextJob(): Promise<JobRecord | null> {
  const jobs = await loadJobs();
  const now = Date.now();
  const job = jobs.find((item) => ['queued', 'retry'].includes(item.status) && Date.parse(item.runAt) <= now);
  if (!job) return null;
  job.status = 'processing';
  await persistJobs(jobs);
  return job;
}

export async function markJobCompleted(jobId: string): Promise<void> {
  const jobs = await loadJobs();
  const job = jobs.find((item) => item.id === jobId);
  if (!job) return;
  job.status = 'completed';
  await persistJobs(jobs);
}

export async function markJobFailed(job: JobRecord, error: Error): Promise<void> {
  const jobs = await loadJobs();
  const current = jobs.find((item) => item.id === job.id);
  if (!current) return;
  current.attempts += 1;
  current.lastError = error.message;
  current.status = current.attempts >= current.maxAttempts ? 'failed' : 'retry';
  current.runAt = new Date(Date.now() + 30_000).toISOString();
  await persistJobs(jobs);
}
