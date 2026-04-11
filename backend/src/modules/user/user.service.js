import * as userRepo from "./user.repository.js";
import * as socialRepo from "../social/social.repository.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicId,
} from "../../shared/services/cloudinary.service.js";
import { generateUniqueSlug } from "../../shared/services/slug.service.js";
import { ApiError } from "../../shared/utils/ApiError.js";
import { pick } from "../../shared/utils/helpers.js";
import {
  getPaginationParams,
  buildPaginatedResponse,
} from "../../shared/utils/pagination.js";
import { MSG } from "../../constants/messages.js";

export const getPublicProfile = async (slug, viewerId) => {
  const user = await userRepo.findUserBySlug(slug);
  if (!user) throw ApiError.notFound(MSG.USER.NOT_FOUND);

  const isFollowedByViewer =
    !!viewerId &&
    viewerId !== user.id &&
    !!(await socialRepo.findFollow(viewerId, user.id));
  const isOwnedByViewer = viewerId === user.id;

  return {
    ...user,
    isFollowedByViewer,
    isOwnedByViewer,
  };
};

export const listUsers = async (query) => {
  const { page, limit, skip } = getPaginationParams(query);
  const { search } = query;

  const where = {
    deletedOn: null,
    ...(search && {
      OR: [
        { username: { contains: search } },
        { profile: { displayName: { contains: search } } },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    userRepo.findUsers({ where, skip, take: limit }),
    userRepo.countUsers(where),
  ]);

  return buildPaginatedResponse(users, total, page, limit);
};

export const updateMyProfile = async (userId, data) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "displayName",
    "bio",
    "website",
    "location",
  ];
  const profileData = pick(data, allowedFields);
  return userRepo.updateProfile(userId, profileData);
};

export const updateMyUsername = async (userId, username) => {
  const existing = await userRepo.findUserByUsername(username);
  if (existing && existing.id !== userId) {
    throw ApiError.conflict("Username is already taken.");
  }

  const slug = await generateUniqueSlug(username, "user", userId);
  return userRepo.updateUsername(userId, username, slug);
};

export const updateMyAvatar = async (userId, imageFile) => {
  if (!imageFile) throw ApiError.badRequest("Avatar image is required.");

  // Get current avatar to delete old one
  const user = await userRepo.findUserById(userId);
  if (user?.profile?.avatarUrl) {
    await deleteFromCloudinary(extractPublicId(user.profile.avatarUrl));
  }

  const result = await uploadToCloudinary(
    imageFile.buffer ?? imageFile.path,
    "avatars",
  );
  if (!result) throw ApiError.internal("Failed to upload avatar.");

  return userRepo.updateAvatar(userId, result.secure_url);
};

export const updateMyCoverImage = async (userId, imageFile) => {
  if (!imageFile) throw ApiError.badRequest("Cover image is required.");

  const user = await userRepo.findUserById(userId);
  if (user?.profile?.coverImageUrl) {
    await deleteFromCloudinary(extractPublicId(user.profile.coverImageUrl));
  }

  const result = await uploadToCloudinary(
    imageFile.buffer ?? imageFile.path,
    "covers",
  );
  if (!result) throw ApiError.internal("Failed to upload cover image.");

  return userRepo.updateCoverImage(userId, result.secure_url);
};

export const deleteMyAccount = async (userId) => {
  await userRepo.softDeleteUser(userId, userId);
};

export const getUserPrompts = async (slug, query, viewerId) => {
  const user = await userRepo.findUserBySlug(slug);
  if (!user) throw ApiError.notFound(MSG.USER.NOT_FOUND);

  const { page, limit, skip } = getPaginationParams(query);

  // Own profile can see all statuses, others only see APPROVED
  const isOwner = viewerId === user.id;
  const statusFilter = query.status
    ? { status: query.status }
    : isOwner
      ? {}
      : { status: "APPROVED" };

  const [prompts, total] = await Promise.all([
    userRepo.getUserPrompts({
      userId: user.id,
      where: statusFilter,
      skip,
      take: limit,
    }),
    userRepo.countUserPrompts(user.id, statusFilter),
  ]);

  return buildPaginatedResponse(prompts, total, page, limit);
};

export const getMyFavorites = async (userId, query) => {
  const { page, limit, skip } = getPaginationParams(query);
  const [favorites, total] = await Promise.all([
    userRepo.getUserFavorites({ userId, skip, take: limit }),
    userRepo.countUserFavorites(userId),
  ]);
  return buildPaginatedResponse(favorites, total, page, limit);
};
