"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, promptApi, userApi } from "@/shared/api";
import { queryKeys } from "@/shared/lib/react-query/keys";
import { useAppDispatch, useAppSelector } from "@/shared/redux/hooks";
import { setAuth, type AuthUser } from "@/shared/redux/slices/auth.slice";
import type {
  UpdateProfilePayload,
  UserPromptListParams,
} from "@/shared/api/modules/user.api";
import type { PromptMutationPayload } from "@/shared/api/modules/prompt.api";

const accountQueryOptions = {
  staleTime: 0,
  gcTime: 60 * 1000,
  refetchOnMount: "always" as const,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
};

const normalizeUser = (user: any): AuthUser => ({
  id: user?.id ?? "",
  username: user?.username ?? "",
  slug: user?.slug ?? "",
  email: user?.email ?? "",
  status: user?.status,
  createdOn: user?.createdOn,
  roles: Array.isArray(user?.roles) ? user.roles : [],
  permissions: Array.isArray(user?.permissions) ? user.permissions : [],
  profile: user?.profile ?? null,
});

export const useCurrentAuthUser = () =>
  useAppSelector((state) => state.auth.user);

export const useCurrentUserProfile = () => {
  const user = useCurrentAuthUser();

  return useQuery({
    queryKey: queryKeys.user.profile(user?.slug ?? "current"),
    queryFn: () => userApi.getPublicProfile(user!.slug),
    enabled: !!user?.slug,
    ...accountQueryOptions,
  });
};

export const useMyPrompts = (params?: UserPromptListParams) => {
  const user = useCurrentAuthUser();

  return useQuery({
    queryKey: ["account", "my-prompts", user?.slug ?? "current", params ?? {}],
    queryFn: () => userApi.getUserPrompts(user!.slug, params),
    enabled: !!user?.slug,
    ...accountQueryOptions,
  });
};

export const useSavedPrompts = (
  params?: Pick<UserPromptListParams, "page" | "limit">,
) =>
  useQuery({
    queryKey: ["account", "saved-prompts", params ?? {}],
    queryFn: () => userApi.getMyFavorites(params),
    ...accountQueryOptions,
  });

export const useEditablePrompt = (promptId?: string, enabled = true) =>
  useQuery({
    queryKey: ["account", "editable-prompt", promptId ?? "new"],
    queryFn: () => promptApi.client.getEditablePrompt(promptId!),
    enabled: enabled && !!promptId,
    ...accountQueryOptions,
  });

const invalidatePromptCollections = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ["account", "my-prompts"] });
  queryClient.invalidateQueries({ queryKey: ["account", "saved-prompts"] });
  queryClient.invalidateQueries({ queryKey: ["prompts"] });
  queryClient.invalidateQueries({ queryKey: ["trending"] });
};

export const useCreatePrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PromptMutationPayload) =>
      promptApi.client.createPrompt(payload),
    onSuccess: () => {
      invalidatePromptCollections(queryClient);
    },
  });
};

export const useUpdatePrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: PromptMutationPayload;
    }) => promptApi.client.updatePrompt(id, payload),
    onSuccess: (_, variables) => {
      invalidatePromptCollections(queryClient);
      queryClient.invalidateQueries({
        queryKey: ["account", "editable-prompt", variables.id],
      });
    },
  });
};

export const useDeletePrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => promptApi.client.deletePrompt(id),
    onSuccess: () => {
      invalidatePromptCollections(queryClient);
    },
  });
};

export const useUnsavePrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (promptId: string) => promptApi.client.unsavePrompt(promptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "saved-prompts"] });
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      queryClient.invalidateQueries({ queryKey: ["trending"] });
    },
  });
};

export const useUpdateAvatar = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => userApi.updateMyAvatar(file),
    onSuccess: async () => {
      const response = await authApi.me();
      const normalizedUser = normalizeUser(response.data.user);

      dispatch(setAuth({ user: normalizedUser }));
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["account"] });
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      queryClient.invalidateQueries({ queryKey: ["trending"] });
      queryClient.setQueryData(queryKeys.user.profile(normalizedUser.slug), {
        success: true,
        statusCode: 200,
        message: "User fetched successfully.",
        data: { user: normalizedUser },
      });
    },
  });
};

export const useSaveAccountSettings = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const currentUser = useCurrentAuthUser();

  return useMutation({
    mutationFn: async (payload: {
      username: string;
      profile: UpdateProfilePayload;
    }) => {
      if (
        payload.username.trim() &&
        payload.username.trim() !== currentUser?.username
      ) {
        await userApi.updateMyUsername({ username: payload.username.trim() });
      }

      const cleanedProfile = Object.fromEntries(
        Object.entries(payload.profile).filter(
          ([, value]) => value !== undefined,
        ),
      ) as UpdateProfilePayload;

      if (Object.keys(cleanedProfile).length > 0) {
        await userApi.updateMyProfile(cleanedProfile);
      }

      return authApi.me();
    },
    onSuccess: (response) => {
      const normalizedUser = normalizeUser(response.data.user);

      dispatch(setAuth({ user: normalizedUser }));
      queryClient.invalidateQueries({ queryKey: queryKeys.user.me() });
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["account"] });
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      queryClient.invalidateQueries({ queryKey: ["trending"] });
      queryClient.setQueryData(queryKeys.user.profile(normalizedUser.slug), {
        success: true,
        statusCode: 200,
        message: "User fetched successfully.",
        data: { user: normalizedUser },
      });
    },
  });
};
