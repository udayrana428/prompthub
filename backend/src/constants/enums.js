export const ROLE_HIERARCHY = Object.freeze({
  SUPER_ADMIN: 100,
  ADMIN: 60,
  MODERATOR: 30,
  USER: 10,
});

export const UserStatus = Object.freeze({
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  BANNED: "BANNED",
  LOCKED: "LOCKED",
});

export const LoginType = Object.freeze({
  EMAIL: "EMAIL",
  GOOGLE: "GOOGLE",
  GITHUB: "GITHUB",
});

export const PromptStatus = Object.freeze({
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  ARCHIVED: "ARCHIVED",
});

export const AIModelType = Object.freeze({
  DALL_E: "DALL_E",
  STABLE_DIFFUSION: "STABLE_DIFFUSION",
  MIDJOURNEY: "MIDJOURNEY",
  GEMINI: "GEMINI",
  OTHER: "OTHER",
});

export const NotificationType = Object.freeze({
  FOLLOW: "FOLLOW",
  PROMPT_LIKE: "PROMPT_LIKE",
  PROMPT_COMMENT: "PROMPT_COMMENT",
  COMMENT_REPLY: "COMMENT_REPLY",
  PROMPT_APPROVED: "PROMPT_APPROVED",
  PROMPT_REJECTED: "PROMPT_REJECTED",
  SYSTEM: "SYSTEM",
});

export const TrendingWindowType = Object.freeze({
  DAILY: "DAILY",
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
});

export const CommentStatus = Object.freeze({
  VISIBLE: "VISIBLE",
  HIDDEN: "HIDDEN",
  DELETED: "DELETED",
});
