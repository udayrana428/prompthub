// src/jobs/index.js
import { moderationQueue, trendingQueue } from "./queues.js";
import { createModerationWorker } from "./workers/moderation.worker.js";
import { createTrendingWorker } from "./workers/trending.worker.js";
import logger from "../logger/winston.logger.js";
import { PromptStatus } from "../constants/enums.js";

export const initJobs = async () => {
  if (process.env.DISABLE_JOBS === "true") {
    logger.info("⏸️  Background jobs disabled.");
    return;
  }

  // ── Guard: skip jobs entirely if Redis is not configured ─────────────────────
  if (!process.env.REDIS_URL && !process.env.REDIS_HOST) {
    logger.warn(
      "⚠️  Redis not configured — BullMQ jobs disabled. Set REDIS_URL to enable.",
    );
    return;
  }

  logger.info("⚙️  Initializing BullMQ workers and schedules...");

  // ── Start workers (they listen for jobs) ─────────────────────────────────────
  const moderationWorker = createModerationWorker();
  const trendingWorker = createTrendingWorker();

  // ── Worker event hooks (observability) ────────────────────────────────────────
  moderationWorker.on("failed", (job, err) => {
    const attemptsLeft = job.opts.attempts - job.attemptsMade;
    if (attemptsLeft > 0) {
      logger.warn(
        `⚠️  Moderation job ${job.id} failed, ${attemptsLeft} retries left. Error: ${err.message}`,
      );
    } else {
      // All retries exhausted — NOW we escalate to manual review
      logger.error(
        `💀 Moderation job ${job.id} exhausted all retries. Prompt ${job.data.promptId} sent to manual review.`,
      );
      handleExhaustedModerationJob(job).catch(() => {});
    }
  });

  trendingWorker.on("failed", (job, err) => {
    logger.error(
      `❌ Trending job ${job.data?.windowType} failed: ${err.message}`,
    );
  });

  moderationWorker.on("error", (err) =>
    logger.error("Moderation worker error:", err),
  );
  trendingWorker.on("error", (err) =>
    logger.error("Trending worker error:", err),
  );

  // ── Schedule repeating trending jobs (cron syntax) ────────────────────────────
  await trendingQueue.add(
    "daily-snapshot",
    { windowType: "DAILY" },
    { repeat: { pattern: "0 * * * *" }, jobId: "daily-snapshot" },
  ); // every hour
  await trendingQueue.add(
    "weekly-snapshot",
    { windowType: "WEEKLY" },
    { repeat: { pattern: "0 */6 * * *" } },
  ); // every 6 hours
  await trendingQueue.add(
    "monthly-snapshot",
    { windowType: "MONTHLY" },
    { repeat: { pattern: "0 0 * * *" } },
  ); // every 24 hours

  // ── Run trending snapshots immediately on startup ─────────────────────────────
  await Promise.all([
    trendingQueue.add(
      "startup-daily",
      { windowType: "DAILY" },
      { delay: 3000 },
    ),
    trendingQueue.add(
      "startup-weekly",
      { windowType: "WEEKLY" },
      { delay: 3000 },
    ),
    trendingQueue.add(
      "startup-monthly",
      { windowType: "MONTHLY" },
      { delay: 3000 },
    ),
  ]);

  logger.info("✅ BullMQ workers started and schedules registered.");
};

// Called ONLY when all 4 retry attempts are exhausted
const handleExhaustedModerationJob = async (job) => {
  const { updatePromptStatus, logModeration } =
    await import("../modules/prompt/prompt.repository.js");
  await updatePromptStatus(
    job.data.promptId,
    PromptStatus.PENDING,
    "AI moderation unavailable after retries",
  );
  await logModeration(
    job.data.promptId,
    "FLAGGED_FOR_REVIEW",
    "AI moderation unavailable after retries",
    null,
  );
};
