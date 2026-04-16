"use client";

import Image from "next/image";
import Link from "next/link";
import { Copy, Eye, Heart, TrendingUp } from "lucide-react";
import { useWeeklyTrendingPrompts } from "@/shared/components/feature/prompt/hooks/use-prompts";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { formatModelLabel } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/lib/routes";

export function TrendingPrompts() {
  const { data, isLoading, isError } = useWeeklyTrendingPrompts({ limit: 12 });

  const prompts = data?.data.prompts ?? [];

  return (
    <section className="bg-muted/30 py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-center justify-between gap-4">
          <div className="text-center sm:text-start">
            <h2 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">
              Trending Prompts
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore the world of AI prompts with our curated collection of
              trending prompts.
            </p>
          </div>
          <Button asChild variant="outline" className="hidden sm:block">
            <Link href="/prompts?sortBy=trending">View All Prompts</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="text-sm text-muted-foreground">
            Loading trending prompts...
          </div>
        ) : isError ? (
          <div className="text-sm text-destructive">
            Trending prompts could not be loaded.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {prompts.map(({ prompt, rank }) => (
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
                    src={prompt.imageUrl || "/placeholder.svg"}
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
                    {/* <p className="mb-2 text-xs text-white/80">
                        {formatModelLabel(prompt.modelType)}
                      </p> */}
                    {/* <Badge
                      variant="secondary"
                      className="text-xs backdrop-blur-sm"
                    >
                      {prompt.category.name}
                    </Badge>
                    <Badge variant="default" className="bg-primary text-xs">
                      <TrendingUp className="mr-1 h-3 w-3" />#{rank} Weekly
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
        )}

        <div className="mt-12 text-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/prompts?sortBy=trending">
              Explore Trending Prompts
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
