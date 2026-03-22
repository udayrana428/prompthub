// src/shared/services/moderation.service.js

// ── Layer 1: Static blocklist ─────────────────────────────────────────────────
const BLOCKED_PATTERNS = [
  /\b(nsfw|nude|naked|porn|xxx|sexual|erotic|hentai|onlyfans)\b/i,
  /\b(hack|exploit|malware|phish|ddos|inject)\b/i,
  /\b(racist|slur — add your own list)\b/i,
];

const BLOCKED_TAG_PATTERNS = [
  /\b(nsfw|nude|sex|porn|xxx|erotic|naked)\b/i,
  /\b(hack|malware|exploit)\b/i,
];

export const screenText = (text) => {
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(text)) {
      return {
        flagged: true,
        reason: "Content contains prohibited terms.",
      };
    }
  }
  return { flagged: false };
};

export const screenTag = (tagName) => {
  for (const pattern of BLOCKED_TAG_PATTERNS) {
    if (pattern.test(tagName)) {
      return { blocked: true, reason: "Tag name contains prohibited terms." };
    }
  }
  return { blocked: false };
};

// ── Layer 2: OpenAI Moderation API (free, fast) ───────────────────────────────
export const runAIModeration = async (text) => {
  if (!process.env.OPENAI_API_KEY) {
    // No key configured — skip AI, go straight to manual review
    return { flagged: false, score: 0.5, skipped: true };
  }

  const response = await fetch("https://api.openai.com/v1/moderations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ input: text }),
  });

  if (!response.ok) {
    // THROW — do not catch — BullMQ needs this to trigger retry
    throw new Error(`OpenAI moderation API returned ${response.status}`);
  }

  const data = await response.json();
  const result = data.results?.[0];

  if (!result)
    throw new Error("Unexpected response shape from OpenAI moderation API");

  return {
    flagged: result.flagged,
    score: Math.max(...Object.values(result.category_scores ?? {})),
    categories: result.categories,
  };
};
