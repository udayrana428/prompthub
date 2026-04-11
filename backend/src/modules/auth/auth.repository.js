import { UserStatus } from "../../constants/enums.js";
import prisma from "../../db/index.js";

export const findUserByEmail = (email) =>
  prisma.user.findFirst({
    where: { email, deletedOn: null },
    include: { profile: true },
  });

export const findUserById = (id) =>
  prisma.user.findFirst({
    where: { id, deletedOn: null },
    include: { profile: true },
  });

export const findUserByUsername = (username) =>
  prisma.user.findFirst({
    where: { username, deletedOn: null },
  });

// Accepts tx so it can participate in a transaction from the service layer
export const createUserWithProfile = (data, tx = prisma) =>
  tx.user.create({
    data: {
      username: data.username,
      slug: data.slug,
      email: data.email,
      password: data.password,
      loginType: data.loginType || "EMAIL",
      profile: {
        create: {
          displayName: data.username,
        },
      },
    },
    include: { profile: true },
  });

export const createSession = (data, tx = prisma) => tx.session.create({ data });

export const findSessionByRefreshHash = (hash) =>
  prisma.session.findFirst({
    where: {
      refreshTokenHash: hash,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });

export const revokeSession = (sessionId, tx = prisma) =>
  tx.session.update({
    where: { id: sessionId },
    data: { revokedAt: new Date() },
  });

export const revokeAllUserSessions = (userId, tx = prisma) =>
  tx.session.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });

export const updateUserLoginMeta = (userId, ip, userAgent) =>
  prisma.user.update({
    where: { id: userId },
    data: {
      lastLoginAt: new Date(),
      failedLoginCount: 0,
      lockedUntil: null,
    },
  });

export const incrementFailedLogin = (userId) =>
  prisma.user.update({
    where: { id: userId },
    data: { failedLoginCount: { increment: 1 } },
  });

export const lockUser = (userId, until) =>
  prisma.user.update({
    where: { id: userId },
    data: {
      status: UserStatus.LOCKED,
      lockedUntil: until,
    },
  });

// auth.repo.js
export const unlockUser = (userId) =>
  prisma.user.update({
    where: { id: userId },
    data: {
      status: UserStatus.ACTIVE,
      failedLoginCount: 0,
      lockedUntil: null,
    },
  });

export const updatePassword = (userId, hash, tx = prisma) =>
  tx.user.update({
    where: { id: userId },
    data: { password: hash, passwordUpdatedAt: new Date() },
  });
