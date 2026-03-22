"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Heart } from "lucide-react";
import { usePrompts } from "../hooks/use-prompts";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { formatModelLabel } from "@/shared/lib/utils";

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
    data?.data.data.filter(
      (prompt) =>
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedPrompts.map((prompt) => (
              <Card
                key={prompt.id}
                className="group overflow-hidden border-border bg-card transition-all duration-200 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={prompt.imageUrl || "/placeholder.svg"}
                    alt={prompt.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute left-3 top-3">
                    <Badge
                      variant="secondary"
                      className="bg-background/90 text-xs backdrop-blur-sm"
                    >
                      {prompt.category.name}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <Link href={`/prompts/${prompt.slug}`}>
                    <h3 className="mb-3 cursor-pointer font-semibold text-card-foreground transition-colors group-hover:text-primary">
                      {prompt.title}
                    </h3>
                  </Link>

                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                    {prompt.shortDescription ||
                      "Explore another relevant prompt from this category."}
                  </p>

                  <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatModelLabel(prompt.modelType)}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {prompt.viewsCount.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {prompt.likesCount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Button asChild size="sm" className="w-full">
                    <Link href={`/prompts/${prompt.slug}`}>Open Prompt</Link>
                  </Button>
                </CardContent>
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
