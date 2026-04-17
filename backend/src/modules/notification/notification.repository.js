import prisma from "../../db/index.js";

export const createNotification = (data) =>
  prisma.notification.create({ data });

export const getUserNotifications = (userId, { skip, take }) =>
  prisma.notification.findMany({
    where: { userId, isRead: false, deletedOn: null },
    orderBy: { createdOn: "desc" },
    skip,
    take,
    include: {
      actor: {
        select: {
          id: true,
          username: true,
          profile: { select: { displayName: true, avatarUrl: true } },
        },
      },
    },
  });

export const countNotifications = (userId, unreadOnly = false) =>
  prisma.notification.count({
    where: { userId, deletedOn: null, ...(unreadOnly && { isRead: false }) },
  });

export const markAllRead = (userId) =>
  prisma.notification.updateMany({
    where: { userId, isRead: false, deletedOn: null },
    data: { isRead: true, readAt: new Date() },
  });

export const markOneRead = (id, userId) =>
  prisma.notification.updateMany({
    where: { id, userId, deletedOn: null },
    data: { isRead: true, readAt: new Date() },
  });
