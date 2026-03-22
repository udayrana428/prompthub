import prisma from "../../db/index.js";

const publicProfileSelect = {
  id: true,
  username: true,
  slug: true,
  createdOn: true,
  profile: {
    select: {
      displayName: true,
      firstName: true,
      lastName: true,
      bio: true,
      website: true,
      location: true,
      avatarUrl: true,
      coverImageUrl: true,
      promptCount: true,
      followersCount: true,
      followingCount: true,
      reputationScore: true,
    },
  },
};

export const findUserBySlug = (slug) =>
  prisma.user.findFirst({
    where: { slug, deletedOn: null },
    select: publicProfileSelect,
  });

export const findUserById = (id) =>
  prisma.user.findFirst({
    where: { id, deletedOn: null },
    select: publicProfileSelect,
  });

export const findUserByUsername = (username) =>
  prisma.user.findFirst({
    where: { username, deletedOn: null },
  });

export const findUsers = ({ where, skip, take }) =>
  prisma.user.findMany({
    where,
    skip,
    take,
    orderBy: { createdOn: "desc" },
    select: publicProfileSelect,
  });

export const countUsers = (where) => prisma.user.count({ where });

export const updateProfile = (userId, data) =>
  prisma.profile.update({
    where: { userId },
    data,
  });

export const updateUsername = (userId, username, slug) =>
  prisma.user.update({
    where: { id: userId },
    data: { username, slug },
  });

export const updateAvatar = (userId, avatarUrl) =>
  prisma.profile.update({
    where: { userId },
    data: { avatarUrl },
  });

export const updateCoverImage = (userId, coverImageUrl) =>
  prisma.profile.update({
    where: { userId },
    data: { coverImageUrl },
  });

export const softDeleteUser = (userId, deletedById) =>
  prisma.user.update({
    where: { id: userId },
    data: { deletedOn: new Date(), deletedById },
  });

export const getUserPrompts = ({ userId, where, skip, take }) =>
  prisma.prompt.findMany({
    where: { createdById: userId, deletedOn: null, ...where },
    skip,
    take,
    orderBy: { createdOn: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      shortDescription: true,
      imageUrl: true,
      modelType: true,
      status: true,
      likesCount: true,
      viewsCount: true,
      commentsCount: true,
      favoritesCount: true,
      featured: true,
      createdOn: true,
      category: { select: { id: true, name: true, slug: true } },
      createdBy: {
        select: {
          id: true,
          username: true,
          slug: true,
          profile: { select: { displayName: true, avatarUrl: true } },
        },
      },
      tags: {
        select: { tag: { select: { id: true, name: true, slug: true } } },
      },
    },
  });

export const countUserPrompts = (userId, where) =>
  prisma.prompt.count({
    where: { createdById: userId, deletedOn: null, ...where },
  });

export const getUserFavorites = ({ userId, skip, take }) =>
  prisma.promptFavorite.findMany({
    where: { userId, deletedOn: null },
    skip,
    take,
    orderBy: { createdOn: "desc" },
    include: {
      prompt: {
        select: {
          id: true,
          title: true,
          slug: true,
          shortDescription: true,
          imageUrl: true,
          modelType: true,
          likesCount: true,
          viewsCount: true,
          createdOn: true,
          category: { select: { id: true, name: true, slug: true } },
          createdBy: {
            select: {
              id: true,
              username: true,
              slug: true,
              profile: { select: { displayName: true, avatarUrl: true } },
            },
          },
        },
      },
    },
  });

export const countUserFavorites = (userId) =>
  prisma.promptFavorite.count({ where: { userId, deletedOn: null } });
