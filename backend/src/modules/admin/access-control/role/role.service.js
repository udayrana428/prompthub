import * as repo from "./role.repository.js";
import * as permRepo from "../permission/permission.repository.js";
import * as menuRepo from "../menu/menu.repository.js";

import {
  getPaginationParams,
  buildPaginatedResponse,
} from "../../../../shared/utils/pagination.js";
import prisma from "../../../../db/index.js";
import { MSG } from "../../../../constants/messages.js";
import { ApiError } from "../../../../shared/utils/ApiError.js";

export const createRole = async (data, actorId) => {
  const existing = await repo.findRoleByNameOrCode(data.name, data.code);

  if (existing?.code === data.code)
    throw ApiError.conflict("A role with this code already exists.");
  if (existing?.name === data.name)
    throw ApiError.conflict("A role with this name already exists.");

  return repo.createRole({
    name: data.name,
    code: data.code.toUpperCase(),
    description: data.description ?? null,
    createdById: actorId,
    modifiedById: actorId,
  });
};

export const listRoles = async (query) => {
  const { page, limit, skip } = getPaginationParams(query);
  const { search, isActive } = query;

  const where = {
    deletedOn: null,
    ...(isActive !== undefined && { isActive }),
    ...(search && {
      OR: [{ name: { contains: search } }, { code: { contains: search } }],
    }),
  };

  const [roles, total] = await Promise.all([
    repo.findRoles({
      where,
      skip,
      take: limit,
      orderBy: { createdOn: "desc" },
    }),
    repo.countRoles(where),
  ]);

  return buildPaginatedResponse(roles, total, page, limit);
};

export const getRoleById = async (id) => {
  const role = await repo.findRoleById(id);
  if (!role) throw ApiError.notFound(MSG.ROLE.NOT_FOUND);
  return role;
};

export const updateRole = async (id, data, actorId) => {
  const role = await repo.findRoleById(id);
  if (!role) throw ApiError.notFound(MSG.ROLE.NOT_FOUND);
  // if (role.isSystem) throw ApiError.forbidden(MSG.ROLE.SYSTEM_PROTECTED);

  // isSystem blocks identity changes only — name, code, deletion
  if (role.isSystem && (data.name || data.code)) {
    throw ApiError.forbidden("System role name and code cannot be modified.");
  }
  // Only check uniqueness if name or code is actually being changed
  if (data.name || data.code) {
    const existing = await repo.findRoleByNameOrCodeExcluding(
      data.name ?? role.name,
      data.code ?? role.code,
      id,
    );

    if (existing?.code === data.code)
      throw ApiError.conflict("A role with this code already exists.");
    if (existing?.name === data.name)
      throw ApiError.conflict("A role with this name already exists.");
  }

  return repo.updateRole(id, { ...data, modifiedById: actorId });
};

export const deleteRole = async (id, actorId) => {
  const role = await repo.findRoleById(id);
  if (!role) throw ApiError.notFound(MSG.ROLE.NOT_FOUND);
  if (role.isSystem) throw ApiError.forbidden(MSG.ROLE.SYSTEM_PROTECTED);

  const userCount = await prisma.userRoleMap.count({ where: { roleId: id } });
  if (userCount > 0)
    throw ApiError.conflict(
      "Cannot delete role — it is assigned to one or more users.",
    );

  await repo.softDeleteRole(id, actorId);
};

// ── Permissions ────────────────────────────────────────────────────────────────

export const getRolePermissions = async (roleId) => {
  const role = await repo.findRoleById(roleId);
  if (!role) throw ApiError.notFound(MSG.ROLE.NOT_FOUND);
  return repo.getRolePermissions(roleId);
};

