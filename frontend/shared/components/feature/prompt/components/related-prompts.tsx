"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Heart } from "lucide-react";
import { usePrompts } from "../hooks/use-prompts";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import type { Prompt } from "../types";
import { formatModelLabel } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/lib/routes";

interface RelatedPromptsProps {
  currentPromptId: string;
  currentPromptSlug: string;
  categorySlug: string;
  categoryName: string;
}

export function RelatedPrompts({
  currentPromptId,
  currentPromptSlug,
  categorySlug,
  categoryName,
}: RelatedPromptsProps) {
  const { data } = usePrompts({
    category: categorySlug,
    limit: 4,
    page: 1,
    sortBy: "popular",
  });

  const relatedPrompts =
    data?.pages[0]?.data.data.filter(
      (prompt: Prompt) =>
        prompt.id !== currentPromptId && prompt.slug !== currentPromptSlug,
    ) ?? [];

  if (relatedPrompts.length === 0) return null;

  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-2xl font-bold text-foreground lg:text-3xl">
            Related {categoryName} Prompts
          </h2>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {relatedPrompts.map((prompt) => (
              // <Card
              //   key={prompt.id}
              //   className="group overflow-hidden border-border bg-card transition-all duration-200 hover:shadow-lg"
              // >
              //   <div className="relative aspect-square overflow-hidden bg-black">
              //     {prompt.imageUrl && (
              //       <Image
              //         src={prompt.imageUrl}
              //         alt=""
              //         fill
              //         className="object-cover scale-110 blur-lg brightness-50 opacity-60"
              //         aria-hidden
              //       />
              //     )}
              //     <Image
              //       src={prompt.imageUrl || "/img/placeholder.svg"}
              //       alt={prompt.title}
              //       fill
              //       className="object-contain transition-transform duration-300 group-hover:scale-105"
              //     />
              //     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              //     <div className="absolute left-3 top-3">
              //       <Badge
              //         variant="secondary"
              //         className="text-xs backdrop-blur-sm"
              //       >
              //         {prompt.category.name}
              //       </Badge>
              //     </div>
              //   </div>

              //   <CardContent className="p-6">
              //     <Link href={`/prompts/${prompt.slug}`}>
              //       <h3 className="mb-3 cursor-pointer font-semibold text-card-foreground transition-colors group-hover:text-primary">
              //         {prompt.title}
              //       </h3>
              //     </Link>

              //     <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
              //       {prompt.shortDescription ||
              //         "Explore another relevant prompt from this category."}
              //     </p>

              //     <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
              //       <span>{formatModelLabel(prompt.modelType)}</span>
              //       <div className="flex items-center gap-3">
              //         <span className="flex items-center gap-1">
              //           <Eye className="h-3 w-3" />
              //           {prompt.viewsCount.toLocaleString()}
              //         </span>
              //         <span className="flex items-center gap-1">
              //           <Heart className="h-3 w-3" />
              //           {prompt.likesCount.toLocaleString()}
              //         </span>
              //       </div>
              //     </div>

              //     <Button asChild size="sm" className="w-full">
              //       <Link href={`/prompts/${prompt.slug}`}>Open Prompt</Link>
              //     </Button>
              //   </CardContent>
              // </Card>
              <Card
                key={prompt.id}
                className="group overflow-hidden rounded-none border-0 bg-card p-0 transition-all duration-200 hover:shadow-lg"
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
                    src={prompt.imageUrl || "/img/placeholder.svg"}
                    alt={prompt.title}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-110 group-hover:brightness-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute left-3 top-3 flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="text-xs backdrop-blur-sm"
                    >
                      {formatModelLabel(prompt.modelType)}
                    </Badge>
                    {/* <Badge
                                    variant="secondary"
                                    className="text-xs backdrop-blur-sm"
                                  >
                                    {prompt.category.name}
                                  </Badge> */}
                  </div>
                  <Link
                    href={`/prompts/${prompt.slug}`}
                    className="absolute inset-0"
                  >
                    <span className="sr-only">Open {prompt.title}</span>
                  </Link>
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    {/* <p className="mb-2 text-xs text-white/80">
                                    {formatModelLabel(prompt.modelType)}
                                  </p> */}
                    <h3 className="font-semibold text-xs text-white line-clamp-1">
                      {prompt.title}
                    </h3>
                    {/* <p className="mt-1 line-clamp-2 text-sm text-white/80">
                                    {prompt.shortDescription ||
                                      "Curated prompt ready to copy and use."}
                                  </p> */}
                    <div className="mt-3 flex items-center justify-between text-xs text-white/90">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {prompt.viewsCount.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {prompt.likesCount.toLocaleString()}
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
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href={`/prompts?category=${categorySlug}`}>
                View More {categoryName} Prompts
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
