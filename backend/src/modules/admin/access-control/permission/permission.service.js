import * as repo from "./permission.repository.js";

import {
  getPaginationParams,
  buildPaginatedResponse,
} from "../../../../shared/utils/pagination.js";
import { MSG } from "../../../../constants/messages.js";
import { ApiError } from "../../../../shared/utils/ApiError.js";

export const createPermission = async (data, actorId) => {
  const existing = await repo.findPermissionByCode(data.code);
  if (existing) throw ApiError.conflict(MSG.PERMISSION.ALREADY_EXISTS);

  return repo.createPermission({
    name: data.name,
    code: data.code.toUpperCase(),
    description: data.description ?? null,
    module: data.module ?? null,
    createdById: actorId,
    modifiedById: actorId,
  });
};

export const listPermissions = async (query) => {
  const { page, limit, skip } = getPaginationParams(query);
  const { search, module, isActive } = query;

  const where = {
    deletedOn: null,
    ...(module && { module }),
    ...(isActive !== undefined && { isActive }),
    ...(search && {
      OR: [{ name: { contains: search } }, { code: { contains: search } }],
    }),
  };

  const [permissions, total] = await Promise.all([
    repo.findPermissions({
      where,
      skip,
      take: limit,
      orderBy: { createdOn: "desc" },
    }),
    repo.countPermissions(where),
  ]);

  return buildPaginatedResponse(permissions, total, page, limit);
};

export const getPermissionById = async (id) => {
  const permission = await repo.findPermissionById(id);
  if (!permission) throw ApiError.notFound(MSG.PERMISSION.NOT_FOUND);
  return permission;
};

export const updatePermission = async (id, data, actorId) => {
  const permission = await repo.findPermissionById(id);
  if (!permission) throw ApiError.notFound(MSG.PERMISSION.NOT_FOUND);
  if (permission.isSystem)
    throw ApiError.forbidden(MSG.PERMISSION.SYSTEM_PROTECTED);

  return repo.updatePermission(id, { ...data, modifiedById: actorId });
};

export const deletePermission = async (id, actorId) => {
  const permission = await repo.findPermissionById(id);
  if (!permission) throw ApiError.notFound(MSG.PERMISSION.NOT_FOUND);
  if (permission.isSystem)
    throw ApiError.forbidden(MSG.PERMISSION.SYSTEM_PROTECTED);

  // Check if assigned to any role
  const roles = await repo.findPermissionRoles(id);
  if (roles.length > 0)
    throw ApiError.conflict(
      "Cannot delete permission — it is assigned to one or more roles. Remove it from all roles first.",
    );

  await repo.softDeletePermission(id, actorId);
};

export const getPermissionRoles = async (id) => {
  const permission = await repo.findPermissionById(id);
  if (!permission) throw ApiError.notFound(MSG.PERMISSION.NOT_FOUND);
  return repo.findPermissionRoles(id);
};
