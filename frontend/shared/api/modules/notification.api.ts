import type { ApiResponse, PaginatedData } from "../types";
import apiClient from "../client";

export interface NotificationActor {
  id: string;
  username: string;
  profile: {
    displayName: string | null;
    avatarUrl: string | null;
  } | null;
}

export type NotificationReference =
  | {
      type: "PROMPT";
      id: string;
      slug: string;
      title: string;
    }
  | {
      type: "COMMENT";
      id: string;
      content: string;
      prompt: {
        id: string;
        slug: string;
        title: string;
      };
    }
  | {
      type: "USER";
      id: string;
      username: string;
      slug: string;
      profile: {
        displayName: string | null;
        avatarUrl: string | null;
      } | null;
    }
  | null;

export interface AppNotification {
  id: string;
  type:
    | "FOLLOW"
    | "PROMPT_LIKE"
    | "PROMPT_COMMENT"
    | "COMMENT_REPLY"
    | "PROMPT_APPROVED"
    | "PROMPT_REJECTED"
    | "SYSTEM";
  referenceId: string | null;
  referenceType: "PROMPT" | "COMMENT" | "USER" | null;
  message: string | null;
  displayMessage: string;
  isRead: boolean;
  readAt: string | null;
  createdOn: string;
  actor: NotificationActor | null;
  reference: NotificationReference;
}

export type NotificationsListResponse = ApiResponse<
  PaginatedData<AppNotification> & { unreadCount: number }
>;

export const getMyNotifications = (
  params?: { page?: number; limit?: number },
): Promise<NotificationsListResponse> =>
  apiClient.get("/notifications", { params });

export const markNotificationRead = (
  id: string,
): Promise<ApiResponse<null>> => apiClient.patch(`/notifications/${id}/read`);

export const markAllNotificationsRead = (): Promise<ApiResponse<null>> =>
  apiClient.patch("/notifications/read-all");
