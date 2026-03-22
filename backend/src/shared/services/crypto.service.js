import bcrypt from "bcrypt";
import crypto from "crypto";
import { appConfig } from "../../config/app.config.js";

export const hashPassword = (plain) =>
  bcrypt.hash(plain, appConfig.bcrypt.saltRounds);

export const comparePassword = (plain, hash) => bcrypt.compare(plain, hash);

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const generateOTP = (length = 6) => {
  const digits = "0123456789";
  let otp = "";
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    otp += digits[bytes[i] % digits.length];
  }
  return otp;
};

export const generateSecureToken = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");
