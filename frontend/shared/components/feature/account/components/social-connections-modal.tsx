"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { Users } from "lucide-react";
import { useFollowers, useFollowing } from "@/shared/hooks/use-social";
import { ROUTES } from "@/shared/lib/routes";

type ConnectionTab = "followers" | "following";

export function SocialConnectionsModal({
  open,
  onOpenChange,
  userId,
  username,
  followersCount,
  followingCount,
  initialTab = "followers",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
  username?: string;
  followersCount: number;
  followingCount: number;
  initialTab?: ConnectionTab;
}) {
  const [activeTab, setActiveTab] = useState<ConnectionTab>(initialTab);
  const [followersPage, setFollowersPage] = useState(1);
  const [followingPage, setFollowingPage] = useState(1);

  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
      setFollowersPage(1);
      setFollowingPage(1);
    }
  }, [initialTab, open]);

  const followersQuery = useFollowers(
    userId,
    { page: followersPage, limit: 20 },
    open && activeTab === "followers",
  );
  const followingQuery = useFollowing(
    userId,
    { page: followingPage, limit: 20 },
    open && activeTab === "following",
  );

  const currentQuery =
    activeTab === "followers" ? followersQuery : followingQuery;
  const connections = currentQuery.data?.data.data ?? [];
  const pagination = currentQuery.data?.data.pagination;

  const handleTabChange = (value: string) => {
    setActiveTab(value as ConnectionTab);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Connections</DialogTitle>
          <DialogDescription>
            View the people connected with @{username || "account"}.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="followers">
              Followers
              <Badge variant="secondary" className="ml-2">
                {followersCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="following">
              Following
              <Badge variant="secondary" className="ml-2">
                {followingCount}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="followers" className="mt-4">
            <ConnectionsList
              isLoading={followersQuery.isLoading}
              connections={activeTab === "followers" ? connections : []}
              onOpenChange={onOpenChange}
            />
          </TabsContent>

          <TabsContent value="following" className="mt-4">
            <ConnectionsList
              isLoading={followingQuery.isLoading}
              connections={activeTab === "following" ? connections : []}
              onOpenChange={onOpenChange}
            />
          </TabsContent>
        </Tabs>

        {pagination && pagination.totalPages > 1 ? (
          <div className="flex items-center justify-between border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!pagination.hasPrevPage}
                onClick={() =>
                  activeTab === "followers"
                    ? setFollowersPage((page) => Math.max(1, page - 1))
                    : setFollowingPage((page) => Math.max(1, page - 1))
                }
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!pagination.hasNextPage}
                onClick={() =>
                  activeTab === "followers"
                    ? setFollowersPage((page) => page + 1)
                    : setFollowingPage((page) => page + 1)
                }
              >
                Next
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function ConnectionsList({
  isLoading,
  connections,
  onOpenChange,
}: {
  isLoading: boolean;
  connections: Array<{
    id: string;
    user: {
      id: string;
      username: string;
      slug: string;
      profile: {
        displayName: string | null;
        avatarUrl: string | null;
      } | null;
    };
  }>;
  onOpenChange: (open: boolean) => void;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-lg border border-border p-3"
          >
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border px-6 py-12 text-center">
        <Users className="mb-3 h-10 w-10 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">
          No connections to show yet.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          This list will populate as your social graph grows.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="max-h-[420px] pr-4">
      <div className="space-y-3">
        {connections.map((connection) => {
          const displayName =
            connection.user.profile?.displayName || connection.user.username;
          const avatarFallback = displayName.charAt(0).toUpperCase() || "P";

          return (
            <Link
              key={connection.id}
              href={ROUTES.PROFILE(connection.user.slug)}
              className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
              onClick={() => onOpenChange(false)}
            >
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={connection.user.profile?.avatarUrl || "/placeholder.svg"}
                  alt={displayName}
                />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">
                  {displayName}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  @{connection.user.username}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </ScrollArea>
  );
}
