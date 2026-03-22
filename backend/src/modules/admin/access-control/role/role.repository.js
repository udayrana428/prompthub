import prisma from "../../../../db/index.js";

export const createRole = (data) => prisma.role.create({ data });

export const findRoleById = (id) =>
  prisma.role.findFirst({ where: { id, deletedOn: null } });

export const findRoleByCode = (code, tx = prisma) =>
  tx.role.findFirst({
    where: { code, deletedOn: null, isActive: true },
  });

export const findRoleByNameOrCode = (name, code) =>
  prisma.role.findFirst({
    where: {
      deletedOn: null,
      OR: [{ name }, { code }],
    },
    select: { name: true, code: true },
  });

// For updates — exclude the record being updated
export const findRoleByNameOrCodeExcluding = (name, code, excludeId) =>
  prisma.role.findFirst({
    where: {
      deletedOn: null,
      id: { not: excludeId },
      OR: [{ name }, { code }],
    },
    select: { name: true, code: true },
  });

export const findRoles = ({ where, skip, take, orderBy }) =>
  prisma.role.findMany({
    where,
    skip,
    take,
    orderBy,
    select: {
      id: true,
      name: true,
      code: true,
      description: true,
      isSystem: true,
      isActive: true,
      createdOn: true,
      modifiedOn: true,
      _count: { select: { userRoles: true, rolePermissions: true } },
    },
  });

export const countRoles = (where) => prisma.role.count({ where });

export const updateRole = (id, data) =>
  prisma.role.update({ where: { id }, data });

export const softDeleteRole = (id, deletedById) =>
  prisma.role.update({
    where: { id },
    data: { deletedOn: new Date(), deletedById },
  });

// Permissions
export const getRolePermissions = (roleId) =>
  prisma.rolePermissionMap.findMany({
    where: { roleId },
    select: {
      permission: {
        select: {
          id: true,
          name: true,
          code: true,
          module: true,
          isActive: true,
        },
      },
      assignedOn: true,
    },
  });

export const replaceRolePermissions = async (
  roleId,
  permissionIds,
  actorId,
  tx = prisma,
) => {
  await tx.rolePermissionMap.deleteMany({ where: { roleId } });
  if (permissionIds.length) {
    await tx.rolePermissionMap.createMany({
      data: permissionIds.map((permissionId) => ({
        roleId,
        permissionId,
        assignedById: actorId,
      })),
      skipDuplicates: true,
    });
  }
};

export const findRolePermission = (roleId, permissionId) =>
  prisma.rolePermissionMap.findFirst({ where: { roleId, permissionId } });

export const addRolePermission = (roleId, permissionId, actorId) =>
  prisma.rolePermissionMap.create({
    data: { roleId, permissionId, assignedById: actorId },
  });

export const removeRolePermission = (roleId, permissionId) =>
  prisma.rolePermissionMap.delete({
    where: { roleId_permissionId: { roleId, permissionId } },
  });

// Menus
export const getRoleMenus = (roleId) =>
  prisma.roleMenuMap.findMany({
    where: { roleId },
    select: {
      menu: {
        select: {
          id: true,
          name: true,
          code: true,
          path: true,
          icon: true,
          order: true,
          parentId: true,
          isActive: true,
        },
      },
      assignedOn: true,
    },
  });

export const replaceRoleMenus = async (
  roleId,
  menuIds,
  actorId,
  tx = prisma,
) => {
  await tx.roleMenuMap.deleteMany({ where: { roleId } });
  if (menuIds.length) {
    await tx.roleMenuMap.createMany({
      data: menuIds.map((menuId) => ({
        roleId,
        menuId,
        assignedById: actorId,
      })),
      skipDuplicates: true,
    });
  }
};

export const findRoleMenu = (roleId, menuId) =>
  prisma.roleMenuMap.findFirst({ where: { roleId, menuId } });

export const addRoleMenu = (roleId, menuId, actorId) =>
  prisma.roleMenuMap.create({
    data: { roleId, menuId, assignedById: actorId },
  });

export const removeRoleMenu = (roleId, menuId) =>
  prisma.roleMenuMap.delete({
    where: { roleId_menuId: { roleId, menuId } },
  });

// Users
export const getRoleUsers = (roleId) =>
  prisma.userRoleMap.findMany({
    where: { roleId },
    select: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          status: true,
          profile: { select: { displayName: true, avatarUrl: true } },
        },
      },
      assignedOn: true,
    },
  });
