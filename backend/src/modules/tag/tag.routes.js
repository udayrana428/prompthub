import { Router } from "express";
import * as tagController from "./tag.controller.js";
import { listTagsSchema, tagPromptsSchema } from "./tag.validation.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = Router();

// All public — no auth required
router.get("/", validate(listTagsSchema, "query"), tagController.listTags);
router.get("/:slug", tagController.getTagBySlug);
router.get(
  "/:slug/prompts",
  validate(tagPromptsSchema, "query"),
  tagController.getTagPrompts,
);

export default router;
