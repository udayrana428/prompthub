"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { PromptsHeader } from "./components/prompts-header";
import { PromptsFilters } from "./components/prompts-filters";
import { PromptsGrid } from "./components/prompts-grid";
import { usePrompts } from "./hooks/use-prompts";
import type { PromptListParams } from "./types";

const PromptListPage = () => {
  const [showFilter, setShowFilter] = useState(false);
  const searchParams = useSearchParams();

  const params: PromptListParams = {
    page: searchParams.get("page")
      ? Number(searchParams.get("page"))
      : undefined,
    limit: searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : undefined,
    search: searchParams.get("search") || undefined,
    category: searchParams.get("category") || undefined,
    tag: searchParams.get("tag") || undefined,
    model: searchParams.get("model") || undefined,
    sortBy:
      (searchParams.get("sortBy") as PromptListParams["sortBy"]) || "latest",
  };

  const { data, isLoading, isError } = usePrompts(params);
  const promptData = data?.data;

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <PromptsHeader
        onShowFilter={() => setShowFilter((prev) => !prev)}
        params={params}
        total={promptData?.pagination.total ?? 0}
      />

      <div className="flex flex-col gap-8 lg:flex-row mt-5">
        <aside
          className={`flex-shrink-0 lg:block lg:w-64 ${
            showFilter ? "block" : "hidden"
          }`}
        >
          <PromptsFilters params={params} />
        </aside>

        <div className="flex-1">
          <PromptsGrid
            prompts={promptData?.data ?? []}
            pagination={promptData?.pagination}
            isLoading={isLoading}
            isError={isError}
          />
        </div>
      </div>
    </div>
  );
};

export default PromptListPage;
