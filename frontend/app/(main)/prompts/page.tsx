import { PromptListPage } from "@/shared/components/feature/prompt";
import { normalizePromptListParams } from "@/shared/components/feature/prompt/utils/normalize-prompt-list-params";
import { queryKeys } from "@/shared/lib/react-query/keys";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getServerQueryClient } from "@/shared/lib/react-query/prefetch";
import { promptApi, trendingApi } from "@/shared/api";

const getPromptListBaseParams = (params: ReturnType<typeof normalizePromptListParams>) => ({
  ...params,
  page: undefined,
});

export const metadata = {
  title: "Browse AI Prompts - PromptHub | 10,000+ Curated Prompts",
  description:
    "Browse thousands of AI prompts for image generation. Filter by category, AI model, popularity, and more. Find the perfect prompt for MidJourney, DALL-E, Stable Diffusion.",
  keywords:
    "AI prompts, browse prompts, MidJourney prompts, DALL-E prompts, Stable Diffusion prompts, image generation",
};

// ── Page ─────────────────────────────────────────────────────────────────────
// Strategy: SSR — dynamic per searchParams, can't be statically generated
export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const queryClient = getServerQueryClient();
  const params = normalizePromptListParams(searchParams);

  await queryClient.prefetchInfiniteQuery({
    queryKey: queryKeys.prompts.list(getPromptListBaseParams(params)),
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const nextParams = { ...params, page: pageParam as number };

      if (params.sortBy === "trending") {
        const trendingResponse = await trendingApi.server.getTrendingPrompts({
          window: "WEEKLY",
          limit: params.limit ?? 24,
        });

        return trendingApi.toPromptListResponse(trendingResponse, nextParams);
      }

      return promptApi.server.listPrompts(nextParams);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PromptListPage />
    </HydrationBoundary>
  );
}
