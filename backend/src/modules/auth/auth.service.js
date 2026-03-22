import * as authRepo from "./auth.repository.js";
import * as roleRepo from "../admin/access-control/role/role.repository.js";
import * as userRoleRepo from "../admin/access-control/user-role/user-role.repository.js";
import {
  hashPassword,
  comparePassword,
  hashToken,
  generateSecureToken,
} from "../../shared/services/crypto.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../shared/services/token.service.js";
import { generateUniqueSlug } from "../../shared/services/slug.service.js";
import { ApiError } from "../../shared/utils/ApiError.js";
import { omit } from "../../shared/utils/helpers.js";
import { MSG } from "../../constants/messages.js";
import { UserStatus } from "../../constants/enums.js";
import { appConfig } from "../../config/app.config.js";
import prisma from "../../db/index.js";

const MAX_FAILED_LOGINS = 5;
const LOCK_DURATION_MINUTES = 30;

const generateTokenPair = (user) => {
  const payload = { id: user.id, email: user.email };
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateSecureToken(40), // raw token before hashing
  };
};

export const register = async ({ username, email, password }) => {
  const [existingEmail, existingUsername] = await Promise.all([
    authRepo.findUserByEmail(email),
    authRepo.findUserByUsername(username),
  ]);

  if (existingEmail) throw ApiError.conflict(MSG.USER.ALREADY_EXISTS);
  if (existingUsername) throw ApiError.conflict("Username is already taken.");

  const [passwordHash, slug] = await Promise.all([
    hashPassword(password),
    generateUniqueSlug(username, "user"),
  ]);

  const user = await prisma.$transaction(async (tx) => {
    const newUser = await authRepo.createUserWithProfile(
      { username, slug, email, password: passwordHash },
      tx,
    );

    const userRole = await roleRepo.findRoleByCode("USER", tx);
    if (!userRole) {
      throw new Error(
        "Default USER role not found. Please run the seed script first.",
      );
    }

    await userRoleRepo.addUserRole(newUser.id, userRole.id, null, tx);

    return newUser;
  });

  return omit(user, ["password"]);
};

export const login = async ({ email, password }, { ip, userAgent }) => {
  const user = await authRepo.findUserByEmail(email);

  if (!user) throw ApiError.unauthorized(MSG.AUTH.INVALID_CREDENTIALS);

  if (user.status === UserStatus.BANNED)
    throw ApiError.forbidden(MSG.AUTH.ACCOUNT_SUSPENDED);
  if (user.status === UserStatus.SUSPENDED)
    throw ApiError.forbidden(MSG.AUTH.ACCOUNT_SUSPENDED);

  if (user.status === UserStatus.LOCKED && user.lockedUntil > new Date()) {
    const minutes = Math.ceil((user.lockedUntil - Date.now()) / 60000);
    throw ApiError.forbidden(
      `${MSG.AUTH.ACCOUNT_LOCKED} Try again in ${minutes} minute(s).`,
    );
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    await authRepo.incrementFailedLogin(user.id);
    if (user.failedLoginCount + 1 >= MAX_FAILED_LOGINS) {
      const lockUntil = new Date(
        Date.now() + LOCK_DURATION_MINUTES * 60 * 1000,
      );
      await authRepo.lockUser(user.id, lockUntil);
      throw ApiError.forbidden(
        `Account locked due to too many failed attempts. Try again in ${LOCK_DURATION_MINUTES} minutes.`,
      );
    }
    throw ApiError.unauthorized(MSG.AUTH.INVALID_CREDENTIALS);
  }

  await authRepo.updateUserLoginMeta(user.id, ip, userAgent);

  const { accessToken, refreshToken } = generateTokenPair(user);
  const refreshTokenHash = hashToken(refreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await authRepo.createSession({
    userId: user.id,
    refreshTokenHash,
    userAgent,
    ipAddress: ip,
    expiresAt,
  });

  return {
    accessToken,
    refreshToken,
    user: omit(user, ["password"]),
  };
};

export const refreshTokens = async (rawRefreshToken) => {
  const hash = hashToken(rawRefreshToken);
  const session = await authRepo.findSessionByRefreshHash(hash);

  if (!session)
    throw ApiError.unauthorized("Invalid or expired refresh token.");

  const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(
    session.user,
  );
  const newHash = hashToken(newRefreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.$transaction(async (tx) => {
    await authRepo.revokeSession(session.id, tx);
    await authRepo.createSession(
      {
        userId: session.userId,
        refreshTokenHash: newHash,
        userAgent: session.userAgent,
        ipAddress: session.ipAddress,
        expiresAt,
      },
      tx,
    );
  });

  return { accessToken, refreshToken: newRefreshToken };
};

export const logout = async (rawRefreshToken, userId) => {
  if (rawRefreshToken) {
    const hash = hashToken(rawRefreshToken);
    const session = await authRepo.findSessionByRefreshHash(hash);
    if (session && session.userId === userId) {
      await authRepo.revokeSession(session.id);
    }
  }
};

export const logoutAll = async (userId) => {
  await authRepo.revokeAllUserSessions(userId);
};

export const changePassword = async (
  userId,
  { currentPassword, newPassword },
) => {
  const user = await authRepo.findUserById(userId);
  if (!user) throw ApiError.notFound(MSG.USER.NOT_FOUND);

  const isValid = await comparePassword(currentPassword, user.password);
  if (!isValid) throw ApiError.badRequest("Current password is incorrect.");

  const hash = await hashPassword(newPassword);

  await prisma.$transaction(async (tx) => {
    await authRepo.updatePassword(userId, hash, tx);
    await authRepo.revokeAllUserSessions(userId, tx);
  });
};
