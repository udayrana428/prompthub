import { Router } from "express";
import * as Controller from "./role.controller.js";
import { validate } from "../../../../middlewares/validate.middleware.js";
import { requirePermission } from "../../../../middlewares/auth.middleware.js";
import {
  createRoleSchema,
  updateRoleSchema,
  listRolesSchema,
  replacePermissionsSchema,
  replaceMenusSchema,
} from "./role.validation.js";

const router = Router();

// CRUD
router.post(
  "/",
  requirePermission("ROLE_CREATE"),
  validate(createRoleSchema),
  Controller.createRole,
);
router.get(
  "/",
  requirePermission("ROLE_READ"),
  validate(listRolesSchema, "query"),
  Controller.getAllRoles,
);
router.get("/:roleId", requirePermission("ROLE_READ"), Controller.getRoleById);
router.patch(
  "/:roleId",
  requirePermission("ROLE_UPDATE"),
  validate(updateRoleSchema),
  Controller.updateRole,
);
router.delete(
  "/:roleId",
  requirePermission("ROLE_DELETE"),
  Controller.deleteRole,
);

// Permissions
router.get(
  "/:roleId/permissions",
  requirePermission("ROLE_READ"),
  Controller.getRolePermissions,
);
router.put(
  "/:roleId/permissions",
  requirePermission("ROLE_UPDATE"),
  validate(replacePermissionsSchema),
  Controller.replaceRolePermissions,
);
router.post(
  "/:roleId/permissions/:permissionId",
  requirePermission("ROLE_UPDATE"),
  Controller.addRolePermission,
);
router.delete(
  "/:roleId/permissions/:permissionId",
  requirePermission("ROLE_UPDATE"),
  Controller.removeRolePermission,
);

// Menus
router.get(
  "/:roleId/menus",
  requirePermission("ROLE_READ"),
  Controller.getRoleMenus,
);
router.put(
  "/:roleId/menus",
  requirePermission("ROLE_UPDATE"),
  validate(replaceMenusSchema),
  Controller.replaceRoleMenus,
);
router.post(
  "/:roleId/menus/:menuId",
  requirePermission("ROLE_UPDATE"),
  Controller.addRoleMenu,
);
router.delete(
  "/:roleId/menus/:menuId",
  requirePermission("ROLE_UPDATE"),
  Controller.removeRoleMenu,
);

// Users
router.get(
  "/:roleId/users",
  requirePermission("ROLE_READ"),
  Controller.getRoleUsers,
);

export default router;
