// src/config/redis.config.js
import Redis from "ioredis";
import logger from "../logger/winston.logger.js";

let redis = null;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: false, // ← connect eagerly so block checks work immediately
    retryStrategy: (times) => {
      if (times > 5) return null; // stop retrying after 5 attempts
      return Math.min(times * 500, 3000); // 500ms, 1s, 1.5s, 2s, 2.5s, 3s
    },
  });

  redis.on("connect", () => logger.info("✅ Redis connected"));
  redis.on("ready", () => logger.info("✅ Redis ready"));
  redis.on("error", (err) => logger.error("Redis error:", err.message));
  redis.on("close", () => logger.warn("⚠️  Redis connection closed"));
}

export default redis;
