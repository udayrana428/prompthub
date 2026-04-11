"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminPromptApi } from "@/shared/api/modules/admin-prompt.api";
import type {
  AdminPromptFormPayload,
  AdminPromptListParams,
} from "@/shared/api/modules/admin-prompt.api";
import { queryKeys } from "@/shared/lib/react-query/keys";

const invalidatePromptSurfaces = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: ["admin", "prompts"] });
  queryClient.invalidateQueries({ queryKey: ["prompts"] });
  queryClient.invalidateQueries({ queryKey: ["trending"] });
  queryClient.invalidateQueries({ queryKey: ["account", "my-prompts"] });
  queryClient.invalidateQueries({ queryKey: ["account", "saved-prompts"] });
};

export const useAdminPrompts = (params: AdminPromptListParams) =>
  useQuery({
    queryKey: queryKeys.admin.prompts(params),
    queryFn: () => adminPromptApi.listPrompts(params),
    placeholderData: (previous) => previous,
  });

export const useAdminPromptDetail = (id?: string) =>
  useQuery({
    queryKey: ["admin", "prompts", "detail", id ?? ""],
    queryFn: () => adminPromptApi.getPrompt(id!),
    enabled: !!id,
  });

export const useCreateAdminPrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdminPromptFormPayload) =>
      adminPromptApi.createPrompt(payload),
    onSuccess: () => {
      invalidatePromptSurfaces(queryClient);
    },
  });
};

export const useUpdateAdminPrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: AdminPromptFormPayload;
    }) => adminPromptApi.updatePrompt(id, payload),
    onSuccess: (_, variables) => {
      invalidatePromptSurfaces(queryClient);
      queryClient.invalidateQueries({
        queryKey: ["admin", "prompts", "detail", variables.id],
      });
    },
  });
};

export const useUpdateAdminPromptStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      rejectionReason,
    }: {
      id: string;
      status: string;
      rejectionReason?: string;
    }) =>
      adminPromptApi.updatePromptStatus(id, {
        status,
        rejectionReason,
      }),
    onSuccess: (_, variables) => {
      invalidatePromptSurfaces(queryClient);
      queryClient.invalidateQueries({
        queryKey: ["admin", "prompts", "detail", variables.id],
      });
    },
  });
};

export const useToggleAdminPromptFeatured = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      adminPromptApi.updatePromptFeatured(id, featured),
    onSuccess: (_, variables) => {
      invalidatePromptSurfaces(queryClient);
      queryClient.invalidateQueries({
        queryKey: ["admin", "prompts", "detail", variables.id],
      });
    },
  });
};

export const useDeleteAdminPrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminPromptApi.deletePrompt(id),
    onSuccess: () => {
      invalidatePromptSurfaces(queryClient);
    },
  });
};
