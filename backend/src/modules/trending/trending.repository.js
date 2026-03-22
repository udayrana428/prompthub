import prisma from "../../db/index.js";

export const getTopPromptsByWindow = (windowType, limit = 20) =>
  prisma.promptTrendingSnapshot.findMany({
    where: {
      windowType,
      snapshotDate: {
        gte: getWindowStart(windowType),
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
  });

const getWindowStart = (windowType) => {
  const now = new Date();
  if (windowType === "DAILY") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  if (windowType === "WEEKLY") {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return d;
  }
  const d = new Date(now);
  d.setDate(d.getDate() - 30);
  return d;
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

export const getApprovedPromptsForSnapshot = (since) =>
  prisma.prompt.findMany({
    where: {
      status: "APPROVED",
      deletedOn: null,
      createdOn: { gte: since },
    },
    select: {
      id: true,
      viewsCount: true,
      likesCount: true,
      commentsCount: true,
      favoritesCount: true,
    },
  });
