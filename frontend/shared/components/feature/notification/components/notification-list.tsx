"use client";

import { useRouter } from "next/navigation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { AppNotification } from "@/shared/api/modules/notification.api";
import {
  formatNotificationTime,
  getNotificationContext,
  getNotificationHref,
  getNotificationIcon,
} from "../notification-utils";

export function NotificationList({
  notifications,
  isLoading,
  emptyMessage,
  compact = false,
  onNotificationClick,
}: {
  notifications: AppNotification[];
  isLoading: boolean;
  emptyMessage: string;
  compact?: boolean;
  onNotificationClick?: (notification: AppNotification) => void;
}) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: compact ? 4 : 6 }).map((_, index) => (
          <div
            key={index}
            className="flex items-start gap-3 rounded-lg border border-border p-3"
          >
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center">
        <p className="text-sm font-medium text-foreground">All caught up</p>
        <p className="mt-1 text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  const content = (
    <div className="space-y-3">
      {notifications.map((notification) => {
        const Icon = getNotificationIcon(notification.type);
        const actorName =
          notification.actor?.profile?.displayName ||
          notification.actor?.username ||
          "PromptHub";
        const avatarFallback = actorName.charAt(0).toUpperCase() || "P";
        const context = getNotificationContext(notification);

        return (
          <button
            key={notification.id}
            type="button"
            className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 ${
              notification.isRead
                ? "border-border bg-card"
                : "border-primary/30 bg-primary/5"
            }`}
            onClick={() => {
              onNotificationClick?.(notification);
              router.push(getNotificationHref(notification));
            }}
          >
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={
                    notification.actor?.profile?.avatarUrl || "/placeholder.svg"
                  }
                  alt={actorName}
                />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-1 -right-1 rounded-full border border-background bg-background p-1 shadow-sm">
                <Icon className="h-3 w-3 text-primary" />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-foreground">
                  {notification.displayMessage}
                </p>
                {!notification.isRead ? (
                  <Badge variant="secondary" className="shrink-0 text-[10px]">
                    New
                  </Badge>
                ) : null}
              </div>

              {context ? (
                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                  {context}
                </p>
              ) : null}

              <p className="mt-2 text-xs text-muted-foreground">
                {formatNotificationTime(notification.createdOn)}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );

  if (compact) {
    return <ScrollArea className="h-[360px] pr-4">{content}</ScrollArea>;
  }

  return content;
}

export function NotificationPagination({
  page,
  totalPages,
  hasPrevPage,
  hasNextPage,
  onPrevious,
  onNext,
}: {
  page: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-t border-border pt-4">
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasPrevPage}
          onClick={onPrevious}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasNextPage}
          onClick={onNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
