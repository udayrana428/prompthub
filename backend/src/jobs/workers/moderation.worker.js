// src/jobs/workers/moderation.worker.js
import { Worker } from "bullmq";
import { redisConnection } from "../redis.connection.js";
import { runAIModeration } from "../../shared/services/moderation.service.js";
import {
  logModeration,
  updatePromptStatus,
} from "../../modules/prompt/prompt.repository.js";
import { notify } from "../../modules/notification/notification.service.js";
import { PromptStatus } from "../../constants/enums.js";
import logger from "../../logger/winston.logger.js";

export const createModerationWorker = () =>
  new Worker(
    "moderation",
    async (job) => {
      const { promptId, authorId, text, isUpdate } = job.data;
      const triggeredBy = isUpdate ? "ai-classifier-update" : "ai-classifier";

      logger.info(
        `Moderating prompt ${promptId} (attempt ${job.attemptsMade + 1})`,
      );

      const result = await runAIModeration(text);

      if (result.flagged || result.score > 0.7) {
        await updatePromptStatus(
          promptId,
          PromptStatus.REJECTED,
          "Content flagged by automated moderation.",
        );
        await logModeration(
          promptId,
          "AUTO_REJECTED",
          "Flagged by AI classifier",
          result.score,
          triggeredBy,
        );

        notify({
          userId: authorId,
          type: "PROMPT_REJECTED",
          referenceId: promptId,
          referenceType: "PROMPT",
        }).catch(() => {});

        logger.info(
          `Prompt ${promptId} auto-rejected (score: ${result.score.toFixed(2)})`,
        );
      } else if (result.score < 0.2) {
        await updatePromptStatus(promptId, PromptStatus.APPROVED);
        await logModeration(
          promptId,
          "AUTO_APPROVED",
          null,
          result.score,
          triggeredBy,
        );

        notify({
          userId: authorId,
          type: "PROMPT_APPROVED",
          referenceId: promptId,
          referenceType: "PROMPT",
        }).catch(() => {});

        logger.info(
          `Prompt ${promptId} auto-approved (score: ${result.score.toFixed(2)})`,
        );
      } else {
        await logModeration(
          promptId,
          "FLAGGED_FOR_REVIEW",
          "Ambiguous score",
          result.score,
          triggeredBy,
        );

        logger.info(
          `Prompt ${promptId} escalated to manual review (score: ${result.score.toFixed(2)})`,
        );
      }
    },
    {
      connection: redisConnection,
      concurrency: 5,
    },
  );
