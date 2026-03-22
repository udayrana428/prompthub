// src/jobs/queues.js
import { Queue } from "bullmq";
import { redisConnection } from "./redis.connection.js";

// All queues defined in one place — never instantiate queues ad-hoc
export const moderationQueue = new Queue("moderation", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 4,
    backoff: {
      type: "exponential",
      delay: 2000, // 2s, 4s, 8s, 16s
    },
    removeOnComplete: { count: 500 }, // keep last 500 completed jobs for visibility
    removeOnFail: { count: 1000 }, // keep last 1000 failed jobs for debugging
  },
});

export const trendingQueue = new Queue("trending", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 200 },
  },
});
