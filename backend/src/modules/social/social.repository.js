import prisma from "../../db/index.js";

export const findFollow = (followerId, followingId) =>
  prisma.userFollow.findFirst({ where: { followerId, followingId } });

export const createFollow = (followerId, followingId) =>
  prisma.$transaction([
    prisma.userFollow.create({ data: { followerId, followingId } }),
    prisma.profile.updateMany({
      where: { userId: followerId },
      data: { followingCount: { increment: 1 } },
    }),
    prisma.profile.updateMany({
      where: { userId: followingId },
      data: { followersCount: { increment: 1 } },
    }),
  ]);

export const deleteFollow = (followerId, followingId) =>
  prisma.$transaction([
    prisma.userFollow.deleteMany({ where: { followerId, followingId } }),
    prisma.profile.updateMany({
      where: { userId: followerId },
      data: { followingCount: { decrement: 1 } },
    }),
    prisma.profile.updateMany({
      where: { userId: followingId },
      data: { followersCount: { decrement: 1 } },
    }),
  ]);

export const getFollowers = (userId, { skip, take }) =>
  prisma.userFollow.findMany({
    where: { followingId: userId },
    skip,
    take,
    include: {
      follower: {
        select: {
          id: true,
          username: true,
          slug: true,
          profile: { select: { displayName: true, avatarUrl: true } },
        },
      },
    },
  });

export const getFollowing = (userId, { skip, take }) =>
  prisma.userFollow.findMany({
    where: { followerId: userId },
    skip,
    take,
    include: {
      following: {
        select: {
          id: true,
          username: true,
          slug: true,
          profile: { select: { displayName: true, avatarUrl: true } },
        },
      },
    },
  });
