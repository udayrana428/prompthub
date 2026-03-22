import prisma from "../../../../db/index.js";

export const createPermission = (data) => prisma.permission.create({ data });

export const findPermissionById = (id) =>
  prisma.permission.findFirst({
    where: { id, deletedOn: null },
  });

export const findPermissionByCode = (code) =>
  prisma.permission.findFirst({
    where: { code, deletedOn: null },
  });

export const findPermissions = ({ where, skip, take, orderBy }) =>
  prisma.permission.findMany({
    where,
    skip,
    take,
    orderBy,
    select: {
      id: true,
      name: true,
      code: true,
      description: true,
      module: true,
      isSystem: true,
      isActive: true,
      createdOn: true,
      modifiedOn: true,
    },
  });

export const countPermissions = (where) => prisma.permission.count({ where });

export const updatePermission = (id, data) =>
  prisma.permission.update({ where: { id }, data });

export const softDeletePermission = (id, deletedById) =>
  prisma.permission.update({
    where: { id },
    data: { deletedOn: new Date(), deletedById },
  });

export const findPermissionRoles = (permissionId) =>
  prisma.rolePermissionMap.findMany({
    where: { permissionId },
    select: {
      role: {
        select: { id: true, name: true, code: true, isActive: true },
      },
      assignedOn: true,
    },
  });
