import * as socialRepo from "./social.repository.js";
import { notify } from "../notification/notification.service.js";
import { ApiError } from "../../shared/utils/ApiError.js";
import { MSG } from "../../constants/messages.js";
import {
  getPaginationParams,
  buildPaginatedResponse,
} from "../../shared/utils/pagination.js";
import prisma from "../../db/index.js";

export const followUser = async (followerId, followingId) => {
  if (followerId === followingId)
    throw ApiError.badRequest(MSG.SOCIAL.CANNOT_FOLLOW_SELF);

  const existing = await socialRepo.findFollow(followerId, followingId);
  if (existing) throw ApiError.conflict(MSG.SOCIAL.ALREADY_FOLLOWING);

  // Verify target user exists
  const target = await prisma.user.findFirst({
    where: { id: followingId, deletedOn: null },
  });
  if (!target) throw ApiError.notFound(MSG.USER.NOT_FOUND);

  await socialRepo.createFollow(followerId, followingId);

  // Notify
  notify({
    userId: followingId,
    actorId: followerId,
    type: "FOLLOW",
    referenceId: followerId,
    referenceType: "USER",
  }).catch(() => {});
};

export const unfollowUser = async (followerId, followingId) => {
  const existing = await socialRepo.findFollow(followerId, followingId);
  if (!existing) throw ApiError.conflict("You are not following this user.");
  await socialRepo.deleteFollow(followerId, followingId);
};

export const getFollowers = async (userId, query) => {
  const { page, limit, skip } = getPaginationParams(query);
  const followers = await socialRepo.getFollowers(userId, {
    skip,
    take: limit,
  });
  const total = await prisma.userFollow.count({
    where: { followingId: userId },
  });
  return buildPaginatedResponse(followers, total, page, limit);
};

export const getFollowing = async (userId, query) => {
  const { page, limit, skip } = getPaginationParams(query);
  const following = await socialRepo.getFollowing(userId, {
    skip,
    take: limit,
  });
  const total = await prisma.userFollow.count({
    where: { followerId: userId },
  });
  return buildPaginatedResponse(following, total, page, limit);
};
