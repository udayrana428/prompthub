import Link from "next/link";
import Image from "next/image";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Calendar, Globe, MapPin, Sparkles, Star, Users } from "lucide-react";
import type { Pagination } from "@/shared/api/types";
import type { UserAccount, UserPrompt } from "@/shared/api/modules/user.api";
import { ROUTES } from "@/shared/lib/routes";
import { formatModelLabel } from "@/shared/lib/utils";

interface PublicProfileProps {
  user: UserAccount;
  prompts: UserPrompt[];
  pagination?: Pagination;
}

export function PublicProfilePage({
  user,
  prompts,
  pagination,
}: PublicProfileProps) {
  const profile = user.profile;
  const displayName =
    profile?.displayName || profile?.firstName || user.username;
  const initials = displayName.trim().charAt(0).toUpperCase() || "P";

  return (
    <div className="pb-12">
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
                    src={profile?.avatarUrl || "/placeholder.svg"}
                    alt={displayName}
                  />
                  <AvatarFallback className="text-3xl">
                    {initials}
                  </AvatarFallback>
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
                <Button asChild variant="outline">
                  <Link href={`${ROUTES.PROMPTS}?search=${encodeURIComponent(user.username)}`}>
                    Browse Prompts
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {(profile?.promptCount || prompts.length).toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Published Prompts
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {(profile?.followersCount || 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {(profile?.followingCount || 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Following</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {(profile?.reputationScore || 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Reputation</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Public Prompts
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Published prompts from this creator available across PromptHub.
            </p>
          </div>
          {pagination ? (
            <Badge variant="outline" className="px-3 py-1.5 text-xs">
              {pagination.total.toLocaleString()} total
            </Badge>
          ) : null}
        </div>

        {prompts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="mb-4 h-10 w-10 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground">
                No public prompts yet
              </h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                This creator has not published any approved prompts yet. Check
                back soon for new work.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {prompts.map((prompt) => (
              <Card
                key={prompt.id}
                className="overflow-hidden border-border bg-card transition-all duration-200 hover:shadow-lg"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <Image
                    src={prompt.imageUrl || "/placeholder.svg"}
                    alt={prompt.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="space-y-4 p-5">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{prompt.category.name}</Badge>
                    <Badge variant="outline">
                      {formatModelLabel(prompt.modelType)}
                    </Badge>
                    {prompt.featured ? (
                      <Badge variant="default">
                        <Star className="mr-1 h-3 w-3" />
                        Featured
                      </Badge>
                    ) : null}
                  </div>

                  <div>
                    <Link
                      href={ROUTES.PROMPT(prompt.slug)}
                      className="text-lg font-semibold text-card-foreground transition-colors hover:text-primary"
                    >
                      {prompt.title}
                    </Link>
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                      {prompt.shortDescription ||
                        "Curated prompt ready for your workflow."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {prompt.tags.slice(0, 3).map(({ tag }) => (
                      <Badge key={tag.id} variant="outline" className="text-xs">
                        #{tag.name}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{prompt.likesCount.toLocaleString()} likes</span>
                    <span>{prompt.viewsCount.toLocaleString()} views</span>
                    <span>{prompt.commentsCount.toLocaleString()} comments</span>
                  </div>

                  <Button asChild className="w-full" size="sm">
                    <Link href={ROUTES.PROMPT(prompt.slug)}>Open Prompt</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
