import prisma from "../../../../db/index.js";

const menuSelect = {
  id: true,
  name: true,
  code: true,
  description: true,
  path: true,
  icon: true,
  order: true,
  isVisible: true,
  isActive: true,
  isSystem: true,
  parentId: true,
  permissionId: true,
  createdOn: true,
  modifiedOn: true,
};

export const createMenu = (data) =>
  prisma.menu.create({ data, select: menuSelect });

export const findMenuById = (id) =>
  prisma.menu.findFirst({ where: { id, deletedOn: null }, select: menuSelect });

export const findMenuByCode = (code) =>
  prisma.menu.findFirst({ where: { code, deletedOn: null } });

export const findAllMenus = (where) =>
  prisma.menu.findMany({
    where: { ...where, deletedOn: null },
    orderBy: [{ parentId: "asc" }, { order: "asc" }],
    select: menuSelect,
  });

export const updateMenu = (id, data) =>
  prisma.menu.update({ where: { id }, data, select: menuSelect });

export const softDeleteMenu = (id, deletedById) =>
  prisma.menu.update({
    where: { id },
    data: { deletedOn: new Date(), deletedById },
  });

export const reorderMenus = (items) =>
  prisma.$transaction(
    items.map(({ id, order }) =>
      prisma.menu.update({ where: { id }, data: { order } }),
    ),
  );

export const findMenuRoles = (menuId) =>
  prisma.roleMenuMap.findMany({
    where: { menuId },
    select: {
      role: { select: { id: true, name: true, code: true, isActive: true } },
      assignedOn: true,
    },
  });

// For building user menus — fetch all menus accessible via a set of role IDs
export const findMenusByRoleIds = (roleIds) =>
  prisma.roleMenuMap.findMany({
    where: { roleId: { in: roleIds } },
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
          isVisible: true,
          isActive: true,
        },
      },
    },
  });
