"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useAppSelector } from "@/shared/redux/hooks";
import { appToast } from "@/shared/lib/toastify/toast";
import { ROUTES } from "@/shared/lib/routes";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "../hooks/use-notifications";
import { NotificationList } from "./notification-list";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isInitialized } = useAppSelector(
    (state) => state.auth,
  );
  const notificationsQuery = useNotifications(
    { page: 1, limit: 10 },
    {
      enabled: isAuthenticated,
      refetchInterval: isAuthenticated ? 30000 : false,
    },
  );
  const markOneRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  if (!isInitialized) {
    return null; // prevents hydration mismatch
  }

  if (!isAuthenticated) {
    return null;
  }

  const notifications = notificationsQuery.data?.data.data ?? [];
  const unreadCount = notificationsQuery.data?.data.unreadCount ?? 0;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 ? (
            <span className="absolute right-1.5 top-1.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" inPortal className="w-[380px] p-0 ml-2">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Notifications
            </p>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0
                ? `${unreadCount} unread update${unreadCount === 1 ? "" : "s"}`
                : "You are all caught up"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              disabled={unreadCount === 0 || markAllRead.isPending}
              onClick={async () => {
                try {
                  await markAllRead.mutateAsync();
                } catch (error: any) {
                  appToast.error(
                    error?.message || "Notifications could not be updated.",
                  );
                }
              }}
            >
              Mark all read
            </Button>
          </div>
        </div>

        <div className="p-4">
          <NotificationList
            compact
            notifications={notifications}
            isLoading={notificationsQuery.isLoading}
            emptyMessage="New activity like follows, likes, comments, and moderation updates will show up here."
            onNotificationClick={(notification) => {
              setOpen(false);
              if (!notification.isRead) {
                markOneRead.mutate(notification.id);
              }
            }}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
