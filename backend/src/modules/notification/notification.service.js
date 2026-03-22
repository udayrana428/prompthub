import * as notifRepo from "./notification.repository.js";
import {
  getPaginationParams,
  buildPaginatedResponse,
} from "../../shared/utils/pagination.js";

export const getUserNotifications = async (userId, query) => {
  const { page, limit, skip } = getPaginationParams(query);
  const [notifications, total, unreadCount] = await Promise.all([
    notifRepo.getUserNotifications(userId, { skip, take: limit }),
    notifRepo.countNotifications(userId),
    notifRepo.countNotifications(userId, true),
  ]);

  return {
    ...buildPaginatedResponse(notifications, total, page, limit),
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
