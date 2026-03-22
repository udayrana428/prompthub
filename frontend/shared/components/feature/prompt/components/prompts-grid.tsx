import Link from "next/link";
import Image from "next/image";
import { Eye, Heart, MessageSquare } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import type { Pagination } from "@/shared/api/types";
import { ROUTES } from "@/shared/lib/routes";
import { formatModelLabel } from "@/shared/lib/utils";
import type { Prompt } from "../types";

export function PromptsGrid({
  prompts,
  pagination,
  isLoading,
  isError,
}: {
  prompts: Prompt[];
  pagination?: Pagination;
  isLoading: boolean;
  isError: boolean;
}) {
  if (isLoading) return <div>Loading prompts...</div>;
  if (isError) return <div>Failed to load prompts.</div>;
  if (prompts.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No prompts matched these filters.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {prompts.map((prompt) => (
          <Card
            key={prompt.id}
            className="group overflow-hidden border-border bg-card p-0 transition-all duration-200 hover:shadow-lg"
          >
            <div className="relative aspect-[3/2] overflow-hidden">
              <Image
                src={prompt.imageUrl || "/placeholder.svg"}
                alt={prompt.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-xs backdrop-blur-sm">
                  {prompt.category.name}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-background/90 text-xs backdrop-blur-sm"
                >
                  {formatModelLabel(prompt.modelType)}
                </Badge>
              </div>
            </div>

            <CardContent className="p-6">
              <Link href={`/prompts/${prompt.slug}`}>
                <h3 className="mb-3 cursor-pointer font-semibold text-card-foreground transition-colors group-hover:text-primary">
                  {prompt.title}
                </h3>
              </Link>

              <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                {prompt.shortDescription ||
                  "Curated prompt ready for your workflow."}
              </p>

              <div className="mb-4 flex flex-wrap gap-1">
                {prompt.tags.slice(0, 3).map(({ tag }) => (
                  <Badge key={tag.id} variant="outline" className="text-xs">
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
                <Link
                  href={ROUTES.PROFILE(prompt.createdBy.slug)}
                  className="transition-colors hover:text-primary"
                >
                  by{" "}
                  {prompt.createdBy.profile?.displayName ||
                    prompt.createdBy.username}
                </Link>
              </div>

              <Button asChild size="sm" className="w-full">
                <Link href={ROUTES.PROMPT(prompt.slug)}>Open Prompt</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {pagination ? (
        <div className="pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {Math.max(pagination.totalPages, 1)} ·{" "}
            {pagination.total} total prompts
          </p>
        </div>
      ) : null}
    </div>
  );
}
