import { Router } from "express";
import * as promptController from "./prompt.controller.js";
import {
  listPromptsSchema,
  createPromptSchema,
  updatePromptSchema,
} from "./prompt.validation.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  requireAuth,
  optionalAuth,
} from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = Router();

// Public
router.get(
  "/",
  validate(listPromptsSchema, "query"),
  optionalAuth,
  promptController.listPrompts,
);
router.get("/:id/edit", requireAuth, promptController.getPromptForEdit);
router.get("/:slug", optionalAuth, promptController.getPromptBySlug);

// Authenticated
router.post(
  "/",
  requireAuth,
  upload.single("image"),
  validate(createPromptSchema),
  promptController.createPrompt,
);
router.patch(
  "/:id",
  requireAuth,
  upload.single("image"),
  validate(updatePromptSchema),
  promptController.updatePrompt,
);
router.delete("/:id", requireAuth, promptController.deletePrompt);

// Interactions
router.post("/:id/likes", requireAuth, promptController.likePrompt);
router.delete("/:id/likes", requireAuth, promptController.unlikePrompt);
router.post("/:id/favorites", requireAuth, promptController.favoritePrompt);
router.delete("/:id/favorites", requireAuth, promptController.unfavoritePrompt);
router.post("/:id/copies", optionalAuth, promptController.copyPrompt);

export default router;
