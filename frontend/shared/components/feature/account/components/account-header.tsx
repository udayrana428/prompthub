"use client";

import { useState } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Calendar, Edit, MapPin, Star, Users } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  getInfiniteTotal,
  useCurrentAuthUser,
  useCurrentUserProfile,
  useSavedPrompts,
} from "../hooks/use-account";
import { ProfileEditModal } from "./profile-edit-modal";
import { SocialConnectionsModal } from "./social-connections-modal";

const AccountHeader = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [connectionsModal, setConnectionsModal] = useState<{
    open: boolean;
    tab: "followers" | "following";
  }>({ open: false, tab: "followers" });

  const user = useCurrentAuthUser();
  const { data: profileResponse, isLoading: isProfileLoading } =
    useCurrentUserProfile();
  const { data: favoritesResponse, isLoading: isFavoritesLoading } =
    useSavedPrompts({ page: 1, limit: 1 });
  const savedPromptsTotal = getInfiniteTotal(favoritesResponse?.pages);

  const profileUser = profileResponse?.data.user;
  const profile = profileUser?.profile ?? user?.profile ?? null;
  const displayName =
    profile?.displayName ||
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    "Account";
  const avatarFallback = displayName.charAt(0).toUpperCase() || "A";
  const joinedOn = profileUser?.createdOn || user?.createdOn;

  if (isProfileLoading && !profileUser && !user) {
    return (
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-72" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex flex-1 flex-col gap-6 sm:flex-row">
              <div className="flex flex-col items-center gap-3 sm:items-start">
                <Avatar className="mx-auto h-20 w-20 sm:mx-0">
                  <AvatarImage
                    src={profile?.avatarUrl || "/img/placeholder-user.jpg"}
                    alt={displayName}
                  />
                  <AvatarFallback className="text-2xl">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h1 className="mb-2 text-2xl font-bold text-foreground">
                  {displayName}
                </h1>
                <p className="mb-2 text-muted-foreground">@{user?.username}</p>
                <p className="mb-4 text-foreground">
                  {profile?.bio ||
                    "Build, save, and manage your AI prompts from one place."}
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground sm:justify-start">
                  {joinedOn ? (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {new Date(joinedOn).toLocaleDateString()}
                    </span>
                  ) : null}
                  {profile?.location ? (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </span>
                  ) : null}
                  {profile?.website ? (
                    <a
                      href={profile.website}
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {profile.website}
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-8 lg:grid-cols-5">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {profile?.promptCount ?? 0}
              </div>
              <div className="text-sm text-muted-foreground">
                Prompts Shared
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {isFavoritesLoading ? "..." : savedPromptsTotal}
              </div>
              <div className="text-sm text-muted-foreground">Prompts Saved</div>
            </div>

            <button
              type="button"
              className="text-center transition-opacity hover:opacity-70"
              onClick={() =>
                setConnectionsModal({ open: true, tab: "followers" })
              }
            >
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-foreground">
                <Users className="h-5 w-5 text-primary" />
                {profile?.followersCount ?? 0}
              </div>
              <div className="text-sm text-muted-foreground hover:underline underline-offset-2">
                Followers
              </div>
            </button>

            <button
              type="button"
              className="text-center transition-opacity hover:opacity-70"
              onClick={() =>
                setConnectionsModal({ open: true, tab: "following" })
              }
            >
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-foreground">
                <Users className="h-5 w-5 text-primary" />
                {profile?.followingCount ?? 0}
              </div>
              <div className="text-sm text-muted-foreground hover:underline underline-offset-2">
                Following
              </div>
            </button>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-foreground">
                <Star className="h-5 w-5 text-primary" />
                {profile?.reputationScore ?? 0}
              </div>
              <div className="text-sm text-muted-foreground">Reputation</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProfileEditModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />

      <SocialConnectionsModal
        open={connectionsModal.open}
        onOpenChange={(open) =>
          setConnectionsModal((current) => ({ ...current, open }))
        }
        userId={profileUser?.id}
        username={profileUser?.username}
        followersCount={profile?.followersCount ?? 0}
        followingCount={profile?.followingCount ?? 0}
        initialTab={connectionsModal.tab}
      />
    </>
  );
};

export default AccountHeader;
