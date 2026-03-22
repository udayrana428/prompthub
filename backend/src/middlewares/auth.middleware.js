import { asyncHandler } from "../shared/utils/asyncHandler.js";
import { ApiError } from "../shared/utils/ApiError.js";
import { verifyAccessToken } from "../shared/services/token.service.js";
import prisma from "../db/index.js";
import { UserStatus } from "../constants/enums.js";

/**
 * Requires a valid JWT access token.
 * Attaches req.user with full user + roles + permissions.
 */
export const requireAuth = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.headers?.authorization?.replace("Bearer ", "");

  if (!token) {
    throw ApiError.unauthorized("Access token is required.");
  }

  const decoded = verifyAccessToken(token);

  const user = await prisma.user.findFirst({
    where: { id: decoded.id, deletedOn: null },
    include: {
      profile: true,
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: { permission: true },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw ApiError.unauthorized("User not found or has been deleted.");
  }

  if (user.status === UserStatus.SUSPENDED) {
    throw ApiError.forbidden("Your account has been suspended.");
  }

  if (user.status === UserStatus.BANNED) {
    throw ApiError.forbidden("Your account has been banned.");
  }

  if (user.status === UserStatus.LOCKED) {
    throw ApiError.forbidden("Your account is temporarily locked.");
  }

  // Flatten permissions into a Set for O(1) checks
  const permissions = new Set();
  const roles = [];

  for (const ur of user.userRoles) {
    roles.push(ur.role.code);
    for (const rp of ur.role.rolePermissions) {
      if (rp.permission.isActive) {
        permissions.add(rp.permission.code);
      }
    }
  }

  req.user = user;
  req.user.roles = roles;
  req.user.permissions = permissions;

  next();
});

/**
 * Optional auth — attaches user if token present, but does not fail
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.headers?.authorization?.replace("Bearer ", "");

  if (!token) return next();

  try {
    const decoded = verifyAccessToken(token);
    const user = await prisma.user.findFirst({
      where: { id: decoded.id, deletedOn: null },
      include: { profile: true },
    });
    if (user) req.user = user;
  } catch {
    // silently ignore
  }

  next();
});

/**
 * Check if logged-in user has a specific role
 */
export const requireRole = (...roleCodes) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user) throw ApiError.unauthorized();
    const hasRole = roleCodes.some((code) => req.user.roles?.includes(code));
    if (!hasRole) throw ApiError.forbidden("Insufficient role.");
    next();
  });

/**
 * Check if logged-in user has a specific permission
 */
export const requirePermission = (...permCodes) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user) throw ApiError.unauthorized();
    const hasPerm = permCodes.some((code) => req.user.permissions?.has(code));
    if (!hasPerm) throw ApiError.forbidden("Insufficient permissions.");
    next();
  });
