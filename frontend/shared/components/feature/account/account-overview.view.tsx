"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Sparkles, TrendingUp, Users } from "lucide-react";
import {
  flattenInfiniteItems,
  useCurrentAuthUser,
  useCurrentUserProfile,
  useMyPrompts,
  useSavedPrompts,
} from "./hooks/use-account";
import { ROUTES } from "@/shared/lib/routes";
import { SocialConnectionsModal } from "./components/social-connections-modal";

const AccountOverviewPage = () => {
  const user = useCurrentAuthUser();
  const { data: profileResponse } = useCurrentUserProfile();
  const { data: myPromptsResponse, isLoading: isPromptsLoading } = useMyPrompts(
    {
      page: 1,
      limit: 3,
    },
  );
  const { data: savedPromptsResponse, isLoading: isSavedLoading } =
    useSavedPrompts({
      page: 1,
      limit: 3,
    });

  const profile = profileResponse?.data.user.profile ?? user?.profile ?? null;
  const profileUser = profileResponse?.data.user ?? user ?? null;
  const prompts = flattenInfiniteItems(myPromptsResponse?.pages);
  const favorites = flattenInfiniteItems(savedPromptsResponse?.pages);
  const recentPrompt = prompts[0];
  const recentFavorite = favorites[0]?.prompt;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Account Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Display name</p>
            <p className="mt-1 font-medium text-foreground">
              {profile?.displayName || user?.username || "PromptHub User"}
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="mt-1 font-medium text-foreground">
              {user?.email || "No email available"}
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="mt-1 font-medium text-foreground">
              {profile?.location || "Add your location in settings"}
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Website</p>
            <p className="mt-1 font-medium text-foreground">
              {profile?.website || "Add your portfolio or site in settings"}
            </p>
          </div>
          <Button asChild className="w-full">
            <Link href="/account/settings">Update Profile</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Recent Prompt Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isPromptsLoading || isSavedLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading your account activity...
            </p>
          ) : (
            <>
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Latest prompt
                    </p>
                    <p className="mt-1 font-medium text-foreground">
                      {recentPrompt?.title ||
                        "You have not published any prompts yet."}
                    </p>
                  </div>
                  {recentPrompt ? (
                    <Badge variant="secondary">{recentPrompt.status}</Badge>
                  ) : null}
                </div>
                {recentPrompt ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {recentPrompt.shortDescription ||
                      "No description added yet."}
                  </p>
                ) : null}
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground">
                  Latest saved prompt
                </p>
                <p className="mt-1 font-medium text-foreground">
                  {recentFavorite?.title ||
                    "You have not saved any prompts yet."}
                </p>
                {recentFavorite ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    by{" "}
                    <Link
                      href={ROUTES.PROFILE(recentFavorite.createdBy.slug)}
                      className="transition-colors hover:text-primary"
                    >
                      {recentFavorite.createdBy.profile?.displayName ||
                        recentFavorite.createdBy.username}
                    </Link>
                  </p>
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button asChild variant="outline">
                  <Link href="/account/my-prompts">Manage My Prompts</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/account/saved-prompts">View Saved</Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountOverviewPage;
