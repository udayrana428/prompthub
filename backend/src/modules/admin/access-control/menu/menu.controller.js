import { MSG } from "../../../../constants/messages.js";
import { ApiResponse } from "../../../../shared/utils/ApiResponse.js";
import { asyncHandler } from "../../../../shared/utils/asyncHandler.js";
import * as service from "./menu.service.js";

export const createMenu = asyncHandler(async (req, res) => {
  const menu = await service.createMenu(req.body, req.user.id);
  ApiResponse.created(res, { menu }, MSG.MENU.CREATED);
});

export const getAllMenus = asyncHandler(async (req, res) => {
  const menus = await service.getAllMenus(req.query);
  ApiResponse.success(res, { menus }, MSG.MENU.LIST_FETCHED);
});

export const getMenuById = asyncHandler(async (req, res) => {
  const menu = await service.getMenuById(req.params.menuId);
  ApiResponse.success(res, { menu }, MSG.MENU.FETCHED);
});

export const updateMenu = asyncHandler(async (req, res) => {
  const menu = await service.updateMenu(
    req.params.menuId,
    req.body,
    req.user.id,
  );
  ApiResponse.success(res, { menu }, MSG.MENU.UPDATED);
});

export const deleteMenu = asyncHandler(async (req, res) => {
  await service.deleteMenu(req.params.menuId, req.user.id);
  ApiResponse.success(res, null, MSG.MENU.DELETED);
});

export const reorderMenus = asyncHandler(async (req, res) => {
  await service.reorderMenus(req.body.items, req.user.id);
  ApiResponse.success(res, null, MSG.MENU.REORDERED);
});

export const getMenuRoles = asyncHandler(async (req, res) => {
  const roles = await service.getMenuRoles(req.params.menuId);
  ApiResponse.success(res, { roles }, MSG.MENU.FETCHED);
});

export const getCurrentUserMenus = asyncHandler(async (req, res) => {
  const menus = await service.getCurrentUserMenus(req.user);
  ApiResponse.success(res, { menus }, MSG.MENU.LIST_FETCHED);
});
