import { Router } from "express";
import * as Controller from "./admin.prompt.controller.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import {
  requireRole,
} from "../../../middlewares/auth.middleware.js";
import { imageUpload } from "../../../middlewares/multer.middleware.js";
import {
  createAdminPromptSchema,
  listAdminPromptsSchema,
  updateAdminPromptFeaturedSchema,
  updateAdminPromptSchema,
  updateAdminPromptStatusSchema,
} from "./admin.prompt.validation.js";

const router = Router();

router.use(requireRole("SUPER_ADMIN", "ADMIN", "MODERATOR"));

router.get("/", validate(listAdminPromptsSchema, "query"), Controller.listPrompts);

router.post(
  "/",
  imageUpload.single("image"),
  validate(createAdminPromptSchema),
  Controller.createPrompt,
);

router.patch(
  "/:id/status",
  validate(updateAdminPromptStatusSchema),
  Controller.updatePromptStatus,
);

router.patch(
  "/:id/featured",
  validate(updateAdminPromptFeaturedSchema),
  Controller.updatePromptFeatured,
);

router.get("/:id", Controller.getPrompt);

router.patch(
  "/:id",
  imageUpload.single("image"),
  validate(updateAdminPromptSchema),
  Controller.updatePrompt,
);

router.delete("/:id", Controller.deletePrompt);

export default router;
