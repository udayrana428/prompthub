import prisma from "../../../db/index.js";
import * as promptRepo from "../../prompt/prompt.repository.js";
import * as tagRepo from "../../tag/tag.repository.js";
import { generateUniqueSlugTx } from "../../../shared/services/slug.service.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicId,
} from "../../../shared/services/cloudinary.service.js";
import { ApiError } from "../../../shared/utils/ApiError.js";
import { MSG } from "../../../constants/messages.js";
import { PromptStatus } from "../../../constants/enums.js";
import {
  getPaginationParams,
  buildPaginatedResponse,
} from "../../../shared/utils/pagination.js";
import { screenText } from "../../../shared/services/moderation.service.js";

const buildAdminPromptWhere = (query) => {
  const {
    search,
    status,
    featured,
    categoryId,
    createdById,
    modelType,
  } = query;

  return {
    deletedOn: null,
    ...(status && { status }),
    ...(featured !== undefined && { featured }),
    ...(categoryId && { categoryId }),
    ...(createdById && { createdById }),
    ...(modelType && { modelType }),
    ...(search && {
      OR: [
        { title: { contains: search } },
        { shortDescription: { contains: search } },
        { promptText: { contains: search } },
        { createdBy: { is: { username: { contains: search } } } },
        {
          createdBy: {
            is: {
              profile: {
                is: {
                  displayName: { contains: search },
                },
              },
            },
          },
        },
      ],
    }),
  };
};

const buildAdminPromptOrderBy = (sortBy) => {
  switch (sortBy) {
    case "oldest":
      return { createdOn: "asc" };
    case "popular":
      return [{ likesCount: "desc" }, { favoritesCount: "desc" }];
    case "mostViewed":
      return { viewsCount: "desc" };
    case "latest":
    default:
      return { createdOn: "desc" };
  }
};

const buildModerationText = (data) =>
  [
    data.title ?? "",
    data.shortDescription ?? "",
    data.description ?? "",
    data.promptText ?? "",
  ].join(" ");

const uploadPromptImage = async (imageFile) => {
  if (!imageFile) return null;

  const result = await uploadToCloudinary(
    imageFile.buffer ?? imageFile.path,
    "prompts",
  );

  if (!result) return null;

  return {
    imageUrl: result.secure_url,
    publicId: result.public_id,
  };
};

export const listPrompts = async (query) => {
  const { page, limit, skip } = getPaginationParams(query);
  const where = buildAdminPromptWhere(query);
  const orderBy = buildAdminPromptOrderBy(query.sortBy);

  const [prompts, total] = await Promise.all([
    promptRepo.findAdminPrompts({
      where,
      skip,
      take: limit,
      orderBy,
    }),
    promptRepo.countPrompts(where),
  ]);

  return buildPaginatedResponse(prompts, total, page, limit);
};

export const getPromptById = async (promptId) => {
  const prompt = await promptRepo.findAdminPromptById(promptId);
  if (!prompt) throw ApiError.notFound(MSG.PROMPT.NOT_FOUND);
  return prompt;
};

export const createPrompt = async (data, actorId, imageFile) => {
  if (!imageFile) throw ApiError.badRequest(MSG.PROMPT.IMAGE_REQUIRED);

  const screenedText = buildModerationText(data);
  const screenResult = screenText(screenedText);
  if (screenResult.flagged) throw ApiError.badRequest(screenResult.reason);

  const uploadedImage = await uploadPromptImage(imageFile);
  let prompt;

  try {
    prompt = await prisma.$transaction(async (tx) => {
      const slug = await generateUniqueSlugTx(data.title, "prompt", tx);

      const tagIds = [];
      if (data.tags?.length) {
        for (const tagName of data.tags) {
          const tag = await tagRepo.findOrCreateTag(tagName, actorId, tx);
          tagIds.push(tag.id);
        }
      }

      return promptRepo.createPrompt(
        {
          title: data.title,
          slug,
          shortDescription: data.shortDescription || null,
          description: data.description || null,
          promptText: data.promptText,
          imageUrl: uploadedImage?.imageUrl ?? null,
          categoryId: data.categoryId,
          modelType: data.modelType,
          metaTitle: data.metaTitle || data.title,
          metaDescription: data.metaDescription || data.description || null,
          status: data.status ?? PromptStatus.APPROVED,
          featured: data.featured ?? false,
          rejectionReason: data.rejectionReason || null,
          createdById: actorId,
          modifiedById: actorId,
          ...(data.tips?.length && {
            tips: { create: data.tips.map((content) => ({ content })) },
          }),
          ...(data.variations?.length && {
            variations: {
              create: data.variations.map((content) => ({ content })),
            },
          }),
          ...(tagIds.length && {
            tags: { create: tagIds.map((tagId) => ({ tagId })) },
          }),
        },
        tx,
      );
    });
  } catch (error) {
    if (uploadedImage?.publicId) {
      await deleteFromCloudinary(uploadedImage.publicId).catch(() => {});
    }
    throw error;
  }

  return getPromptById(prompt.id);
};

