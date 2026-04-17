"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { promptApi, trendingApi } from "@/shared/api";
import { queryKeys } from "@/shared/lib/react-query/keys";
import type { Prompt, PromptDetail, PromptListParams } from "../types";

const getPromptListBaseParams = (
  params: PromptListParams,
): PromptListParams => ({
  ...params,
  page: undefined,
});

export const usePrompts = (params: PromptListParams) =>
  useInfiniteQuery({
    queryKey: queryKeys.prompts.list(getPromptListBaseParams(params)),
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const nextParams = { ...params, page: pageParam as number };

      if (params.sortBy === "trending") {
        const trendingResponse = await trendingApi.client.getTrendingPrompts({
          window: "WEEKLY",
          limit: params.limit ?? 24,
        });

        return trendingApi.toPromptListResponse(trendingResponse, nextParams);
      }

      return promptApi.client.listPrompts(nextParams);
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.data.pagination;
      return pagination.hasNextPage ? pagination.page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 0,
  });

export const useWeeklyTrendingPrompts = (params: { limit?: number } = {}) =>
  useQuery({
    queryKey: queryKeys.trending.list({ window: "WEEKLY", ...params }),
    queryFn: () =>
      trendingApi.client.getTrendingPrompts({
        window: "WEEKLY",
        limit: params.limit ?? 12,
      }),
    staleTime: 1000 * 60 * 5,
  });

export const useLatestPrompts = (params: Omit<PromptListParams, "sortBy">) =>
  useQuery({
    queryKey: queryKeys.prompts.latest(params),
    queryFn: () => promptApi.client.getLatestPrompts(params),
    staleTime: 1000 * 60 * 5,
  });

export const usePromptDetail = (slug: string) =>
  useQuery({
    queryKey: queryKeys.prompts.detail(slug),
    queryFn: () => promptApi.client.getPromptBySlug(slug),
    enabled: !!slug,
  });

const invalidatePrompts = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.prompts.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.trending.all });
};

const patchPromptInResponse = (
  response: any,
  promptId: string,
  updater: (prompt: Prompt | PromptDetail) => Prompt | PromptDetail,
) => {
  if (!response?.data) return response;

  if (response.data?.prompt?.id === promptId) {
    return {
      ...response,
      data: {
        ...response.data,
        prompt: updater(response.data.prompt),
      },
    };
  }

  if (Array.isArray(response.data?.data)) {
    return {
      ...response,
      data: {
        ...response.data,
        data: response.data.data.map((prompt: Prompt) =>
          prompt.id === promptId ? updater(prompt) : prompt,
        ),
      },
    };
  }

  return response;
};

const optimisticUpdatePromptInteractions = (
  queryClient: ReturnType<typeof useQueryClient>,
  promptId: string,
  updater: (prompt: Prompt | PromptDetail) => Prompt | PromptDetail,
) => {
  queryClient.setQueriesData({ queryKey: queryKeys.prompts.all }, (old: any) =>
    patchPromptInResponse(old, promptId, updater),
  );
};

export const useToggleLikePrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isLiked }: { id: string; isLiked: boolean }) =>
      isLiked
        ? promptApi.client.unlikePrompt(id)
        : promptApi.client.likePrompt(id),
    onMutate: async ({ id, isLiked }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.prompts.all });
      const previous = queryClient.getQueriesData({
        queryKey: queryKeys.prompts.all,
      });

      optimisticUpdatePromptInteractions(queryClient, id, (prompt) => ({
        ...prompt,
        isLiked: !isLiked,
        likesCount: Math.max(0, prompt.likesCount + (isLiked ? -1 : 1)),
      }));

      return { previous };
    },
    onError: (_error, _variables, context) => {
      context?.previous?.forEach(
        ([key, data]: [readonly unknown[], unknown]) => {
          queryClient.setQueryData(key, data);
        },
      );
    },
    onSuccess: () => invalidatePrompts(queryClient),
  });
};

export const useToggleFavoritePrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFavorited }: { id: string; isFavorited: boolean }) =>
      isFavorited
        ? promptApi.client.unsavePrompt(id)
        : promptApi.client.savePrompt(id),
    onMutate: async ({ id, isFavorited }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.prompts.all });
      const previous = queryClient.getQueriesData({
        queryKey: queryKeys.prompts.all,
      });

      optimisticUpdatePromptInteractions(queryClient, id, (prompt) => ({
        ...prompt,
        isFavorited: !isFavorited,
        favoritesCount: Math.max(
          0,
          prompt.favoritesCount + (isFavorited ? -1 : 1),
        ),
      }));

      return { previous };
    },
    onError: (_error, _variables, context) => {
      context?.previous?.forEach(
        ([key, data]: [readonly unknown[], unknown]) => {
          queryClient.setQueryData(key, data);
        },
      );
    },
    onSuccess: () => invalidatePrompts(queryClient),
  });
};

export const useCopyPrompt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => promptApi.client.copyPrompt(id),
    onSuccess: () => invalidatePrompts(queryClient),
  });
};
