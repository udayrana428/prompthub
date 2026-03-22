// src/jobs/workers/trending.worker.js
import { Worker } from "bullmq";
import { redisConnection } from "../redis.connection.js";
import { computeAndSaveSnapshots } from "../../modules/trending/trending.service.js";
import logger from "../../logger/winston.logger.js";

export const createTrendingWorker = () =>
  new Worker(
    "trending",
    async (job) => {
      const { windowType } = job.data;
      logger.info(`📊 Running ${windowType} trending snapshot...`);
      const count = await computeAndSaveSnapshots(windowType);
      logger.info(`✅ ${windowType} snapshot done — ${count} prompts ranked.`);
    },
    {
      connection: redisConnection,
      concurrency: 1, // trending snapshots must run one at a time
    },
  );
