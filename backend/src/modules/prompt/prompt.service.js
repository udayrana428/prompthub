import * as promptRepo from "./prompt.repository.js";
import * as tagRepo from "../tag/tag.repository.js";
import { generateUniqueSlugTx } from "../../shared/services/slug.service.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicId,
} from "../../shared/services/cloudinary.service.js";
import { ApiError } from "../../shared/utils/ApiError.js";
import { MSG } from "../../constants/messages.js";
import { PromptStatus } from "../../constants/enums.js";
import {
  getPaginationParams,
  buildPaginatedResponse,
} from "../../shared/utils/pagination.js";
import { screenText } from "../../shared/services/moderation.service.js";
import { moderationQueue } from "../../jobs/queues.js";
import {
  buildPageKey,
  resolveMeta,
} from "../../shared/services/seo.service.js";
import { capitalize } from "../../shared/utils/helpers.js";
import { appConfig } from "../../config/app.config.js";
import prisma from "../../db/index.js";
import logger from "../../logger/winston.logger.js";

const buildPromptMeta = (prompt) => {
  const baseUrl = appConfig.appUrl;
  const tags = prompt.tags.map((t) => t.tag.name);

  return {
    title:
      prompt.metaTitle ??
      `${prompt.title} – Best ${prompt.modelType} Prompt | PromptHub`,
    description:
      prompt.metaDescription ??
      `${prompt.shortDescription} Use this ${prompt.modelType} prompt to generate stunning ${prompt.category.name} images.`,
    keywords: [
      ...tags,
      prompt.modelType,
      prompt.category.name,
      "AI prompt",
      "PromptHub",
    ],
    image: prompt.imageUrl ?? `${baseUrl}/og-default.jpg`,
    url: `${baseUrl}/prompts/${prompt.slug}`,
    publishedTime: prompt.createdOn,
    modifiedTime: prompt.modifiedOn,
    author: prompt.createdBy.username,
    type: "article",
  };
};

const buildListMeta = ({ search, category, tag, total }) => {
  const baseUrl = appConfig.appUrl;

  // Dynamic title based on active filters
  let title = "Browse AI Prompts – PromptHub";
  let description = `Discover ${total}+ curated AI prompts for image generation.`;
  let canonical = "/prompts";

  if (category) {
    title = `Best ${capitalize(category)} AI Prompts | PromptHub`;
    description = `Browse the best ${category} AI prompts. ${total}+ prompts for MidJourney, DALL-E, and more.`;
    canonical = `/prompts?category=${category}`;
  }

  if (search) {
    title = `"${search}" AI Prompts – Search Results | PromptHub`;
    description = `Found ${total} AI prompts matching "${search}".`;
    canonical = `/prompts?search=${search}`;
  }

  if (tag) {
    title = `Best #${tag} AI Prompts | PromptHub`;
    description = `Browse ${total}+ AI prompts tagged with ${tag}.`;
    canonical = `/prompts?tag=${tag}`;
  }

  return {
    title,
    description,
    keywords: ["AI prompts", "image generation", category, tag, search].filter(
      Boolean,
    ),
    canonical: `${baseUrl}${canonical}`,
  };
};

export const listPrompts = async (query, viewerId) => {
  const { page, limit, skip } = getPaginationParams(query);
  const {
    categoryId,
    modelType,
    model,
    search,
    sortBy = "latest",
    category,
    tag,
  } = query;
  const normalizedModelType = modelType || model;

  const where = {
    status: PromptStatus.APPROVED,
    deletedOn: null,
    ...(categoryId && { categoryId }),
    ...(category && { category: { slug: category } }),
    ...(tag && { tags: { some: { tag: { slug: tag, deletedOn: null } } } }),
    ...(normalizedModelType && { modelType: normalizedModelType }),
    ...(search && {
      OR: [
        { title: { contains: search } },
        { shortDescription: { contains: search } },
      ],
    }),
  };

  const orderBy =
    sortBy === "popular"
      ? { likesCount: "desc" }
      : sortBy === "trending"
        ? [{ viewsCount: "desc" }, { likesCount: "desc" }]
        : { createdOn: "desc" };

  const [prompts, total] = await Promise.all([
    promptRepo.findPrompts({
      where,
      skip,
      take: limit,
      orderBy,
      viewerId,
    }),
    promptRepo.countPrompts(where),
  ]);

  // Build + resolve meta
  const generated = buildListMeta({ search, category, tag, total });

  const pageKey = category
    ? buildPageKey.promptsByCategory(category)
    : tag
      ? buildPageKey.promptsByTag(tag)
      : search
        ? null // search pages never get DB overrides
        : buildPageKey.promptListing();

  const meta = await resolveMeta(pageKey, generated);

  return buildPaginatedResponse(
    prompts.map(promptRepo.mapPromptViewerState),
    total,
    page,
    limit,
    meta,
  );
};
export const getPromptBySlug = async (slug, viewerData) => {
  const prompt = await promptRepo.findPromptBySlug(slug, viewerData?.userId);
  if (!prompt) throw ApiError.notFound(MSG.PROMPT.NOT_FOUND);

  // Record view (fire and forget)
  promptRepo
    .recordView({
      promptId: prompt.id,
      userId: viewerData?.userId || null,
      sessionId: viewerData?.sessionId || null,
      ipHash: viewerData?.ipHash || null,
      userAgent: viewerData?.userAgent || null,
    })
    .catch(() => {});

  promptRepo.incrementViewCount(prompt.id).catch(() => {});

  const generated = buildPromptMeta(prompt);

  const meta = await resolveMeta(buildPageKey.prompt(slug), generated);

  return { prompt: promptRepo.mapPromptViewerState(prompt), meta };
};

