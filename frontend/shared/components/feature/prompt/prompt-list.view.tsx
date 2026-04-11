"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { PromptsHeader } from "./components/prompts-header";
import { PromptsFilters } from "./components/prompts-filters";
import { PromptsGrid } from "./components/prompts-grid";
import { usePrompts } from "./hooks/use-prompts";
import { normalizePromptListParams } from "./utils/normalize-prompt-list-params";

const PromptListPage = () => {
  const [showFilter, setShowFilter] = useState(false);
  const searchParams = useSearchParams();

  const params = normalizePromptListParams(searchParams);

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