export const updatePrompt = async (promptId, data, actorId, imageFile) => {
  const existing = await promptRepo.findAdminPromptById(promptId);
  if (!existing) throw ApiError.notFound(MSG.PROMPT.NOT_FOUND);
  if (!existing.imageUrl && !imageFile) {
    throw ApiError.badRequest(MSG.PROMPT.IMAGE_REQUIRED);
  }

  const contentChanged =
    (data.title && data.title !== existing.title) ||
    (data.promptText && data.promptText !== existing.promptText) ||
    (data.shortDescription !== undefined &&
      data.shortDescription !== existing.shortDescription) ||
    (data.description !== undefined &&
      data.description !== existing.description);

  if (contentChanged) {
    const screenResult = screenText(
      buildModerationText({
        title: data.title ?? existing.title,
        shortDescription:
          data.shortDescription ?? existing.shortDescription ?? "",
        description: data.description ?? existing.description ?? "",
        promptText: data.promptText ?? existing.promptText,
      }),
    );

    if (screenResult.flagged) throw ApiError.badRequest(screenResult.reason);
  }

  const uploadedImage = await uploadPromptImage(imageFile);

  try {
    await prisma.$transaction(async (tx) => {
      const updateData = {
        modifiedById: actorId,
      };

      if (data.title && data.title !== existing.title) {
        updateData.title = data.title;
        updateData.slug = await generateUniqueSlugTx(
          data.title,
          "prompt",
          tx,
          promptId,
        );
      }

      if (data.promptText !== undefined) updateData.promptText = data.promptText;
      if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
      if (data.modelType !== undefined) updateData.modelType = data.modelType;
      if (data.shortDescription !== undefined) {
        updateData.shortDescription = data.shortDescription || null;
      }
      if (data.description !== undefined) {
        updateData.description = data.description || null;
      }
      if (data.status !== undefined) updateData.status = data.status;
      if (data.featured !== undefined) updateData.featured = data.featured;
      if (data.rejectionReason !== undefined) {
        updateData.rejectionReason = data.rejectionReason || null;
      }
      if (data.metaTitle !== undefined) {
        updateData.metaTitle = data.metaTitle || null;
      } else if (data.title && data.title !== existing.title) {
        updateData.metaTitle = data.title;
      }
      if (data.metaDescription !== undefined) {
        updateData.metaDescription = data.metaDescription || null;
      } else if (data.description !== undefined) {
        updateData.metaDescription = data.description || null;
      }
      if (uploadedImage?.imageUrl) {
        updateData.imageUrl = uploadedImage.imageUrl;
      }

      await promptRepo.updatePrompt(promptId, updateData, tx);

      if (data.tags) {
        const tagIds = [];
        for (const tagName of data.tags) {
          const tag = await tagRepo.findOrCreateTag(tagName, actorId, tx);
          tagIds.push(tag.id);
        }
        await promptRepo.replaceTags(promptId, tagIds, tx);
      }

      if (data.tips) {
        await promptRepo.replaceTips(promptId, data.tips, tx);
      }

      if (data.variations) {
        await promptRepo.replaceVariations(promptId, data.variations, tx);
      }
    });
  } catch (error) {
    if (uploadedImage?.publicId) {
      await deleteFromCloudinary(uploadedImage.publicId).catch(() => {});
    }
    throw error;
  }

  if (uploadedImage?.imageUrl && existing.imageUrl) {
    await deleteFromCloudinary(extractPublicId(existing.imageUrl)).catch(
      () => {},
    );
  }

  return getPromptById(promptId);
};

export const updatePromptStatus = async (promptId, data, actorId) => {
  const existing = await promptRepo.findPromptById(promptId);
  if (!existing) throw ApiError.notFound(MSG.PROMPT.NOT_FOUND);

  await promptRepo.updatePrompt(promptId, {
    status: data.status,
    rejectionReason: data.rejectionReason || null,
    modifiedById: actorId,
  });

  return getPromptById(promptId);
};

export const updatePromptFeatured = async (promptId, featured, actorId) => {
  const existing = await promptRepo.findPromptById(promptId);
  if (!existing) throw ApiError.notFound(MSG.PROMPT.NOT_FOUND);

  await promptRepo.updatePrompt(promptId, {
    featured,
    modifiedById: actorId,
  });

  return getPromptById(promptId);
};

export const deletePrompt = async (promptId, actorId) => {
  const existing = await promptRepo.findPromptById(promptId);
  if (!existing) throw ApiError.notFound(MSG.PROMPT.NOT_FOUND);

  await promptRepo.softDeletePrompt(promptId, actorId);
};
