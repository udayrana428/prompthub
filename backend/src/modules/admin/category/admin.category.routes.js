import { Router } from "express";
import * as Controller from "./admin.category.controller.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { requirePermission } from "../../../middlewares/auth.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
  listAdminCategoriesSchema,
} from "./admin.category.validation.js";

const router = Router();

// requireAuth already applied at admin router level

router.get(
  "/",
  requirePermission("CATEGORY_READ"),
  validate(listAdminCategoriesSchema, "query"),
  Controller.listCategories,
);

router.post(
  "/",
  requirePermission("CATEGORY_CREATE"),
  validate(createCategorySchema),
  Controller.createCategory,
);

router.patch(
  "/:id",
  requirePermission("CATEGORY_UPDATE"),
  validate(updateCategorySchema),
  Controller.updateCategory,
);

router.delete(
  "/:id",
  requirePermission("CATEGORY_DELETE"),
  Controller.deleteCategory,
);

export default router;
