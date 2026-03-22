import * as categoryRepo from "./category.repository.js";
import { ApiError } from "../../shared/utils/ApiError.js";
import {
  getPaginationParams,
  buildPaginatedResponse,
} from "../../shared/utils/pagination.js";
import { MSG } from "../../constants/messages.js";

export const listCategories = async (query) => {
  const { page, limit, skip } = getPaginationParams(query);
  const { search, parentId, isActive } = query;

  const where = {
    deletedOn: null,
    ...(search && { name: { contains: search } }),
    ...(parentId === "null"
      ? { parentId: null }
      : parentId
        ? { parentId }
        : {}),
    ...(isActive !== undefined && { isActive }),
  };

  const [categories, total] = await Promise.all([
    categoryRepo.findCategories({ where, skip, take: limit }),
    categoryRepo.countCategories(where),
  ]);

  return buildPaginatedResponse(categories, total, page, limit);
};

export const getCategoryBySlug = async (slug) => {
  const category = await categoryRepo.findCategoryBySlug(slug);
  if (!category) throw ApiError.notFound(MSG.CATEGORY.NOT_FOUND);
  return category;
};

export const getCategoryPrompts = async (slug, query) => {
  const category = await categoryRepo.findCategoryBySlug(slug);
  if (!category) throw ApiError.notFound(MSG.CATEGORY.NOT_FOUND);

  const { page, limit, skip } = getPaginationParams(query);
  const { sortBy = "latest", modelType } = query;

  const where = modelType ? { modelType } : {};

  const orderBy =
    sortBy === "popular"
      ? { likesCount: "desc" }
      : sortBy === "trending"
        ? [{ viewsCount: "desc" }, { likesCount: "desc" }]
        : { createdOn: "desc" };

  const [prompts, total] = await Promise.all([
    categoryRepo.getCategoryPrompts({
      categoryId: category.id,
      where,
      skip,
      take: limit,
      orderBy,
    }),
    categoryRepo.countCategoryPrompts(category.id, where),
  ]);

  return {
    category: { id: category.id, name: category.name, slug: category.slug },
    ...buildPaginatedResponse(prompts, total, page, limit),
  };
};
