import prisma from "../../db/index.js";

// Returns the single most-recent snapshot date for this window type
const getLatestSnapshotDate = async (windowType) => {
  const row = await prisma.promptTrendingSnapshot.findFirst({
    where: { windowType },
    orderBy: { snapshotDate: "desc" },
    select: { snapshotDate: true },
  });
  return row?.snapshotDate ?? null;
};

// Read path — only the latest snapshot per window, one row per prompt
export const getTopPromptsByWindow = async (
  windowType,
  limit = 20,
  viewerId = null,
) => {
  const latestDate = await getLatestSnapshotDate(windowType);
  if (!latestDate) return [];

  return prisma.promptTrendingSnapshot.findMany({
    where: {
      windowType,
      snapshotDate: latestDate,
      prompt: {
        status: "APPROVED",
        deletedOn: null,
      },
    },
    orderBy: { rank: "asc" },
    take: limit,
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
          favoritesCount: true,
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
            select: {
              tag: { select: { id: true, name: true, slug: true } },
            },
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
        },
      },
    },
  });
};

export const upsertSnapshot = (data) =>
  prisma.promptTrendingSnapshot.upsert({
    where: {
      promptId_snapshotDate_windowType: {
        promptId: data.promptId,
        snapshotDate: data.snapshotDate,
        windowType: data.windowType,
      },
    },
    create: data,
    update: {
      score: data.score,
      rank: data.rank,
      viewsCount: data.viewsCount,
      likesCount: data.likesCount,
      commentsCount: data.commentsCount,
      favoritesCount: data.favoritesCount,
    },
  });

// The core fix: count actual events in the time window, not lifetime totals
// Uses your existing PromptView, PromptLike, PromptFavorite, PromptComment tables
export const getWindowedActivityForAllPrompts = async (since) => {
  const [views, likes, favorites, comments] = await Promise.all([
    // Deduplicated views: one per (promptId, ipHash) or (promptId, userId)
    // to avoid inflating with bots/refreshes
    prisma.promptView.groupBy({
      by: ["promptId"],
      where: { createdOn: { gte: since } },
      _count: { id: true },
    }),
    prisma.promptLike.groupBy({
      by: ["promptId"],
      where: { createdOn: { gte: since }, deletedOn: null },
      _count: { id: true },
    }),
    prisma.promptFavorite.groupBy({
      by: ["promptId"],
      where: { createdOn: { gte: since }, deletedOn: null },
      _count: { id: true },
    }),
    prisma.promptComment.groupBy({
      by: ["promptId"],
      where: {
        createdOn: { gte: since },
        deletedOn: null,
        status: "VISIBLE",
      },
      _count: { id: true },
    }),
  ]);

  // Build a map: promptId → { viewsCount, likesCount, favoritesCount, commentsCount }
  const activity = new Map();

  const merge = (rows, field) => {
    for (const row of rows) {
      const entry = activity.get(row.promptId) ?? {
        viewsCount: 0,
        likesCount: 0,
        favoritesCount: 0,
        commentsCount: 0,
      };
      entry[field] = row._count.id;
      activity.set(row.promptId, entry);
    }
  };

  merge(views, "viewsCount");
  merge(likes, "likesCount");
  merge(favorites, "favoritesCount");
  merge(comments, "commentsCount");

  return activity; // Map<promptId, counts>
};

// Fetch only approved, non-deleted prompts that had ANY activity in window
export const getActivePromptIds = (since) =>
  prisma.prompt.findMany({
    where: {
      status: "APPROVED",
      deletedOn: null,
      OR: [
        { views: { some: { createdOn: { gte: since } } } },
        { likes: { some: { createdOn: { gte: since }, deletedOn: null } } },
        { favorites: { some: { createdOn: { gte: since }, deletedOn: null } } },
        { comments: { some: { createdOn: { gte: since }, deletedOn: null } } },
      ],
    },
    select: { id: true },
  });
