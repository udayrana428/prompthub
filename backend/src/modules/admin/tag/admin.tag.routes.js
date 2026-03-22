import { Router } from "express";
import * as Controller from "./admin.tag.controller.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { requirePermission } from "../../../middlewares/auth.middleware.js";
import {
  createTagSchema,
  listAdminTagsSchema,
} from "./admin.tag.validation.js";

const router = Router();

// requireAuth already applied at admin.routes.js level

router.get(
  "/",
  requirePermission("TAG_READ"),
  validate(listAdminTagsSchema, "query"),
  Controller.listTags,
);

router.post(
  "/",
  requirePermission("TAG_CREATE"),
  validate(createTagSchema),
  Controller.createTag,
);

// Static action routes BEFORE /:id param route
router.patch(
  "/:id/approve",
  requirePermission("TAG_APPROVE"),
  Controller.approveTag,
);

router.patch(
  "/:id/reject",
  requirePermission("TAG_REJECT"),
  Controller.rejectTag,
);

router.delete("/:id", requirePermission("TAG_DELETE"), Controller.deleteTag);

export default router;
