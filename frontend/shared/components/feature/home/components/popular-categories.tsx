"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { categoryApi } from "@/shared/api";
import { queryKeys } from "@/shared/lib/react-query/keys";
import { Button } from "@/shared/components/ui/button";

export function PopularCategories() {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.categories.list({ limit: 12, isActive: true }),
    queryFn: () =>
      categoryApi.client.listCategories({ limit: 12, isActive: true }),
    staleTime: 1000 * 60 * 10,
  });

  const categories = data?.data.data ?? [];

  return (
    <section className="border-y border-border bg-background py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">
              Popular Categories
            </p>
            <h2 className="mt-2 text-2xl font-bold text-foreground lg:text-3xl">
              Jump straight into the prompts people browse most
            </h2>
            <p className="mt-2 text-sm text-muted-foreground lg:text-base">
              Pick a category and land directly on the prompt listing page with
              that filter already applied.
            </p>
          </div>

          <Button asChild variant="outline" className="w-full lg:w-auto">
            <Link href="/prompts">
              View All Prompt Categories
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={`category-skeleton-${index}`}
                className="h-10 w-28 animate-pulse rounded-full bg-muted"
              />
            ))
          ) : isError ? (
            <p className="text-sm text-destructive">
              Popular categories could not be loaded right now.
            </p>
          ) : (
            categories.map((category) => (
              <Button
                key={category.id}
                asChild
                variant="outline"
                className="rounded-full border-border bg-card px-4 py-2 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              >
                <Link href={`/prompts?category=${encodeURIComponent(category.slug)}`}>
                  {category.name}
                </Link>
              </Button>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
