import * as userService from "./user.service.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { ApiResponse } from "../../shared/utils/ApiResponse.js";
import { MSG } from "../../constants/messages.js";

export const listUsers = asyncHandler(async (req, res) => {
  const result = await userService.listUsers(req.query);
  ApiResponse.success(res, result, MSG.USER.FETCHED);
});

export const getPublicProfile = asyncHandler(async (req, res) => {
  const user = await userService.getPublicProfile(req.params.slug);
  ApiResponse.success(res, { user }, MSG.USER.FETCHED);
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const profile = await userService.updateMyProfile(req.user.id, req.body);
  ApiResponse.success(res, { profile }, MSG.USER.UPDATED);
});

export const updateMyUsername = asyncHandler(async (req, res) => {
  const user = await userService.updateMyUsername(
    req.user.id,
    req.body.username,
  );
  ApiResponse.success(res, { user }, MSG.USER.UPDATED);
});

export const updateMyAvatar = asyncHandler(async (req, res) => {
  const profile = await userService.updateMyAvatar(req.user.id, req.file);
  ApiResponse.success(res, { profile }, "Avatar updated successfully.");
});

export const updateMyCoverImage = asyncHandler(async (req, res) => {
  const profile = await userService.updateMyCoverImage(req.user.id, req.file);
  ApiResponse.success(res, { profile }, "Cover image updated successfully.");
});

export const deleteMyAccount = asyncHandler(async (req, res) => {
  await userService.deleteMyAccount(req.user.id);
  ApiResponse.success(res, null, MSG.USER.DELETED);
});

export const getUserPrompts = asyncHandler(async (req, res) => {
  const result = await userService.getUserPrompts(
    req.params.slug,
    req.query,
    req.user?.id,
  );
  ApiResponse.success(res, result, MSG.PROMPT.LIST_FETCHED);
});

export const getMyFavorites = asyncHandler(async (req, res) => {
  const result = await userService.getMyFavorites(req.user.id, req.query);
  ApiResponse.success(res, result, MSG.PROMPT.LIST_FETCHED);
});
