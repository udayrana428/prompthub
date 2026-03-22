import * as socialService from "./social.service.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { ApiResponse } from "../../shared/utils/ApiResponse.js";
import { MSG } from "../../constants/messages.js";

export const followUser = asyncHandler(async (req, res) => {
  await socialService.followUser(req.user.id, req.params.userId);
  ApiResponse.success(res, null, MSG.SOCIAL.FOLLOWED);
});

export const unfollowUser = asyncHandler(async (req, res) => {
  await socialService.unfollowUser(req.user.id, req.params.userId);
  ApiResponse.success(res, null, MSG.SOCIAL.UNFOLLOWED);
});

export const getFollowers = asyncHandler(async (req, res) => {
  const result = await socialService.getFollowers(req.params.userId, req.query);
  ApiResponse.success(res, result, "Followers fetched.");
});

export const getFollowing = asyncHandler(async (req, res) => {
  const result = await socialService.getFollowing(req.params.userId, req.query);
  ApiResponse.success(res, result, "Following fetched.");
});
