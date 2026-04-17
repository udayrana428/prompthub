import * as notifRepo from "./notification.repository.js";
import {
  getPaginationParams,
  buildPaginatedResponse,
} from "../../shared/utils/pagination.js";
import prisma from "../../db/index.js";

const buildNotificationMessage = (notification) => {
  if (notification.message) return notification.message;

  const actorName =
    notification.actor?.profile?.displayName ||
    notification.actor?.username ||
    "Someone";

  switch (notification.type) {
    case "FOLLOW":
      return `${actorName} started following you.`;
    case "PROMPT_LIKE":
      return `${actorName} liked your prompt.`;
    case "PROMPT_COMMENT":
      return `${actorName} commented on your prompt.`;
    case "COMMENT_REPLY":
      return `${actorName} replied to your comment.`;
    case "PROMPT_APPROVED":
      return "Your prompt was approved and is now live.";
    case "PROMPT_REJECTED":
      return "Your prompt was rejected during moderation.";
    case "SYSTEM":
    default:
      return "You have a new notification.";
  }
};

const enrichNotifications = async (notifications) => {
  if (!notifications.length) return notifications;

  const promptIds = [
    ...new Set(
      notifications
        .filter((notification) => notification.referenceType === "PROMPT")
        .map((notification) => notification.referenceId)
        .filter(Boolean),
    ),
  ];

  const commentIds = [
    ...new Set(
      notifications
        .filter((notification) => notification.referenceType === "COMMENT")
        .map((notification) => notification.referenceId)
        .filter(Boolean),
    ),
  ];

  const userIds = [
    ...new Set(
      notifications
        .filter((notification) => notification.referenceType === "USER")
        .map((notification) => notification.referenceId)
        .filter(Boolean),
    ),
  ];

  const [prompts, comments, users] = await Promise.all([
    promptIds.length
      ? prisma.prompt.findMany({
          where: { id: { in: promptIds }, deletedOn: null },
          select: { id: true, slug: true, title: true },
        })
      : Promise.resolve([]),
    commentIds.length
      ? prisma.promptComment.findMany({
          where: { id: { in: commentIds }, deletedOn: null },
          select: {
            id: true,
            content: true,
            prompt: {
              select: {
                id: true,
                slug: true,
                title: true,
              },
            },
          },
        })
      : Promise.resolve([]),
    userIds.length
      ? prisma.user.findMany({
          where: { id: { in: userIds }, deletedOn: null },
          select: {
            id: true,
            username: true,
            slug: true,
            profile: {
              select: {
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        })
      : Promise.resolve([]),
  ]);

  const promptMap = new Map(prompts.map((prompt) => [prompt.id, prompt]));
  const commentMap = new Map(comments.map((comment) => [comment.id, comment]));
  const userMap = new Map(users.map((user) => [user.id, user]));

  return notifications.map((notification) => {
    let reference = null;

    if (notification.referenceType === "PROMPT" && notification.referenceId) {
      const prompt = promptMap.get(notification.referenceId);
      if (prompt) {
        reference = {
          type: "PROMPT",
          id: prompt.id,
          slug: prompt.slug,
          title: prompt.title,
        };
      }
    }

    if (notification.referenceType === "COMMENT" && notification.referenceId) {
      const comment = commentMap.get(notification.referenceId);
      if (comment) {
        reference = {
          type: "COMMENT",
          id: comment.id,
          content: comment.content,
          prompt: comment.prompt,
        };
      }
    }

    if (notification.referenceType === "USER" && notification.referenceId) {
      const user = userMap.get(notification.referenceId);
      if (user) {
        reference = {
          type: "USER",
          id: user.id,
          username: user.username,
          slug: user.slug,
          profile: user.profile,
        };
      }
    }

    return {
      ...notification,
      reference,
      displayMessage: buildNotificationMessage(notification),
    };
  });
};

export const getUserNotifications = async (userId, query) => {
  const { page, limit, skip } = getPaginationParams(query);
  const [notifications, total, unreadCount] = await Promise.all([
    notifRepo.getUserNotifications(userId, { skip, take: limit }),
    notifRepo.countNotifications(userId),
    notifRepo.countNotifications(userId, true),
  ]);

  const enrichedNotifications = await enrichNotifications(notifications);

  return {
    ...buildPaginatedResponse(enrichedNotifications, total, page, limit),
    unreadCount,
  };
};

export const markAllRead = (userId) => notifRepo.markAllRead(userId);
export const markOneRead = (id, userId) => notifRepo.markOneRead(id, userId);

/**
 * Central notification dispatch — call from other services
 */
export const notify = (data) => {
  // Don't notify yourself
  if (data.userId === data.actorId) return Promise.resolve();
  return notifRepo.createNotification(data);
};
