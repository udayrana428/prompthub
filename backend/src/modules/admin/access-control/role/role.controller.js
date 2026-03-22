import { MSG } from "../../../../constants/messages.js";
import { ApiResponse } from "../../../../shared/utils/ApiResponse.js";
import { asyncHandler } from "../../../../shared/utils/asyncHandler.js";
import * as service from "./role.service.js";

export const createRole = asyncHandler(async (req, res) => {
  const role = await service.createRole(req.body, req.user.id);
  ApiResponse.created(res, { role }, MSG.ROLE.CREATED);
});

export const getAllRoles = asyncHandler(async (req, res) => {
  const result = await service.listRoles(req.query);
  ApiResponse.success(res, result, MSG.ROLE.LIST_FETCHED);
});

export const getRoleById = asyncHandler(async (req, res) => {
  const role = await service.getRoleById(req.params.roleId);
  ApiResponse.success(res, { role }, MSG.ROLE.FETCHED);
});

export const updateRole = asyncHandler(async (req, res) => {
  const role = await service.updateRole(
    req.params.roleId,
    req.body,
    req.user.id,
  );
  ApiResponse.success(res, { role }, MSG.ROLE.UPDATED);
});

export const deleteRole = asyncHandler(async (req, res) => {
  await service.deleteRole(req.params.roleId, req.user.id);
  ApiResponse.success(res, null, MSG.ROLE.DELETED);
});

// Permissions
export const getRolePermissions = asyncHandler(async (req, res) => {
  const permissions = await service.getRolePermissions(req.params.roleId);
  ApiResponse.success(res, { permissions }, MSG.ROLE.FETCHED);
});

export const replaceRolePermissions = asyncHandler(async (req, res) => {
  await service.replaceRolePermissions(
    req.params.roleId,
    req.body.permissionIds,
    req.user.id,
  );
  ApiResponse.success(res, null, MSG.ROLE.PERMISSIONS_REPLACED);
});

export const addRolePermission = asyncHandler(async (req, res) => {
  await service.addRolePermission(
    req.params.roleId,
    req.params.permissionId,
    req.user.id,
  );
  ApiResponse.success(res, null, MSG.ROLE.PERMISSION_ASSIGNED);
});

export const removeRolePermission = asyncHandler(async (req, res) => {
  await service.removeRolePermission(
    req.params.roleId,
    req.params.permissionId,
  );
  ApiResponse.success(res, null, MSG.ROLE.PERMISSION_REMOVED);
});

// Menus
export const getRoleMenus = asyncHandler(async (req, res) => {
  const menus = await service.getRoleMenus(req.params.roleId);
  ApiResponse.success(res, { menus }, MSG.ROLE.FETCHED);
});

export const replaceRoleMenus = asyncHandler(async (req, res) => {
  await service.replaceRoleMenus(
    req.params.roleId,
    req.body.menuIds,
    req.user.id,
  );
  ApiResponse.success(res, null, MSG.ROLE.MENUS_REPLACED);
});

export const addRoleMenu = asyncHandler(async (req, res) => {
  await service.addRoleMenu(req.params.roleId, req.params.menuId, req.user.id);
  ApiResponse.success(res, null, MSG.ROLE.MENU_ASSIGNED);
});

export const removeRoleMenu = asyncHandler(async (req, res) => {
  await service.removeRoleMenu(req.params.roleId, req.params.menuId);
  ApiResponse.success(res, null, MSG.ROLE.MENU_REMOVED);
});

export const getRoleUsers = asyncHandler(async (req, res) => {
  const users = await service.getRoleUsers(req.params.roleId);
  ApiResponse.success(res, { users }, MSG.ROLE.FETCHED);
});
