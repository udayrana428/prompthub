import prisma from "../../db/index.js";

const buildPromptPublicSelect = (viewerId) => ({
  id: true,
  title: true,
  slug: true,
  shortDescription: true,
  imageUrl: true,
  modelType: true,
  viewsCount: true,
  likesCount: true,
  favoritesCount: true,
  commentsCount: true,
  copiesCount: true,
  featured: true,
  status: true,
  createdOn: true,
  category: { select: { id: true, name: true, slug: true } },
  createdBy: {
    select: {
      id: true,
      username: true,
      slug: true,
      profile: { select: { displayName: true, avatarUrl: true } },
    },
  },
  tags: {
    select: { tag: { select: { id: true, name: true, slug: true } } },
  },
  ...(viewerId && {
    likes: {
      where: { userId: viewerId, deletedOn: null },
      select: { id: true },
      take: 1,
    },
    favorites: {
      where: { userId: viewerId, deletedOn: null },
      select: { id: true },
      take: 1,
    },
  }),
});

const buildPromptAdminListSelect = {
  id: true,
  title: true,
  slug: true,
  shortDescription: true,
  imageUrl: true,
  modelType: true,
  viewsCount: true,
  likesCount: true,
  favoritesCount: true,
  commentsCount: true,
  copiesCount: true,
  featured: true,
  status: true,
  rejectionReason: true,
  createdOn: true,
  modifiedOn: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  createdBy: {
    select: {
      id: true,
      username: true,
      slug: true,
      email: true,
      profile: {
        select: {
          displayName: true,
          avatarUrl: true,
        },
      },
    },
  },
  tags: {
    select: {
      tag: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  },
};

const buildPromptAdminDetailInclude = {
  category: true,
  createdBy: {
    select: {
      id: true,
      username: true,
      slug: true,
      email: true,
      profile: true,
    },
  },
  tags: {
    include: {
      tag: true,
    },
  },
  tips: true,
  variations: true,
};

export const mapPromptViewerState = (prompt) => {
  if (!prompt) return prompt;

  const isLiked = Array.isArray(prompt.likes) && prompt.likes.length > 0;
  const isFavorited =
    Array.isArray(prompt.favorites) && prompt.favorites.length > 0;

  const { likes, favorites, ...rest } = prompt;

  return {
    ...rest,
    isLiked,
    isFavorited,
  };
};

export const findPrompts = ({ where, skip, take, orderBy, viewerId }) =>
  prisma.prompt.findMany({
    where,
    skip,
    take,
    orderBy,
    select: buildPromptPublicSelect(viewerId),
  });

export const countPrompts = (where) => prisma.prompt.count({ where });

export const findAdminPrompts = ({ where, skip, take, orderBy }) =>
  prisma.prompt.findMany({
    where,
    skip,
    take,
    orderBy,
    select: buildPromptAdminListSelect,
  });

export const findAdminPromptById = (id) =>
  prisma.prompt.findFirst({
    where: { id, deletedOn: null },
    include: buildPromptAdminDetailInclude,
  });

export const findPromptBySlug = (slug, viewerId) =>
  prisma.prompt.findFirst({
    where: { slug, deletedOn: null, status: "APPROVED" },
    include: {
      category: true,
      createdBy: {
        select: {
          id: true,
          username: true,
          slug: true,
          profile: {
            select: {
              displayName: true,
              avatarUrl: true,
              followersCount: true,
            },
          },
        },
      },
      tags: { include: { tag: true } },
      tips: true,
      variations: true,
      ...(viewerId && {
        likes: {
          where: { userId: viewerId, deletedOn: null },
          select: { id: true },
          take: 1,
        },
        favorites: {
          where: { userId: viewerId, deletedOn: null },
          select: { id: true },
          take: 1,
        },
      }),
    },
  });

export const findPromptById = (id) =>
  prisma.prompt.findFirst({ where: { id, deletedOn: null } });

export const findEditablePromptById = (id) =>
  prisma.prompt.findFirst({
    where: { id, deletedOn: null },
    include: {
      category: true,
      tags: { include: { tag: true } },
      tips: true,
      variations: true,
    },
  });

export const createPrompt = (data, tx = prisma) =>
  tx.prompt.create({
    data,
    include: {
      tags: { include: { tag: true } },
      tips: true,
      variations: true,
    },
  });

export const updatePrompt = (id, data, tx = prisma) =>
  tx.prompt.update({ where: { id }, data });

export const softDeletePrompt = (id, deletedById) =>
  prisma.prompt.update({
    where: { id },
    data: { deletedOn: new Date(), deletedById, status: "ARCHIVED" },
  });

export const incrementViewCount = (id) =>
  prisma.prompt.update({
    where: { id },
    data: { viewsCount: { increment: 1 } },
  });

export const incrementCopyCount = (id) =>
  prisma.prompt.update({
    where: { id },
    data: { copiesCount: { increment: 1 } },
  });

// Like operations
export const findLike = (promptId, userId) =>
  prisma.promptLike.findFirst({ where: { promptId, userId, deletedOn: null } });

export const createLike = (promptId, userId) =>
  prisma.$transaction([
    prisma.promptLike.upsert({
      where: { promptId_userId: { promptId, userId } },
      create: { promptId, userId },
      update: { deletedOn: null },
    }),
    prisma.prompt.update({
      where: { id: promptId },
      data: { likesCount: { increment: 1 } },
    }),
  ]);

export const deleteLike = (promptId, userId) =>
  prisma.$transaction([
    prisma.promptLike.updateMany({
      where: { promptId, userId, deletedOn: null },
      data: { deletedOn: new Date() },
    }),
    prisma.prompt.update({
      where: { id: promptId },
      data: { likesCount: { decrement: 1 } },
    }),
  ]);

// Favorite operations
export const findFavorite = (promptId, userId) =>
  prisma.promptFavorite.findFirst({
    where: { promptId, userId, deletedOn: null },
  });

export const createFavorite = (promptId, userId) =>
  prisma.$transaction([
    prisma.promptFavorite.upsert({
      where: { promptId_userId: { promptId, userId } },
      create: { promptId, userId },
      update: { deletedOn: null },
    }),
    prisma.prompt.update({
      where: { id: promptId },
      data: { favoritesCount: { increment: 1 } },
    }),
  ]);

export const deleteFavorite = (promptId, userId) =>
  prisma.$transaction([
    prisma.promptFavorite.updateMany({
      where: { promptId, userId, deletedOn: null },
      data: { deletedOn: new Date() },
    }),
    prisma.prompt.update({
      where: { id: promptId },
      data: { favoritesCount: { decrement: 1 } },
    }),
  ]);

// Views
export const recordView = (data) => prisma.promptView.create({ data });

// Tags management (replace all)
export const replaceTags = async (promptId, tagIds, tx = prisma) => {
  await tx.promptTag.deleteMany({ where: { promptId } });
  if (tagIds.length) {
    await tx.promptTag.createMany({
      data: tagIds.map((tagId) => ({ promptId, tagId })),
    });
  }
};

export const replaceTips = async (promptId, tips, tx = prisma) => {
  await tx.promptTip.deleteMany({ where: { promptId } });
  if (tips.length) {
    await tx.promptTip.createMany({
      data: tips.map((content) => ({ promptId, content })),
    });
  }
};

export const replaceVariations = async (promptId, variations, tx = prisma) => {
  await tx.promptVariation.deleteMany({ where: { promptId } });
  if (variations.length) {
    await tx.promptVariation.createMany({
      data: variations.map((content) => ({ promptId, content })),
    });
  }
};

export const logModeration = (
  promptId,
  action,
  reason,
  confidence,
  triggeredBy = "ai-classifier",
  tx = prisma,
) =>
  tx.promptModerationLog.create({
    data: {
      promptId,
      action,
      reason: reason ?? null,
      confidence: confidence ?? null,
      triggeredBy,
    },
  });

// Separate from updatePrompt — moderation system should only touch status/rejectionReason
// never the full prompt payload to avoid accidental overwrites
export const updatePromptStatus = (
  promptId,
  status,
  rejectionReason = null,
  tx = prisma,
) =>
  tx.prompt.update({
    where: { id: promptId },
    data: {
      status,
      ...(rejectionReason !== null && { rejectionReason }),
    },
  });
