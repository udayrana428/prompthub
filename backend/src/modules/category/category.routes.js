import { Router } from "express";
import * as categoryController from "./category.controller.js";
import {
  listCategoriesSchema,
  categoryPromptsSchema,
} from "./category.validation.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = Router();

// ─── Public ───────────────────────────────────────────────────────────────────
router.get(
  "/",
  validate(listCategoriesSchema, "query"),
  categoryController.listCategories,
);
router.get("/:slug", categoryController.getCategoryBySlug);
router.get(
  "/:slug/prompts",
  validate(categoryPromptsSchema, "query"),
  categoryController.getCategoryPrompts,
);

export default router;
