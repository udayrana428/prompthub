"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect } from "react";
import { Eye, Heart, LoaderCircle } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { useUserPrompts } from "../hooks/use-user-prompts";

export function PublicProfilePrompts({ slug }: { slug: string }) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserPrompts(slug);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) fetchNextPage();
      },
      { rootMargin: "250px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const prompts = data?.pages.flatMap((page) => page.data.data) ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-muted-foreground">Failed to load prompts.</p>
    );
  }

  if (prompts.length === 0) {
    return <p className="text-sm text-muted-foreground">No prompts yet.</p>;
  }

  return (
    <div>
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
                <div className="mt-3 flex items-center gap-3 text-xs text-white/90">
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
            </div>
          </Card>
        ))}
      </div>

      {/* Sentinel */}
      <div ref={loadMoreRef} className="h-10 w-full" />

      {isFetchingNextPage && (
        <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Loading more prompts...
        </div>
      )}

      {!hasNextPage && prompts.length > 0 && (
        <p className="py-4 text-center text-sm text-muted-foreground">
          No more prompts.
        </p>
      )}
    </div>
  );
}
