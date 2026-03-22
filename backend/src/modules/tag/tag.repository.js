import prisma from "../../db/index.js";
import slugify from "slugify";
import { screenTag } from "../../shared/services/moderation.service.js";
import { ApiError } from "../../shared/utils/ApiError.js";

const tagSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  status: true,
  promptCount: true,
  createdOn: true,
};

// ─── Public ────────────────────────────────────────────────────────────────────
// Used by: tag.service.js

export const findTags = ({ where, skip, take, orderBy }) =>
  prisma.tag.findMany({ where, skip, take, orderBy, select: tagSelect });

export const countTags = (where) => prisma.tag.count({ where });

export const findTagBySlug = (slug) =>
  prisma.tag.findFirst({
    where: { slug, deletedOn: null, status: "APPROVED" },
    select: tagSelect,
  });

export const getTagPrompts = ({ tagId, skip, take, orderBy }) =>
  prisma.promptTag.findMany({
    where: {
      tagId,
      prompt: { deletedOn: null, status: "APPROVED" },
    },
    skip,
    take,
    include: {
      prompt: {
        select: {
          id: true,
          title: true,
          slug: true,
          shortDescription: true,
          imageUrl: true,
          modelType: true,
          likesCount: true,
          viewsCount: true,
          commentsCount: true,
          createdOn: true,
          category: { select: { id: true, name: true, slug: true } },
          createdBy: {
            select: {
              id: true,
              username: true,
              profile: { select: { displayName: true, avatarUrl: true } },
            },
          },
        },
      },
    },
    orderBy: orderBy ? { prompt: orderBy } : { prompt: { createdOn: "desc" } },
  });

export const countTagPrompts = (tagId) =>
  prisma.promptTag.count({
    where: { tagId, prompt: { deletedOn: null, status: "APPROVED" } },
  });

// ─── Shared (used by both public and admin) ───────────────────────────────────

export const findTagById = (id, tx = prisma) =>
  tx.tag.findFirst({ where: { id, deletedOn: null } });

// Used by prompt.service.js when creating/updating prompts
export const findOrCreateTag = async (name, createdById, tx = prisma) => {
  const { blocked, reason } = screenTag(name);
  if (blocked) throw ApiError.badRequest(reason);

  const slug = slugify(name.trim(), { lower: true, strict: true });

  const existing = await tx.tag.findFirst({
    where: { slug, deletedOn: null },
  });
  if (existing) return existing;
  // New tag — create as PENDING, still attaches to prompt
  // but won't appear in public tag listings until approved
  return tx.tag.create({
    data: { name: name.trim(), slug, createdById, status: "PENDING" },
  });
};

// ─── Admin ─────────────────────────────────────────────────────────────────────
// Used by: admin/tag/admin.tag.service.js

export const findTagByName = (name) =>
  prisma.tag.findFirst({ where: { name, deletedOn: null } });

export const findTagByNameExcluding = (name, excludeId) =>
  prisma.tag.findFirst({
    where: { name, deletedOn: null, NOT: { id: excludeId } },
  });

export const findAdminTags = ({ where, skip, take, orderBy }) =>
  prisma.tag.findMany({
    where,
    skip,
    take,
    orderBy,
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      status: true,
      promptCount: true,
      createdOn: true,
      createdBy: {
        select: { id: true, username: true },
      },
    },
  });

export const createTag = (data, tx = prisma) =>
  tx.tag.create({ data, select: tagSelect });

export const updateTagStatus = (id, status, actorId, tx = prisma) =>
  tx.tag.update({
    where: { id },
    data: { status, modifiedById: actorId },
  });

export const softDeleteTag = (id, deletedById, tx = prisma) =>
  prisma.tag.update({
    where: { id },
    data: { deletedOn: new Date(), deletedById },
  });
