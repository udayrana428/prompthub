import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import { limiter } from "./middlewares/rateLimiter.middleware.js";
// import { blockCheckMiddleware } from "./middlewares/rateLimiter.middleware.js";
import {
  globalErrorHandler,
  multerErrorHandler,
} from "./middlewares/errorHandler.middleware.js";
import morganMiddleware from "./logger/morgan.logger.js";
import { apiRouter } from "./routes/index.js";
import { methodNotAllowed } from "./middlewares/methodNotAllowed.middleware.js";
import { corsOptions } from "./config/cors.config.js";
import {
  blockCheckMiddleware,
  globalRateLimiter,
} from "./middlewares/rateLimiter.middleware.js";
import { appConfig } from "./config/app.config.js";
import http from "http";

export const app = express();

app.use(cors(corsOptions));

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(cookieParser());
app.use(express.static("public"));

app.use(morganMiddleware);
app.use(blockCheckMiddleware);
app.use(globalRateLimiter);

app.get("/health", (req, res) => {
  return res.status(200).send({
    uptime: process.uptime(),
    message: "Welcome to PromptHub Backend 🚀🚀🔥",
    date: new Date(),
  });
});

// Route Declaration
app.use(`/api/${appConfig.apiVersion}`, apiRouter);

app.use(methodNotAllowed(app));

app.use("*", (req, res, next) => {
  const err = new Error(`Route ${req.method} ${req.originalUrl} not found.`);
  err.status = 404;
  next(err);
});

app.use(multerErrorHandler);
app.use(globalErrorHandler);

export const httpServer = http.createServer(app);
