import { loadApiConfig } from '@stixmagic/config';
import { buildApp } from './app.js';
import { processOneJob } from './jobs/worker.js';

const config = loadApiConfig();
const app = await buildApp();

if (process.env.ENABLE_JOB_WORKER === 'true') {
  setInterval(async () => {
    try {
      await processOneJob();
    } catch (error) {
      app.log.error({ err: error }, 'job worker iteration failed');
    }
  }, 1_000).unref();
}

await app.listen({ host: '0.0.0.0', port: config.API_PORT });
