import { claimNextJob, markJobCompleted, markJobFailed, type JobRecord } from './queue.js';
import { telegramStickerService } from '../telegram/stickerService.js';

async function processJob(job: JobRecord): Promise<void> {
  switch (job.jobType) {
    case 'trigger.execute':
      return;
    case 'sticker.process':
      return;
    case 'sticker.publish': {
      await telegramStickerService.publishStickerJob(job.payload);
      return;
    }
    default:
      throw new Error(`Unsupported job type: ${job.jobType satisfies never}`);
  }
}

export async function processOneJob(): Promise<boolean> {
  const job = await claimNextJob();
  if (!job) return false;

  try {
    await processJob(job);
    await markJobCompleted(job.id);
  } catch (error) {
    await markJobFailed(job, error instanceof Error ? error : new Error('Unknown worker error'));
  }

  return true;
}
