import { MSG } from "../../../../constants/messages.js";
import { ApiResponse } from "../../../../shared/utils/ApiResponse.js";
import { asyncHandler } from "../../../../shared/utils/asyncHandler.js";
import * as service from "./user-role.service.js";

export const getUserRoles = asyncHandler(async (req, res) => {
  const roles = await service.getUserRoles(req.params.userId);
  ApiResponse.success(res, { roles }, MSG.USER_ROLE.FETCHED);
});

export const assignUserRoles = asyncHandler(async (req, res) => {
  await service.assignUserRoles(
    req.params.userId,
    req.body.roleIds,
    req.user.id,
    req.user.roles,
  );
  ApiResponse.success(res, null, MSG.USER_ROLE.REPLACED);
});

export const addUserRole = asyncHandler(async (req, res) => {
  await service.addUserRole(
    req.params.userId,
    req.params.roleId,
    req.user.id,
    req.user.roles,
  );
  ApiResponse.success(res, null, MSG.USER_ROLE.ASSIGNED);
});

export const removeUserRole = asyncHandler(async (req, res) => {
  await service.removeUserRole(
    req.params.userId,
    req.params.roleId,
    req.user.id,
    req.user.roles,
  );
  ApiResponse.success(res, null, MSG.USER_ROLE.REMOVED);
});
