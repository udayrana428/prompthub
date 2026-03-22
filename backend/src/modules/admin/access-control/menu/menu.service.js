import * as repo from "./menu.repository.js";

import prisma from "../../../../db/index.js";
import { ApiError } from "../../../../shared/utils/ApiError.js";
import { MSG } from "../../../../constants/messages.js";

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Build a nested tree from a flat array of menus.
 * O(n) with a Map — no recursion depth issues.
 */
const buildMenuTree = (menus) => {
  const map = new Map();
  const roots = [];

  for (const menu of menus) {
    map.set(menu.id, { ...menu, children: [] });
  }

  for (const menu of menus) {
    if (menu.parentId && map.has(menu.parentId)) {
      map.get(menu.parentId).children.push(map.get(menu.id));
    } else {
      roots.push(map.get(menu.id));
    }
  }

  return roots;
};

// ── Service methods ────────────────────────────────────────────────────────────

export const createMenu = async (data, actorId) => {
  const existing = await repo.findMenuByCode(data.code);
  if (existing)
    throw ApiError.conflict("A menu with this code already exists.");

  // Validate parentId if provided
  if (data.parentId) {
    const parent = await repo.findMenuById(data.parentId);
    if (!parent) throw ApiError.badRequest("Parent menu not found.");
    // Prevent deep nesting beyond 2 levels (root → parent → child)
    if (parent.parentId)
      throw ApiError.badRequest(
        "Menus support a maximum of 2 levels of nesting.",
      );
  }

  return repo.createMenu({
    name: data.name,
    code: data.code.toUpperCase(),
    description: data.description ?? null,
    path: data.path ?? null,
    icon: data.icon ?? null,
    order: data.order ?? 0,
    isVisible: data.isVisible ?? true,
    parentId: data.parentId ?? null,
    permissionId: data.permissionId ?? null,
    createdById: actorId,
    modifiedById: actorId,
  });
};

export const getAllMenus = async (query) => {
  const { isActive, flat } = query;
  const where = {
    ...(isActive !== undefined && { isActive }),
  };

  const menus = await repo.findAllMenus(where);

  return flat ? menus : buildMenuTree(menus);
};

export const getMenuById = async (id) => {
  const menu = await repo.findMenuById(id);
  if (!menu) throw ApiError.notFound(MSG.MENU.NOT_FOUND);
  return menu;
};

export const updateMenu = async (id, data, actorId) => {
  const menu = await repo.findMenuById(id);
  if (!menu) throw ApiError.notFound(MSG.MENU.NOT_FOUND);
  if (menu.isSystem) throw ApiError.forbidden(MSG.MENU.SYSTEM_PROTECTED);

  if (data.parentId) {
    if (data.parentId === id)
      throw ApiError.badRequest("A menu cannot be its own parent.");
    const parent = await repo.findMenuById(data.parentId);
    if (!parent) throw ApiError.badRequest("Parent menu not found.");
    if (parent.parentId)
      throw ApiError.badRequest(
        "Menus support a maximum of 2 levels of nesting.",
      );
  }

  return repo.updateMenu(id, { ...data, modifiedById: actorId });
};

export const deleteMenu = async (id, actorId) => {
  const menu = await repo.findMenuById(id);
  if (!menu) throw ApiError.notFound(MSG.MENU.NOT_FOUND);
  if (menu.isSystem) throw ApiError.forbidden(MSG.MENU.SYSTEM_PROTECTED);

  // Check for children
  const childCount = await prisma.menu.count({
    where: { parentId: id, deletedOn: null },
  });
  if (childCount > 0)
    throw ApiError.conflict(
      "Cannot delete menu — it has child menus. Delete or reassign children first.",
    );

  await repo.softDeleteMenu(id, actorId);
};

export const reorderMenus = async (items, actorId) => {
  // Validate all IDs exist
  const ids = items.map((i) => i.id);
  const count = await prisma.menu.count({
    where: { id: { in: ids }, deletedOn: null },
  });
  if (count !== ids.length)
    throw ApiError.badRequest("One or more menu IDs are invalid.");

  await repo.reorderMenus(items);
};

export const getMenuRoles = async (id) => {
  const menu = await repo.findMenuById(id);
  if (!menu) throw ApiError.notFound(MSG.MENU.NOT_FOUND);
  return repo.findMenuRoles(id);
};

/**
 * Returns the deduplicated, active menu tree for the current user
 * based on their assigned roles.
 */
export const getCurrentUserMenus = async (user) => {
  const roleIds = await prisma.userRoleMap
    .findMany({ where: { userId: user.id }, select: { roleId: true } })
    .then((rows) => rows.map((r) => r.roleId));

  if (!roleIds.length) return [];

  const rows = await repo.findMenusByRoleIds(roleIds);

  // Deduplicate by menu id, filter invisible/inactive
  const seen = new Set();
  const menus = [];
  for (const row of rows) {
    if (!seen.has(row.menu.id) && row.menu.isActive && row.menu.isVisible) {
      seen.add(row.menu.id);
      menus.push(row.menu);
    }
  }

  return buildMenuTree(menus);
};
