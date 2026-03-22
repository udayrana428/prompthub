import * as repo from "./user-role.repository.js";
import * as roleRepo from "../role/role.repository.js";
import prisma from "../../../../db/index.js";
import { ApiError } from "../../../../shared/utils/ApiError.js";
import { MSG } from "../../../../constants/messages.js";
import { ROLE_HIERARCHY } from "../../../../constants/enums.js";

// ── Helper ─────────────────────────────────────────────────────────────────────

/**
 * Returns the highest hierarchy level among the actor's roles.
 * SUPER_ADMIN(100) > ADMIN(60) > MODERATOR(30) > USER(10)
 */
const getActorLevel = (actorRoles = []) => {
  return actorRoles.reduce((max, roleCode) => {
    return Math.max(max, ROLE_HIERARCHY[roleCode] ?? 0);
  }, 0);
};

/**
 * Throws if actor tries to assign a role >= their own level.
 */
const assertCanAssignRole = (actorRoles, targetRoleCode) => {
  const actorLevel = getActorLevel(actorRoles);
  const targetLevel = ROLE_HIERARCHY[targetRoleCode] ?? 0;

  if (targetLevel >= actorLevel) {
    throw ApiError.forbidden(
      `You cannot assign the ${targetRoleCode} role. You can only assign roles below your own access level.`,
    );
  }
};

const assertUserExists = async (userId) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedOn: null },
  });
  if (!user) throw ApiError.notFound(MSG.USER.NOT_FOUND);
  return user;
};

// ── Service methods ────────────────────────────────────────────────────────────

export const getUserRoles = async (userId) => {
  await assertUserExists(userId);
  return repo.getUserRoles(userId);
};

export const assignUserRoles = async (userId, roleIds, actorId, actorRoles) => {
  await assertUserExists(userId);

  // Prevent assigning roles to yourself
  if (userId === actorId) {
    throw ApiError.forbidden("You cannot modify your own roles.");
  }

  if (roleIds.length) {
    // Fetch all target roles to check their codes
    const targetRoles = await prisma.role.findMany({
      where: { id: { in: roleIds }, deletedOn: null, isActive: true },
      select: { id: true, code: true },
    });

    if (targetRoles.length !== roleIds.length)
      throw ApiError.badRequest(
        "One or more role IDs are invalid or inactive.",
      );

    // Check hierarchy for every role being assigned
    for (const role of targetRoles) {
      assertCanAssignRole(actorRoles, role.code);
    }
  }

  await prisma.$transaction((tx) =>
    repo.replaceUserRoles(userId, roleIds, actorId, tx),
  );
};

export const addUserRole = async (userId, roleId, actorId, actorRoles) => {
  await assertUserExists(userId);

  // Prevent self role modification
  if (userId === actorId) {
    throw ApiError.forbidden("You cannot modify your own roles.");
  }

  const role = await roleRepo.findRoleById(roleId);
  if (!role || !role.isActive) throw ApiError.notFound(MSG.ROLE.NOT_FOUND);

  // Check hierarchy
  assertCanAssignRole(actorRoles, role.code);

  const existing = await repo.findUserRole(userId, roleId);
  if (existing) throw ApiError.conflict(MSG.USER_ROLE.ALREADY_ASSIGNED);

  await repo.addUserRole(userId, roleId, actorId);
};

export const removeUserRole = async (userId, roleId, actorId, actorRoles) => {
  await assertUserExists(userId);

  // Prevent self role modification
  if (userId === actorId) {
    throw ApiError.forbidden("You cannot modify your own roles.");
  }

  const role = await roleRepo.findRoleById(roleId);
  if (!role) throw ApiError.notFound(MSG.ROLE.NOT_FOUND);

  // Check hierarchy — you also cannot REMOVE a role above your level
  assertCanAssignRole(actorRoles, role.code);

  const existing = await repo.findUserRole(userId, roleId);
  if (!existing) throw ApiError.notFound(MSG.USER_ROLE.NOT_ASSIGNED);

  await repo.removeUserRole(userId, roleId);
};
