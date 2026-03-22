import { Router } from "express";
import * as Controller from "./menu.controller.js";
import { validate } from "../../../../middlewares/validate.middleware.js";
import { requirePermission } from "../../../../middlewares/auth.middleware.js";
import {
  createMenuSchema,
  updateMenuSchema,
  reorderMenusSchema,
  listMenusSchema,
} from "./menu.validation.js";

const router = Router();

// ⚠️ Static routes MUST come before /:menuId
router.get("/current-user-menus", Controller.getCurrentUserMenus);
router.put(
  "/reorder",
  requirePermission("MENU_UPDATE"),
  validate(reorderMenusSchema),
  Controller.reorderMenus,
);

// CRUD
router.post(
  "/",
  requirePermission("MENU_CREATE"),
  validate(createMenuSchema),
  Controller.createMenu,
);
router.get(
  "/",
  requirePermission("MENU_READ"),
  validate(listMenusSchema, "query"),
  Controller.getAllMenus,
);
router.get("/:menuId", requirePermission("MENU_READ"), Controller.getMenuById);
router.patch(
  "/:menuId",
  requirePermission("MENU_UPDATE"),
  validate(updateMenuSchema),
  Controller.updateMenu,
);
router.delete(
  "/:menuId",
  requirePermission("MENU_DELETE"),
  Controller.deleteMenu,
);
router.get(
  "/:menuId/roles",
  requirePermission("MENU_READ"),
  Controller.getMenuRoles,
);

export default router;
