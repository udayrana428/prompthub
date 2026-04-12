import { categoryApi, promptApi, trendingApi } from "@/shared/api";
import HomePage from "@/shared/components/feature/home";
import { queryKeys } from "@/shared/lib/react-query/keys";
import { getServerQueryClient } from "@/shared/lib/react-query/prefetch";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

// export const revalidate = 60;

export const dynamic = "force-dynamic";

export default async function Page() {
  const queryClient = getServerQueryClient();

  try {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: queryKeys.trending.list({ window: "WEEKLY", limit: 12 }),
        queryFn: () =>
          trendingApi.server.getTrendingPrompts({
            window: "WEEKLY",
            limit: 12,
          }),
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.prompts.latest({ limit: 20, page: 1 }),
        queryFn: () =>
          promptApi.server.getLatestPrompts({ limit: 20, page: 1 }),
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.categories.list({ limit: 12, isActive: true }),
        queryFn: () =>
          categoryApi.server.listCategories({ limit: 12, isActive: true }),
      }),
    ]);
  } catch (error) {
    console.error("Server prefetch failed:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePage />
    </HydrationBoundary>
  );
}
