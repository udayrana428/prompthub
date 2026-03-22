import * as categoryRepo from "../../category/category.repository.js";
import { ApiError } from "../../../shared/utils/ApiError.js";
import { MSG } from "../../../constants/messages.js";
import { generateUniqueSlug } from "../../../shared/services/slug.service.js";
import {
  getPaginationParams,
  buildPaginatedResponse,
} from "../../../shared/utils/pagination.js";
import prisma from "../../../db/index.js";

export const createCategory = async (data, actorId) => {
  const existing = await categoryRepo.findCategoryByName(data.name);
  if (existing)
    throw ApiError.conflict("A category with this name already exists.");

  if (data.parentId) {
    const parent = await categoryRepo.findCategoryById(data.parentId);
    if (!parent) throw ApiError.badRequest("Parent category not found.");
    if (parent.parentId)
      throw ApiError.badRequest("Categories support a maximum of 2 levels.");
  }

  const slug = await generateUniqueSlug(data.name, "category");

  return categoryRepo.createCategory({
    name: data.name,
    slug,
    description: data.description ?? null,
    parentId: data.parentId ?? null,
    isActive: data.isActive ?? true,
    createdById: actorId,
    modifiedById: actorId,
  });
};

export const listCategories = async (query) => {
  const { page, limit, skip } = getPaginationParams(query);
  const { search, isActive, parentId } = query;

  const where = {
    deletedOn: null,
    ...(isActive !== undefined && { isActive }),
    ...(parentId !== undefined && { parentId: parentId ?? null }),
    ...(search && { name: { contains: search } }),
  };

  const [categories, total] = await Promise.all([
    categoryRepo.findCategories({
      where,
      skip,
      take: limit,
      orderBy: { createdOn: "desc" },
    }),
    categoryRepo.countCategories(where),
  ]);

  return buildPaginatedResponse(categories, total, page, limit);
};

export const updateCategory = async (id, data, actorId) => {
  const category = await categoryRepo.findCategoryById(id);
  if (!category) throw ApiError.notFound(MSG.CATEGORY.NOT_FOUND);

  if (data.name && data.name !== category.name) {
    const existing = await categoryRepo.findCategoryByNameExcluding(
      data.name,
      id,
    );
    if (existing)
      throw ApiError.conflict("A category with this name already exists.");

    if (existing.isSystem)
      throw ApiError.forbidden("System categories cannot be modified.");
  }

  const updateData = {
    ...data,
    modifiedById: actorId,
  };

  if (data.name && data.name !== category.name) {
    updateData.slug = await generateUniqueSlug(data.name, "category", id);
  }

  return categoryRepo.updateCategory(id, updateData);
};

export const deleteCategory = async (id, actorId) => {
  const category = await categoryRepo.findCategoryById(id);
  if (!category) throw ApiError.notFound(MSG.CATEGORY.NOT_FOUND);

  if (category.isSystem)
    throw ApiError.forbidden("System categories cannot be deleted.");

  // Check for children
  const childCount = await prisma.category.count({
    where: { parentId: id, deletedOn: null },
  });
  if (childCount > 0)
    throw ApiError.conflict(
      "Cannot delete category — it has subcategories. Delete or reassign them first.",
    );

  // Check for prompts using this category
  const promptCount = await prisma.prompt.count({
    where: { categoryId: id, deletedOn: null },
  });
  if (promptCount > 0)
    throw ApiError.conflict(
      "Cannot delete category — it has prompts assigned to it.",
    );

  await categoryRepo.softDeleteCategory(id, actorId);
};
