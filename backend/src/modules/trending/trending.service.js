import * as trendingRepo from "./trending.repository.js";

const WINDOW_HOURS = { DAILY: 24, WEEKLY: 168, MONTHLY: 720 };

const getWindowStart = (windowType) => {
  const since = new Date();
  since.setTime(since.getTime() - WINDOW_HOURS[windowType] * 60 * 60 * 1000);
  return since;
};

/**
 * Score uses windowed counts (not lifetime totals).
 * Weights: views are low-signal, likes/favorites are high-signal.
 * No time-decay here — the window itself IS the decay mechanism.
 * A prompt only appears if it had activity in this window.
 */
const calculateScore = ({
  viewsCount,
  likesCount,
  commentsCount,
  favoritesCount,
}) =>
  viewsCount * 0.3 +
  likesCount * 1.5 +
  commentsCount * 1.0 +
  favoritesCount * 1.2;

export const getTrending = async (
  windowType = "DAILY",
  limit = 20,
  viewerId = null,
) => {
  return trendingRepo.getTopPromptsByWindow(windowType, limit, viewerId);
};

export const computeAndSaveSnapshots = async (windowType) => {
  const since = getWindowStart(windowType);

  // Get windowed activity counts (the fix — not lifetime counters)
  const activityMap =
    await trendingRepo.getWindowedActivityForAllPrompts(since);

  if (activityMap.size === 0) return 0;

  // Score and rank
  const scored = [...activityMap.entries()]
    .map(([promptId, counts]) => ({
      promptId,
      ...counts,
      score: calculateScore(counts),
    }))
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score);

  // Always UTC midnight — no local timezone drift
  const now = new Date();
  const snapshotDate = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );

  const upserts = scored.map((p, index) =>
    trendingRepo.upsertSnapshot({
      promptId: p.promptId,
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
