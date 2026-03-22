import { PromptListPage } from "@/shared/components/feature/prompt";
import { queryKeys } from "@/shared/lib/react-query/keys";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getServerQueryClient } from "@/shared/lib/react-query/prefetch";
import { promptApi } from "@/shared/api";

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
  searchParams: Record<string, string>;
}) {
  const queryClient = getServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.prompts.list(searchParams),
    queryFn: () => promptApi.server.listPrompts(searchParams),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PromptListPage />
    </HydrationBoundary>
  );
}
