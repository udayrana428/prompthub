"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { PromptsHeader } from "./components/prompts-header";
import { PromptsFilters } from "./components/prompts-filters";
import { PromptsGrid } from "./components/prompts-grid";
import { usePrompts } from "./hooks/use-prompts";
import { normalizePromptListParams } from "./utils/normalize-prompt-list-params";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/components/ui/drawer";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useIsMobile } from "@/shared/components/ui/use-mobile";

const PromptListPage = () => {
  const [showFilter, setShowFilter] = useState(false);
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();

  const params = normalizePromptListParams(searchParams);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePrompts(params);

  const pages = data?.pages ?? [];
  const prompts = pages.flatMap((page) => page.data.data);
  const promptData = pages[0]?.data;
  const latestPagination = pages[pages.length - 1]?.data.pagination;

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <PromptsHeader
        onShowFilter={() => setShowFilter(true)}
        params={params}
        total={promptData?.pagination.total ?? 0}
      />

      <Drawer
        open={showFilter}
        onOpenChange={setShowFilter}
        direction={isMobile ? "bottom" : "right"}
      >
        <DrawerContent className="flex flex-col h-[100dvh]">
          <DrawerHeader className="border-b border-border pb-4">
            <DrawerTitle>Filter Prompts</DrawerTitle>
            <DrawerDescription>
              Use the filters to refine your search.
            </DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="flex-1 overflow-y-auto px-4 pb-6">
            <div className="pt-4">
              <PromptsFilters
                params={params}
                onApply={() => setShowFilter(false)}
              />
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      <div className="mt-5">
        <PromptsGrid
          prompts={prompts}
          pagination={latestPagination}
          total={promptData?.pagination.total ?? 0}
          isLoading={isLoading}
          isError={isError}
          hasNextPage={!!hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
        />
      </div>
    </div>
  );
};

export default PromptListPage;
