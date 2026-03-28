import assert from 'node:assert/strict';
import test from 'node:test';
import { enqueueJob, claimNextJob, markJobCompleted } from '../jobs/queue.js';

test('jobs can be enqueued and claimed', async () => {
  const id = await enqueueJob('trigger.execute', { messageId: 1 });
  const job = await claimNextJob();
  assert.equal(job?.id, id);
  if (job) {
    await markJobCompleted(job.id);
  }
});
