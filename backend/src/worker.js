import "dotenv/config";
import { initJobs } from "./jobs/index.js";
import logger from "./logger/winston.logger.js";
import express from "express";

const app = express();

app.get("/health", (req, res) => res.send("OK"));
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

app.listen(10000, () => {
  logger.info("🚀 Worker + HTTP running");
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
