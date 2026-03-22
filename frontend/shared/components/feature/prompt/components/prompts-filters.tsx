"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { categoryApi } from "@/shared/api";
import { queryKeys } from "@/shared/lib/react-query/keys";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import type { PromptListParams } from "../types";

const aiModels = [
  { id: "MIDJOURNEY", label: "MidJourney" },
  { id: "DALL_E", label: "DALL-E" },
  { id: "STABLE_DIFFUSION", label: "Stable Diffusion" },
  { id: "GEMINI", label: "Gemini" },
  { id: "OTHER", label: "Other" },
];

const toRoute = (params: PromptListParams) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });

  const serialized = searchParams.toString();
  return serialized ? `/prompts?${serialized}` : "/prompts";
};

export function PromptsFilters({ params }: { params: PromptListParams }) {
  const router = useRouter();
  const { data } = useQuery({
    queryKey: queryKeys.categories.list({ limit: 20, isActive: true }),
    queryFn: () =>
      categoryApi.client.listCategories({ limit: 20, isActive: true }),
    staleTime: 1000 * 60 * 10,
  });

  const categories = data?.data.data ?? [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Active Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {params.category ? (
              <Badge variant="secondary" className="text-xs">
                Category: {params.category}
              </Badge>
            ) : null}
            {params.model ? (
              <Badge variant="secondary" className="text-xs">
                Model: {params.model}
              </Badge>
            ) : null}
            {params.search ? (
              <Badge variant="secondary" className="text-xs">
                Search: {params.search}
              </Badge>
            ) : null}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => router.push("/prompts")}
          >
            Clear All
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                params.category === category.slug
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:bg-muted/50"
              }`}
              onClick={() =>
                router.push(
                  toRoute({
                    ...params,
                    page: 1,
                    category:
                      params.category === category.slug ? undefined : category.slug,
                  }),
                )
              }
            >
              <span>{category.name}</span>
              {params.category === category.slug ? <X className="h-4 w-4" /> : null}
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">AI Models</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiModels.map((model) => (
            <button
              key={model.id}
              type="button"
              className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                params.model === model.id
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:bg-muted/50"
              }`}
              onClick={() =>
                router.push(
                  toRoute({
                    ...params,
                    page: 1,
                    model: params.model === model.id ? undefined : model.id,
                  }),
                )
              }
            >
              <span>{model.label}</span>
              {params.model === model.id ? <X className="h-4 w-4" /> : null}
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
