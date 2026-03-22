import { Router } from "express";
import * as authController from "./auth.controller.js";
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} from "./auth.validation.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import {
  authRateLimiter,
  strictRateLimiter,
} from "../../middlewares/rateLimiter.middleware.js";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  authController.register,
);
router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema),
  authController.login,
);
router.post("/refresh", authController.refreshTokens);
router.get("/refresh", authController.refreshTokens);
router.post("/logout", requireAuth, authController.logout);
router.post("/logout-all", requireAuth, authController.logoutAll);
router.post(
  "/change-password",
  requireAuth,
  strictRateLimiter,
  validate(changePasswordSchema),
  authController.changePassword,
);
router.get("/me", requireAuth, authController.me);

export default router;