export const getPromptForEdit = async (promptId, userId) => {
  const prompt = await promptRepo.findEditablePromptById(promptId);
  if (!prompt) throw ApiError.notFound(MSG.PROMPT.NOT_FOUND);
  if (prompt.createdById !== userId) throw ApiError.forbidden();

  return prompt;
};

// src/modules/prompt/prompt.service.js

export const createPrompt = async (data, authorId, imageFile) => {
  if (!imageFile) throw ApiError.badRequest(MSG.PROMPT.IMAGE_REQUIRED);
  // ── Layer 1: Synchronous blocklist (BEFORE any DB or file operations) ─────────
  const textToScreen = `${data.title} ${data.shortDescription ?? ""} ${data.description ?? ""} ${data.promptText}`;
  const screenResult = screenText(textToScreen);
  if (screenResult.flagged) throw ApiError.badRequest(screenResult.reason);

  // ── Cloudinary upload BEFORE transaction ──────────────────────────────────────
  // Reason: external service calls cannot be inside a DB transaction.
  // If the transaction later fails, we clean up the uploaded image manually.
  let imageUrl = null;
  let cloudinaryPublicId = null;

  if (imageFile) {
    const result = await uploadToCloudinary(
      imageFile.buffer ?? imageFile.path,
      "prompts",
    );
    if (result) {
      imageUrl = result.secure_url;
      cloudinaryPublicId = result.public_id;
    }
  }

  let prompt;

  try {
    // ── Atomic transaction: slug + tags + prompt all succeed or all roll back ────
    prompt = await prisma.$transaction(async (tx) => {
      // Slug inside transaction — eliminates race condition window
      const slug = await generateUniqueSlugTx(data.title, "prompt", tx);

      // Resolve/create tags inside same transaction
      const tagIds = [];
      if (data.tags?.length) {
        for (const tagName of data.tags) {
          const tag = await tagRepo.findOrCreateTag(tagName, authorId, tx);
          tagIds.push(tag.id);
        }
      }

      // Create prompt with everything together
      return promptRepo.createPrompt(
        {
          title: data.title,
          slug,
          shortDescription: data.shortDescription,
          description: data.description,
          promptText: data.promptText,
          imageUrl,
          categoryId: data.categoryId,
          modelType: data.modelType || "OTHER",
          metaTitle: data.title,
          metaDescription: data.description,
          status: PromptStatus.PENDING,
          createdById: authorId,
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
    }); // ← if anything above throws, entire transaction rolls back
  } catch (err) {
    // ── Transaction failed — clean up the uploaded image ──────────────────────
    if (cloudinaryPublicId) {
      await deleteFromCloudinary(cloudinaryPublicId).catch(() => {});
    }
    throw err; // re-throw for global error handler
  }

  // ── Enqueue moderation AFTER successful transaction ────────────────────────
  // Queue failure does NOT roll back the prompt — it has its own retry mechanism
  try {
    await moderationQueue.add("moderate-prompt", {
      promptId: prompt.id,
      authorId,
      text: textToScreen,
    });
  } catch (err) {
    // Queue is down — prompt stays PENDING, admin sees it in manual review
    logger.error(
      `Failed to enqueue moderation for prompt ${prompt.id}:`,
      err.message,
    );
  }

  return prompt;
};

export const updatePrompt = async (promptId, userId, data, imageFile) => {
  const existing = await promptRepo.findPromptById(promptId);
  if (!existing) throw ApiError.notFound(MSG.PROMPT.NOT_FOUND);
  if (existing.createdById !== userId) throw ApiError.forbidden();
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
    const textToScreen = [
      data.title ?? existing.title,
      data.shortDescription ?? existing.shortDescription ?? "",
      data.description ?? existing.description ?? "",
      data.promptText ?? existing.promptText,
    ].join(" ");

    const screenResult = screenText(textToScreen);
    if (screenResult.flagged) throw ApiError.badRequest(screenResult.reason);
  }

  // ── Handle image upload BEFORE transaction ────────────────────────────────────
  let newImageUrl = null;
  let newCloudinaryPublicId = null;

  if (imageFile) {
    const result = await uploadToCloudinary(
      imageFile.buffer ?? imageFile.path,
      "prompts",
    );
    if (result) {
      newImageUrl = result.secure_url;
      newCloudinaryPublicId = result.public_id;
    }
  }

  let updated;

  try {
    updated = await prisma.$transaction(async (tx) => {
      const updateData = {};

      // Slug generation inside transaction
      if (data.title && data.title !== existing.title) {
        updateData.title = data.title;
        updateData.slug = await generateUniqueSlugTx(
          data.title,
          "prompt",
          tx,
          promptId,
        );
        updateData.metaTitle = data.title;
        updateData.metaDescription = data.description ?? "";
      }

      if (data.promptText) updateData.promptText = data.promptText;
      if (data.shortDescription !== undefined)
        updateData.shortDescription = data.shortDescription;
      if (data.categoryId) updateData.categoryId = data.categoryId;
      if (data.modelType) updateData.modelType = data.modelType;
      if (data.description !== undefined)
        updateData.description = data.description;
      if (newImageUrl) updateData.imageUrl = newImageUrl;

      if (contentChanged) {
        updateData.status = PromptStatus.PENDING;
        updateData.rejectionReason = null;
      }

      updateData.modifiedById = userId;

      // Update prompt inside transaction
      const result = await promptRepo.updatePrompt(promptId, updateData, tx);

      // Replace tags inside same transaction
      if (data.tags) {
        const tagIds = [];
        for (const tagName of data.tags) {
          const tag = await tagRepo.findOrCreateTag(tagName, userId, tx);
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

      return result;
    });
  } catch (err) {
    // Transaction failed — clean up newly uploaded image
    if (newCloudinaryPublicId) {
      await deleteFromCloudinary(newCloudinaryPublicId).catch(() => {});
    }
    throw err;
  }

  // Old image cleanup AFTER successful transaction
  // Only delete old image once we're sure the DB update committed
  if (imageFile && existing.imageUrl) {
    await deleteFromCloudinary(extractPublicId(existing.imageUrl)).catch(
      () => {},
    );
  }

  // Enqueue re-moderation if content changed
  if (contentChanged) {
    const textToModerate = [
      updated.title,
      updated.shortDescription ?? "",
      updated.promptText,
    ].join(" ");

    try {
      await moderationQueue.add("moderate-prompt", {
        promptId: updated.id,
        authorId: userId,
        text: textToModerate,
        isUpdate: true,
      });
    } catch (err) {
      logger.error(
        `Failed to enqueue re-moderation for prompt ${updated.id}:`,
        err.message,
      );
    }
  }

  return updated;
};
export const deletePrompt = async (promptId, userId) => {
  const existing = await promptRepo.findPromptById(promptId);
  if (!existing) throw ApiError.notFound(MSG.PROMPT.NOT_FOUND);
  if (existing.createdById !== userId) throw ApiError.forbidden();
  await promptRepo.softDeletePrompt(promptId, userId);
};

export const likePrompt = async (promptId, userId) => {
  const existing = await promptRepo.findLike(promptId, userId);
  if (existing) throw ApiError.conflict(MSG.PROMPT.LIKED);
  await promptRepo.createLike(promptId, userId);
};

export const unlikePrompt = async (promptId, userId) => {
  const existing = await promptRepo.findLike(promptId, userId);
  if (!existing) throw ApiError.conflict("You haven't liked this prompt.");
  await promptRepo.deleteLike(promptId, userId);
};

export const favoritePrompt = async (promptId, userId) => {
  const existing = await promptRepo.findFavorite(promptId, userId);
  if (existing) throw ApiError.conflict(MSG.PROMPT.FAVORITED);
  await promptRepo.createFavorite(promptId, userId);
};

export const unfavoritePrompt = async (promptId, userId) => {
  const existing = await promptRepo.findFavorite(promptId, userId);
  if (!existing)
    throw ApiError.conflict("This prompt is not in your favorites.");
  await promptRepo.deleteFavorite(promptId, userId);
};

export const copyPrompt = async (promptId) => {
  const prompt = await promptRepo.findPromptById(promptId);
  if (!prompt || prompt.status !== PromptStatus.APPROVED)
    throw ApiError.notFound(MSG.PROMPT.NOT_FOUND);
  await promptRepo.incrementCopyCount(promptId);
  return { promptText: prompt.promptText };
};
