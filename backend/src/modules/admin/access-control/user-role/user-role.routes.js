import { Router } from "express";
import * as Controller from "./user-role.controller.js";
import { validate } from "../../../../middlewares/validate.middleware.js";
import { requirePermission } from "../../../../middlewares/auth.middleware.js";
import { assignUserRolesSchema } from "./user-role.validation.js";

const router = Router();

router.get(
  "/:userId/roles",
  requirePermission("USER_ROLE_READ"),
  Controller.getUserRoles,
);
//This endpoint is used to replace all roles of a user
router.put(
  "/:userId/roles",
  requirePermission("USER_ROLE_ASSIGN"),
  validate(assignUserRolesSchema),
  Controller.assignUserRoles,
);
router.post(
  "/:userId/roles/:roleId",
  requirePermission("USER_ROLE_ASSIGN"),
  Controller.addUserRole,
);
router.delete(
  "/:userId/roles/:roleId",
  requirePermission("USER_ROLE_ASSIGN"),
  Controller.removeUserRole,
);

export default router;
