import * as tagRepo from "../../tag/tag.repository.js";
import { ApiError } from "../../../shared/utils/ApiError.js";
import { MSG } from "../../../constants/messages.js";
import { screenTag } from "../../../shared/services/moderation.service.js";
import slugify from "slugify";
import {
  getPaginationParams,
  buildPaginatedResponse,
} from "../../../shared/utils/pagination.js";

export const listTags = async (query) => {
  const { page, limit, skip } = getPaginationParams(query);
  const { search, status, sortBy = "latest" } = query;

  const where = {
    deletedOn: null,
    // Admin sees ALL statuses by default, can filter by specific status
    ...(status && { status }),
    ...(search && { name: { contains: search } }),
  };

  const orderBy =
    sortBy === "name"
      ? { name: "asc" }
      : sortBy === "popular"
        ? { promptCount: "desc" }
        : { createdOn: "desc" };

  const [tags, total] = await Promise.all([
    tagRepo.findAdminTags({ where, skip, take: limit, orderBy }),
    tagRepo.countTags(where),
  ]);

  return buildPaginatedResponse(tags, total, page, limit);
};

export const createTag = async (data, actorId) => {
  // Admin-created tags are auto-approved — no moderation needed
  const { blocked, reason } = screenTag(data.name);
  if (blocked) throw ApiError.badRequest(reason);

  const slug = slugify(data.name.trim(), { lower: true, strict: true });

  const existing = await tagRepo.findTagByName(data.name.trim());
  if (existing) throw ApiError.conflict(`Tag "${data.name}" already exists.`);

  return tagRepo.createTag({
    name: data.name.trim(),
    slug,
    description: data.description ?? null,
    status: "APPROVED", // admin creates = instantly approved
    createdById: actorId,
    modifiedById: actorId,
  });
};

export const approveTag = async (id, actorId) => {
  const tag = await tagRepo.findTagById(id);
  if (!tag) throw ApiError.notFound(MSG.TAG.NOT_FOUND);

  if (tag.status === "APPROVED")
    throw ApiError.conflict("Tag is already approved.");

  return tagRepo.updateTagStatus(id, "APPROVED", actorId);
};

export const rejectTag = async (id, actorId) => {
  const tag = await tagRepo.findTagById(id);
  if (!tag) throw ApiError.notFound(MSG.TAG.NOT_FOUND);

  if (tag.status === "REJECTED")
    throw ApiError.conflict("Tag is already rejected.");

  return tagRepo.updateTagStatus(id, "REJECTED", actorId);
};

export const deleteTag = async (id, actorId) => {
  const tag = await tagRepo.findTagById(id);
  if (!tag) throw ApiError.notFound(MSG.TAG.NOT_FOUND);

  await tagRepo.softDeleteTag(id, actorId);
};
