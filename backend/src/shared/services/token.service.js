import jwt from "jsonwebtoken";
import { appConfig } from "../../config/app.config.js";
import { ApiError } from "../utils/ApiError.js";

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, appConfig.jwt.accessSecret, {
    expiresIn: appConfig.jwt.accessExpiry,
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, appConfig.jwt.refreshSecret, {
    expiresIn: appConfig.jwt.refreshExpiry,
  });
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, appConfig.jwt.accessSecret);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw ApiError.unauthorized("Access token expired.");
    }
    throw ApiError.unauthorized("Invalid access token.");
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, appConfig.jwt.refreshSecret);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw ApiError.unauthorized(
        "Refresh token expired. Please log in again.",
      );
    }
    throw ApiError.unauthorized("Invalid refresh token.");
  }
};
