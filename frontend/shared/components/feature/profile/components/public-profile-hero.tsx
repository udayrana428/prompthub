"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Calendar, Globe, MapPin, Sparkles, Star, Users } from "lucide-react";
import type { UserAccount } from "@/shared/api/modules/user.api";
import { ROUTES } from "@/shared/lib/routes";
import { appToast } from "@/shared/lib/toastify/toast";
import { useToggleFollowUser } from "@/shared/hooks/use-social";
import { useAppSelector } from "@/shared/redux/hooks";

export function PublicProfileHero({ user }: { user: UserAccount }) {
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.auth.user);
  const toggleFollow = useToggleFollowUser();
  const profile = user.profile;
  const displayName =
    profile?.displayName || profile?.firstName || user.username;
  const initials = displayName.trim().charAt(0).toUpperCase() || "P";
  const isOwnProfile = user.isOwnedByViewer || currentUser?.id === user.id;
  const [isFollowing, setIsFollowing] = useState(
    user.isFollowedByViewer ?? false,
  );
  const [followersCount, setFollowersCount] = useState(
    profile?.followersCount ?? 0,
  );

  useEffect(() => {
    setIsFollowing(user.isFollowedByViewer ?? false);
    setFollowersCount(profile?.followersCount ?? 0);
  }, [profile?.followersCount, user.isFollowedByViewer]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      appToast.info("Sign in to follow creators.");
      router.push(ROUTES.LOGIN);
      return;
    }

    if (isOwnProfile) {
      return;
    }

    const nextIsFollowing = !isFollowing;
    setIsFollowing(nextIsFollowing);
    setFollowersCount((current) =>
      Math.max(0, current + (nextIsFollowing ? 1 : -1)),
    );

    try {
      await toggleFollow.mutateAsync({
        userId: user.id,
        isFollowing,
      });
      // appToast.success(
      //   nextIsFollowing
      //     ? `You are now following ${displayName}.`
      //     : `You unfollowed ${displayName}.`,
      // );
    } catch (err: any) {
      setIsFollowing(isFollowing);
      setFollowersCount(profile?.followersCount ?? 0);

      if (err?.errors?.length > 0) {
        err?.errors[0]?.message && appToast.error(err?.errors[0]?.message);
      } else if (err?.message) {
        appToast.error(err.message);
      } else {
        appToast.error("We could not update the follow state.");
      }
    }
  };

  return (
    <section className="relative border-b border-border">
      <div className="relative h-48 bg-gradient-to-br from-primary/20 via-background to-muted sm:h-60">
        {profile?.coverImageUrl ? (
          <Image
            src={profile.coverImageUrl}
            alt={`${displayName}'s cover image`}
            fill
            className="object-cover"
            priority
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mt-14 pb-8 sm:-mt-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              <Avatar className="h-28 w-28 border-4 border-background shadow-lg sm:h-32 sm:w-32">
                <AvatarImage
                  src={profile?.avatarUrl || "/img/placeholder-user.jpg"}
                  alt={displayName}
                />
                <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
              </Avatar>

              <div className="space-y-3">
                <div>
                  <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                    {displayName}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    @{user.username}
                  </p>
                </div>

                {profile?.bio ? (
                  <p className="max-w-2xl text-sm leading-6 text-foreground/90 sm:text-base">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                    This creator has not added a public bio yet.
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(user.createdOn).toLocaleDateString()}
                  </span>
                  {profile?.location ? (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </span>
                  ) : null}
                  {profile?.website ? (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-primary hover:underline"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="px-3 py-1.5 text-sm">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Public Creator
              </Badge>
              {!isOwnProfile ? (
                <Button
                  type="button"
                  variant={isFollowing ? "outline" : "default"}
                  onClick={() => void handleFollowToggle()}
                  disabled={toggleFollow.isPending}
                >
                  {toggleFollow.isPending
                    ? "Updating..."
                    : isFollowing
                      ? "Following"
                      : "Follow"}
                </Button>
              ) : null}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Card className="py-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">
                  {(profile?.promptCount || 0).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">
                  Published Prompts
                </p>
              </CardContent>
            </Card>
            <Card className="py-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">
                  {followersCount.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Followers</p>
              </CardContent>
            </Card>
            <Card className="py-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">
                  {(profile?.followingCount || 0).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Following</p>
              </CardContent>
            </Card>
            <Card className="py-0">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold text-foreground">
                  <Star className="h-5 w-5 text-primary" />
                  {(profile?.reputationScore || 0).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Reputation</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
