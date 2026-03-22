import { MSG } from "../../../../constants/messages.js";
import { ApiResponse } from "../../../../shared/utils/ApiResponse.js";
import { asyncHandler } from "../../../../shared/utils/asyncHandler.js";
import * as service from "./permission.service.js";

export const createPermission = asyncHandler(async (req, res) => {
  const permission = await service.createPermission(req.body, req.user.id);
  ApiResponse.created(res, { permission }, MSG.PERMISSION.CREATED);
});

export const getAllPermissions = asyncHandler(async (req, res) => {
  const result = await service.listPermissions(req.query);
  ApiResponse.success(res, result, MSG.PERMISSION.LIST_FETCHED);
});

export const getPermissionById = asyncHandler(async (req, res) => {
  const permission = await service.getPermissionById(req.params.permissionId);
  ApiResponse.success(res, { permission }, MSG.PERMISSION.FETCHED);
});

export const updatePermission = asyncHandler(async (req, res) => {
  const permission = await service.updatePermission(
    req.params.permissionId,
    req.body,
    req.user.id,
  );
  ApiResponse.success(res, { permission }, MSG.PERMISSION.UPDATED);
});

export const deletePermission = asyncHandler(async (req, res) => {
  await service.deletePermission(req.params.permissionId, req.user.id);
  ApiResponse.success(res, null, MSG.PERMISSION.DELETED);
});

export const getPermissionRoles = asyncHandler(async (req, res) => {
  const roles = await service.getPermissionRoles(req.params.permissionId);
  ApiResponse.success(res, { roles }, MSG.PERMISSION.FETCHED);
});
