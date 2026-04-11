import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Eye,
  Heart,
  MessageSquare,
  Star,
  Users,
} from "lucide-react";
import type { Pagination } from "@/shared/api/types";
import type { UserAccount, UserPrompt } from "@/shared/api/modules/user.api";
import { ROUTES } from "@/shared/lib/routes";
import { formatModelLabel } from "@/shared/lib/utils";
import { PublicProfileHero } from "./components/public-profile-hero";

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
  return (
    <div className="pb-12">
      <PublicProfileHero user={user} promptCount={prompts.length} />

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
                className="group overflow-hidden border-border bg-card p-0 transition-all duration-200 hover:shadow-lg h-full flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-black">
                  {prompt.imageUrl && (
                    <Image
                      src={prompt.imageUrl}
                      alt=""
                      fill
                      className="object-cover scale-110 blur-lg brightness-50 opacity-60"
                      aria-hidden
                    />
                  )}
                  <Image
                    src={prompt.imageUrl || "/placeholder.svg"}
                    alt={prompt.title}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="text-xs backdrop-blur-sm"
                    >
                      {prompt.category.name}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-background/90 text-xs backdrop-blur-sm"
                    >
                      {formatModelLabel(prompt.modelType)}
                    </Badge>
                    {prompt.featured ? (
                      <Badge
                        variant="default"
                        className="text-xs backdrop-blur-sm"
                      >
                        <Star className="mr-1 h-3 w-3" />
                        Featured
                      </Badge>
                    ) : null}
                  </div>
                </div>

                <CardContent className="p-3 flex flex-col flex-grow">
                  <Link href={`/prompts/${prompt.slug}`}>
                    <h3 className="mb-3 cursor-pointer font-semibold text-card-foreground transition-colors group-hover:text-primary line-clamp-2">
                      {prompt.title}
                    </h3>
                  </Link>

                  <p className="mb-4 line-clamp-3 text-sm text-muted-foreground flex-grow">
                    {prompt.shortDescription ||
                      "Curated prompt ready for your workflow."}
                  </p>

                  <div className="mt-auto">
                    <div className="mb-3 flex flex-wrap gap-1">
                      {prompt.tags.slice(0, 3).map(({ tag }) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="text-xs"
                        >
                          #{tag.name}
                        </Badge>
                      ))}
                      {prompt.tags.length > 3 ? (
                        <Badge variant="outline" className="text-xs">
                          +{prompt.tags.length - 3}
                        </Badge>
                      ) : null}
                    </div>

                    <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {prompt.viewsCount.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {prompt.likesCount.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {prompt.commentsCount.toLocaleString()}
                        </span>
                      </div>
                      {/* <Link
                        href={ROUTES.PROFILE(prompt.createdBy.slug)}
                        className="transition-colors hover:text-primary"
                      >
                        by{" "}
                        {prompt.createdBy.profile?.displayName ||
                          prompt.createdBy.username}
                      </Link> */}
                    </div>

                    <Button asChild size="sm" className="w-full">
                      <Link href={ROUTES.PROMPT(prompt.slug)}>Open Prompt</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
