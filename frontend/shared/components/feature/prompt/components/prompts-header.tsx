"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Filter, Search } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { PromptListParams } from "../types";

const toRoute = (params: PromptListParams) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });

  const serialized = searchParams.toString();
  return serialized ? `/prompts?${serialized}` : "/prompts";
};

export function PromptsHeader({
  onShowFilter,
  params,
  total,
}: {
  onShowFilter: () => void;
  params: PromptListParams;
  total: number;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(params.search || "");

  const submitSearch = () => {
    router.push(
      toRoute({
        ...params,
        page: 1,
        search: search.trim() || undefined,
      }),
    );
  };

  return (
    <section className="border-b border-border bg-card py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-card-foreground lg:text-4xl">
              Browse AI Prompts
            </h1>
            <p className="text-muted-foreground">
              Discover prompts synced directly from your backend catalog
            </p>
          </div>

          <div className="flex w-full flex-col gap-4 sm:flex-row lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search prompts, styles, or keywords..."
                className="border-border bg-background pl-10"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") submitSearch();
                }}
              />
            </div>
            <Button variant="outline" onClick={submitSearch}>
              Search
            </Button>
            <Select
              value={params.sortBy || "latest"}
              onValueChange={(value) =>
                router.push(
                  toRoute({
                    ...params,
                    page: 1,
                    sortBy: value as PromptListParams["sortBy"],
                  }),
                )
              }
            >
              <SelectTrigger className="w-full border-border bg-background sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Newest First</SelectItem>
                <SelectItem value="popular">Most Liked</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            {total} prompt{total === 1 ? "" : "s"} found
          </p>
          <Button
            onClick={onShowFilter}
            variant="outline"
            size="sm"
            className="bg-transparent lg:hidden"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>
    </section>
  );
}
