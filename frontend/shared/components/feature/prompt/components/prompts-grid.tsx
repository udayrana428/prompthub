"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Eye, Heart, LoaderCircle } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import type { Pagination } from "@/shared/api/types";
import { ROUTES } from "@/shared/lib/routes";
import { formatModelLabel } from "@/shared/lib/utils";
import type { Prompt } from "../types";
import { NoData } from "@/shared/components/common/common-components/NoData";

export function PromptsGrid({
  prompts,
  pagination,
  total,
  isLoading,
  isError,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: {
  prompts: Prompt[];
  pagination?: Pagination;
  total: number;
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      {
        rootMargin: "250px 0px",
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  if (isLoading) return <div>Loading prompts...</div>;
  if (isError) return <div>Failed to load prompts.</div>;
  if (prompts.length === 0) {
    return <NoData />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{prompts.length}</span>{" "}
          of <span className="font-medium text-foreground">{total}</span>{" "}
          prompts
        </p>
        {hasNextPage ? (
          <p className="text-xs text-muted-foreground">
            More prompts will load as you scroll
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            You have reached the end
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
        {prompts.map((prompt) => (
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
                <Badge variant="secondary" className="text-xs backdrop-blur-sm">
                  {formatModelLabel(prompt.modelType)}
                </Badge>
              </div>
              <Link
                href={`/prompts/${prompt.slug}`}
                className="absolute inset-0"
              >
                <span className="sr-only">Open {prompt.title}</span>
              </Link>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="font-semibold text-xs text-white line-clamp-1">
                  {prompt.title}
                </h3>
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

      <div ref={loadMoreRef} className="h-10 w-full" />

      {isFetchingNextPage ? (
        <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Loading more prompts...
        </div>
      ) : null}

      {!hasNextPage && pagination ? (
        <div className="py-4 text-center text-sm text-muted-foreground">
          Showing all {pagination.total} prompts in this result set.
        </div>
      ) : null}
    </div>
  );
}
