"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { promptApi } from "@/shared/api";
import { queryKeys } from "@/shared/lib/react-query/keys";
import type { Prompt, PromptDetail, PromptListParams } from "../types";

export const usePrompts = (params: PromptListParams) =>
  useQuery({
    queryKey: queryKeys.prompts.list(params),
    queryFn: () => promptApi.client.listPrompts(params),
    staleTime: 1000 * 60 * 5,
  });

export const useTrendingPrompts = (params: Omit<PromptListParams, "sortBy">) =>
  useQuery({
    queryKey: queryKeys.prompts.trending(params),
    queryFn: () => promptApi.client.getTrendingPrompts(params),
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
