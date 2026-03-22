import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { promptApi } from "@/shared/api";
import { PromptDetailPage } from "@/shared/components/feature/prompt";
import { buildMetadata, notFoundMetadata } from "@/shared/lib/seo";
import { getServerQueryClient } from "@/shared/lib/react-query/prefetch";
import { queryKeys } from "@/shared/lib/react-query/keys";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const result = await promptApi.server.getPromptBySlug(params.slug);
  if (!result.success) return notFoundMetadata;
  return buildMetadata(result.data.meta);
}

export const revalidate = 300;

export default async function Page({ params }: PageProps) {
  const result = await promptApi.server.getPromptBySlug(params.slug);

  if (!result.success) return notFound();

  const queryClient = getServerQueryClient();
  queryClient.setQueryData(queryKeys.prompts.detail(params.slug), result);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PromptDetailPage prompt={result.data.prompt} />
    </HydrationBoundary>
  );
}
