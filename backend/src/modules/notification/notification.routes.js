import { Router } from "express";
import * as notifController from "./notification.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, notifController.getMyNotifications);
router.patch("/read-all", requireAuth, notifController.markAllRead);
router.patch("/:id/read", requireAuth, notifController.markOneRead);

export default router;
