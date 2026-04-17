import type { AppNotification } from "@/shared/api/modules/notification.api";
import { Bell, CheckCheck, Heart, MessageCircle, MessageSquare, UserPlus, XCircle } from "lucide-react";
import { ROUTES } from "@/shared/lib/routes";

export const getNotificationHref = (notification: AppNotification) => {
  if (notification.reference?.type === "PROMPT") {
    return ROUTES.PROMPT(notification.reference.slug);
  }

  if (notification.reference?.type === "COMMENT") {
    return ROUTES.PROMPT(notification.reference.prompt.slug);
  }

  if (notification.reference?.type === "USER") {
    return ROUTES.PROFILE(notification.reference.slug);
  }

  if (notification.type === "FOLLOW" && notification.actor?.username) {
    return ROUTES.PROFILE(notification.actor.username);
  }

  return ROUTES.ACCOUNT_NOTIFICATIONS;
};

export const getNotificationIcon = (type: AppNotification["type"]) => {
  switch (type) {
    case "FOLLOW":
      return UserPlus;
    case "PROMPT_LIKE":
      return Heart;
    case "PROMPT_COMMENT":
      return MessageSquare;
    case "COMMENT_REPLY":
      return MessageCircle;
    case "PROMPT_APPROVED":
      return CheckCheck;
    case "PROMPT_REJECTED":
      return XCircle;
    case "SYSTEM":
    default:
      return Bell;
  }
};

export const getNotificationContext = (notification: AppNotification) => {
  if (notification.reference?.type === "PROMPT") {
    return notification.reference.title;
  }

  if (notification.reference?.type === "COMMENT") {
    return notification.reference.prompt.title;
  }

  if (notification.reference?.type === "USER") {
    return (
      notification.reference.profile?.displayName || notification.reference.username
    );
  }

  return null;
};

export const formatNotificationTime = (value: string) => {
  const date = new Date(value);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return "Just now";
  if (diffMs < hour) return `${Math.floor(diffMs / minute)}m ago`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`;
  if (diffMs < day * 7) return `${Math.floor(diffMs / day)}d ago`;

  return date.toLocaleDateString();
};
