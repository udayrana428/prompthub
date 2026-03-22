import { Router } from "express";
import * as Controller from "./permission.controller.js";
import { validate } from "../../../../middlewares/validate.middleware.js";
import { requirePermission } from "../../../../middlewares/auth.middleware.js";
import {
  createPermissionSchema,
  updatePermissionSchema,
  listPermissionsSchema,
} from "./permission.validation.js";

const router = Router();

router.post(
  "/",
  requirePermission("PERMISSION_CREATE"),
  validate(createPermissionSchema),
  Controller.createPermission,
);

router.get(
  "/",
  requirePermission("PERMISSION_READ"),
  validate(listPermissionsSchema, "query"),
  Controller.getAllPermissions,
);

router.get(
  "/:permissionId",
  requirePermission("PERMISSION_READ"),
  Controller.getPermissionById,
);

router.patch(
  "/:permissionId",
  requirePermission("PERMISSION_UPDATE"),
  validate(updatePermissionSchema),
  Controller.updatePermission,
);

router.delete(
  "/:permissionId",
  requirePermission("PERMISSION_DELETE"),
  Controller.deletePermission,
);

router.get(
  "/:permissionId/roles",
  requirePermission("PERMISSION_READ"),
  Controller.getPermissionRoles,
);

export default router;
