import "dotenv/config";
import { initJobs } from "./jobs/index.js";
import logger from "./logger/winston.logger.js";
import express from "express";
import { appConfig } from "./config/app.config.js";

const app = express();

app.get("/health", (req, res) => res.send("Worker running"));
const startWorker = async () => {
  try {
    logger.info("🚀 Starting BullMQ workers...");
    await initJobs();
  } catch (err) {
    logger.error("❌ Worker failed to start:", err);
    process.exit(1);
  }
};

startWorker();

app.listen(appConfig.port, () => {
  logger.info(`🌐 Worker HTTP server running on port ${appConfig.port}`);
});

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});