export const replaceRolePermissions = async (
  roleId,
  permissionIds,
  actorId,
) => {
  const role = await repo.findRoleById(roleId);
  if (!role) throw ApiError.notFound(MSG.ROLE.NOT_FOUND);
  // if (role.isSystem) throw ApiError.forbidden(MSG.ROLE.SYSTEM_PROTECTED);

  // SUPER_ADMIN must always keep all permissions — prevent accidental lockout
  if (role.code === "SUPER_ADMIN")
    throw ApiError.forbidden(
      "SUPER_ADMIN permissions are managed by the system and cannot be modified.",
    );

  // Validate all permission IDs exist
  if (permissionIds.length) {
    const valid = await prisma.permission.count({
      where: { id: { in: permissionIds }, deletedOn: null, isActive: true },
    });
    if (valid !== permissionIds.length)
      throw ApiError.badRequest("One or more permission IDs are invalid.");
  }

  await prisma.$transaction((tx) =>
    repo.replaceRolePermissions(roleId, permissionIds, actorId, tx),
  );
};

export const addRolePermission = async (roleId, permissionId, actorId) => {
  const role = await repo.findRoleById(roleId);
  if (!role) throw ApiError.notFound(MSG.ROLE.NOT_FOUND);
  // if (role.isSystem) throw ApiError.forbidden(MSG.ROLE.SYSTEM_PROTECTED);

  const permission = await permRepo.findPermissionById(permissionId);
  if (!permission) throw ApiError.notFound(MSG.PERMISSION.NOT_FOUND);

  const existing = await repo.findRolePermission(roleId, permissionId);
  if (existing)
    throw ApiError.conflict("Permission already assigned to this role.");

  await repo.addRolePermission(roleId, permissionId, actorId);
};

export const removeRolePermission = async (roleId, permissionId) => {
  const role = await repo.findRoleById(roleId);
  if (!role) throw ApiError.notFound(MSG.ROLE.NOT_FOUND);
  // if (role.isSystem) throw ApiError.forbidden(MSG.ROLE.SYSTEM_PROTECTED);

  const existing = await repo.findRolePermission(roleId, permissionId);
  if (!existing)
    throw ApiError.notFound("Permission is not assigned to this role.");

  await repo.removeRolePermission(roleId, permissionId);
};

// ── Menus ──────────────────────────────────────────────────────────────────────

export const getRoleMenus = async (roleId) => {
  const role = await repo.findRoleById(roleId);
  if (!role) throw ApiError.notFound(MSG.ROLE.NOT_FOUND);
  return repo.getRoleMenus(roleId);
};

export const replaceRoleMenus = async (roleId, menuIds, actorId) => {
  const role = await repo.findRoleById(roleId);
  if (!role) throw ApiError.notFound(MSG.ROLE.NOT_FOUND);
  // if (role.isSystem) throw ApiError.forbidden(MSG.ROLE.SYSTEM_PROTECTED);

  if (menuIds.length) {
    const valid = await prisma.menu.count({
      where: { id: { in: menuIds }, deletedOn: null, isActive: true },
    });
    if (valid !== menuIds.length)
      throw ApiError.badRequest("One or more menu IDs are invalid.");
  }

  await prisma.$transaction((tx) =>
    repo.replaceRoleMenus(roleId, menuIds, actorId, tx),
  );
};

export const addRoleMenu = async (roleId, menuId, actorId) => {
  const role = await repo.findRoleById(roleId);
  if (!role) throw ApiError.notFound(MSG.ROLE.NOT_FOUND);

  const menu = await menuRepo.findMenuById(menuId);
  if (!menu) throw ApiError.notFound(MSG.MENU.NOT_FOUND);

  const existing = await repo.findRoleMenu(roleId, menuId);
  if (existing) throw ApiError.conflict("Menu already assigned to this role.");

  await repo.addRoleMenu(roleId, menuId, actorId);
};

export const removeRoleMenu = async (roleId, menuId) => {
  const role = await repo.findRoleById(roleId);
  if (!role) throw ApiError.notFound(MSG.ROLE.NOT_FOUND);

  const existing = await repo.findRoleMenu(roleId, menuId);
  if (!existing) throw ApiError.notFound("Menu is not assigned to this role.");

  await repo.removeRoleMenu(roleId, menuId);
};

export const getRoleUsers = async (roleId) => {
  const role = await repo.findRoleById(roleId);
  if (!role) throw ApiError.notFound(MSG.ROLE.NOT_FOUND);
  return repo.getRoleUsers(roleId);
};
