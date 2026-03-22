import "dotenv/config";
import { httpServer } from "./app.js";
import { connectDB } from "./db/index.js";
import logger from "./logger/winston.logger.js";
import { appConfig } from "./config/app.config.js";
import { initJobs } from "./jobs/index.js";
// import { initJobs } from "./jobs/index.js";

const start = async () => {
  try {
    await connectDB();

    httpServer.listen(appConfig.port, () => {
      logger.info(
        `🚀 Server running on port ${appConfig.port} [${appConfig.env}]`,
      );
    });

    initJobs();
  } catch (err) {
    logger.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  httpServer.close(() => {
    logger.info("HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});

start();
