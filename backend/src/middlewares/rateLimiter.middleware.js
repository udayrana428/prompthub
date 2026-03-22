// src/middlewares/rateLimiter.middleware.js
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import requestIp from "request-ip";
import logger from "../logger/winston.logger.js";
import redis from "../config/redis.config.js";
import { MSG } from "../constants/messages.js";

// ─── Config ───────────────────────────────────────────────────────────────────
const VIOLATION_BLOCK_THRESHOLD = 10; // violations before IP is hard-blocked
const VIOLATION_WINDOW_MS = 24 * 60 * 60 * 1000; // violation counter TTL: 24h
const BLOCK_DURATION_MS = 24 * 60 * 60 * 1000; // how long the block lasts: 24h

// ─── IP extractor (consistent across all middleware) ──────────────────────────
const getIp = (req) => ipKeyGenerator(req) || req.ip || "unknown";

// ─── Redis helpers (all fail-open if Redis is unavailable) ────────────────────
const redisGet = async (key) => {
  if (!redis) return null;
  try {
    return await redis.get(key);
  } catch (err) {
    logger.warn(`Redis GET failed for key ${key}:`, err.message);
    return null;
  }
};

const redisIncr = async (key, ttlMs) => {
  if (!redis) return null;
  try {
    const count = await redis.incr(key);
    if (count === 1) await redis.pexpire(key, ttlMs); // set TTL only on first increment
    return count;
  } catch (err) {
    logger.warn(`Redis INCR failed for key ${key}:`, err.message);
    return null;
  }
};

const redisSet = async (key, value, ttlMs) => {
  if (!redis) return null;
  try {
    return await redis.set(key, value, "PX", ttlMs);
  } catch (err) {
    logger.warn(`Redis SET failed for key ${key}:`, err.message);
    return null;
  }
};

// ─── Block check middleware ───────────────────────────────────────────────────
// Mount this BEFORE all routes in app.js
export const blockCheckMiddleware = async (req, res, next) => {
  const ip = getIp(req);

  const isBlocked = await redisGet(`blocked:${ip}`);

  if (isBlocked) {
    logger.warn(`🚫 Blocked IP attempted access: ${ip} → ${req.originalUrl}`);
    return res.status(403).json({
      success: false,
      statusCode: 403,
      message:
        "Your IP has been temporarily blocked due to repeated abuse. Try again in 24 hours.",
    });
  }

  next();
};

// ─── Violation tracker (called inside rate limit handler on each 429) ─────────
const trackViolation = async (ip, endpoint) => {
  const count = await redisIncr(`violations:${ip}`, VIOLATION_WINDOW_MS);

  logger.warn(
    `⚠️  Rate limit exceeded — IP: ${ip} | Endpoint: ${endpoint} | Violations: ${count ?? "unknown"}`,
  );

  if (count !== null && count >= VIOLATION_BLOCK_THRESHOLD) {
    await redisSet(`blocked:${ip}`, "1", BLOCK_DURATION_MS);
    logger.warn(`🚫 IP blocked for 24h — IP: ${ip} | Violations: ${count}`);
  }
};

// ─── Limiter factory ──────────────────────────────────────────────────────────
const createLimiter = ({ windowMs, max, message }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true, // Return RateLimit-* headers
    legacyHeaders: false, // Disable X-RateLimit-* headers
    keyGenerator: getIp,

    handler: async (req, res, options) => {
      const ip = getIp(req);
      await trackViolation(ip, req.originalUrl);

      res.status(429).json({
        success: false,
        statusCode: 429,
        message,
      });
    },
  });

// ─── Exported limiters ────────────────────────────────────────────────────────

// Global: 300 requests per 15 minutes
export const globalRateLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: MSG.GENERIC.RATE_LIMIT_EXCEEDED,
});

// Auth routes: 10 attempts per 15 minutes
export const authRateLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many authentication attempts. Please try again later.",
});

// Sensitive operations: 5 per hour (password change, email verify)
export const strictRateLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: "Too many requests for this action. Please try again in an hour.",
});
