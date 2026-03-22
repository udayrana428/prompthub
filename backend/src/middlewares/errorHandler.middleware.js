import logger from "../logger/winston.logger.js";
import { ApiError } from "../shared/utils/ApiError.js";
import { asyncHandler } from "../shared/utils/asyncHandler.js";
import { Prisma } from "@prisma/client";

import multer from "multer";

/**
 *
 * @param {Error | ApiError} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 *
 * @description This middleware is responsible to catch the errors from any request handler wrapped inside the {@link asyncHandler}
 */
const globalErrorHandler = (err, req, res, next) => {
  let error = err;

  // ── Prisma known errors ──────────────────────────────────────────────────────
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      // MySQL returns constraint name as a string e.g. "Role_name_key"
      // PostgreSQL returns field array e.g. ["name"]
      // Handle both safely
      const target = error.meta?.target;

      let fieldList = "field";

      if (Array.isArray(target)) {
        // PostgreSQL
        fieldList = target.join(", ");
      } else if (typeof target === "string") {
        // MySQL — constraint name format is "ModelName_fieldName_key"
        // Extract the field name from the middle
        // "Role_name_key" → "name"
        // "Role_code_key" → "code"
        const parts = target.split("_");
        // Remove first (model name) and last ("key"), join the rest
        fieldList = parts.slice(1, -1).join("_");
      }

      error = ApiError.conflict(
        `A record with this ${fieldList} already exists.`,
      );
    } else if (error.code === "P2025") {
      error = ApiError.notFound("Record not found.");
    } else if (error.code === "P2003") {
      error = ApiError.badRequest(
        "Related record not found. Check the provided IDs.",
      );
    }
  }

  // ── Prisma validation errors ─────────────────────────────────────────────────
  if (error instanceof Prisma.PrismaClientValidationError) {
    error = ApiError.badRequest("Invalid data provided.");
  }

  // Standardize into ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = error.status || 500;
    const message = error.message || "Internal Server Error";

    error = new ApiError(statusCode, message, error.errors || [], err.stack);
  }

  // Log server errors
  if (error.statusCode >= 500) {
    logger.error(`[${req.method}] ${req.originalUrl} → ${error.message}`, {
      stack: error.stack,
      body: req.body,
    });
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "We're sorry for the inconvenience. Please try again after some time.",
    errors: error.errors,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  if (error.statusCode === 405 && err.allowed) {
    res.setHeader("Allow", err.allowed.map((m) => m.toUpperCase()).join(", "));
  }

  return res.status(error.statusCode).json(response);
};

const multerErrorHandler = async (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(new ApiError(413, "File too large"));
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return next(new ApiError(400, "Invalid file type"));
    }
  }

  next(err);
};

export { globalErrorHandler, multerErrorHandler };
