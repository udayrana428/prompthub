import * as tagRepo from "./tag.repository.js";
import { ApiError } from "../../shared/utils/ApiError.js";
import {
  getPaginationParams,
  buildPaginatedResponse,
} from "../../shared/utils/pagination.js";
import { MSG } from "../../constants/messages.js";

export const listTags = async (query) => {
  const { page, limit, skip } = getPaginationParams(query);
  const { search, sortBy = "popular" } = query;

  const where = {
    deletedOn: null,
    status: "APPROVED", // ← public only sees approved tags
    ...(search && { name: { contains: search } }),
  };

  const orderBy = sortBy === "name" ? { name: "asc" } : { promptCount: "desc" };

  const [tags, total] = await Promise.all([
    tagRepo.findTags({ where, skip, take: limit, orderBy }),
    tagRepo.countTags(where),
  ]);

  return buildPaginatedResponse(tags, total, page, limit);
};

export const getTagBySlug = async (slug) => {
  const tag = await tagRepo.findTagBySlug(slug);
  if (!tag) throw ApiError.notFound(MSG.TAG.NOT_FOUND);
  return tag;
};

export const getTagPrompts = async (slug, query) => {
  const tag = await tagRepo.findTagBySlug(slug);
  if (!tag) throw ApiError.notFound(MSG.TAG.NOT_FOUND);

  const { page, limit, skip } = getPaginationParams(query);
  const { sortBy = "latest" } = query;

  const orderBy =
    sortBy === "popular" ? { likesCount: "desc" } : { createdOn: "desc" };

  const [promptTags, total] = await Promise.all([
    tagRepo.getTagPrompts({ tagId: tag.id, skip, take: limit, orderBy }),
    tagRepo.countTagPrompts(tag.id),
  ]);

  const prompts = promptTags.map((pt) => pt.prompt);

  return {
    tag: { id: tag.id, name: tag.name, slug: tag.slug },
    ...buildPaginatedResponse(prompts, total, page, limit),
  };
};
