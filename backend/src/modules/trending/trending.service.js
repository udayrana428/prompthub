import * as trendingRepo from "./trending.repository.js";

/**
 * Weighted trending score formula:
 *   score = views*0.3 + likes*0.4 + comments*0.2 + favorites*0.1
 *   Recency boost: divide by log2(hoursOld + 2) so newer prompts rank higher
 */
const calculateScore = (prompt, windowHours) => {
  const raw =
    prompt.viewsCount * 0.3 +
    prompt.likesCount * 0.4 +
    prompt.commentsCount * 0.2 +
    prompt.favoritesCount * 0.1;

  // Recency decay based on window age (normalize to hours)
  const decay = Math.log2(windowHours + 2);
  return raw / decay;
};

export const getTrending = async (windowType = "DAILY", limit = 20) => {
  return trendingRepo.getTopPromptsByWindow(windowType, limit);
};

export const computeAndSaveSnapshots = async (windowType) => {
  const windowHoursMap = { DAILY: 24, WEEKLY: 168, MONTHLY: 720 };
  const daysMap = { DAILY: 1, WEEKLY: 7, MONTHLY: 30 };

  const since = new Date();
  since.setDate(since.getDate() - daysMap[windowType]);

  const prompts = await trendingRepo.getApprovedPromptsForSnapshot(since);

  const scored = prompts
    .map((p) => ({
      ...p,
      score: calculateScore(p, windowHoursMap[windowType]),
    }))
    .sort((a, b) => b.score - a.score);

  const snapshotDate = new Date();
  snapshotDate.setHours(0, 0, 0, 0);

  const upserts = scored.map((p, index) =>
    trendingRepo.upsertSnapshot({
      promptId: p.id,
      snapshotDate,
      windowType,
      score: p.score,
      rank: index + 1,
      viewsCount: p.viewsCount,
      likesCount: p.likesCount,
      commentsCount: p.commentsCount,
      favoritesCount: p.favoritesCount,
    }),
  );

  await Promise.allSettled(upserts);
  return scored.length;
};
