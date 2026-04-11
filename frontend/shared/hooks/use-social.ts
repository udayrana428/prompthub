"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { socialApi } from "@/shared/api";
import { queryKeys } from "@/shared/lib/react-query/keys";
import { useAppSelector } from "@/shared/redux/hooks";

const socialQueryOptions = {
  staleTime: 0,
  gcTime: 60 * 1000,
  refetchOnMount: "always" as const,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
};

export const useFollowers = (
  userId?: string,
  params?: { page?: number; limit?: number },
  enabled = true,
) =>
  useQuery({
    queryKey: queryKeys.social.followers(userId ?? "unknown", params ?? {}),
    queryFn: () => socialApi.getFollowers(userId!, params),
    enabled: enabled && !!userId,
    ...socialQueryOptions,
  });

export const useFollowing = (
  userId?: string,
  params?: { page?: number; limit?: number },
  enabled = true,
) =>
  useQuery({
    queryKey: queryKeys.social.following(userId ?? "unknown", params ?? {}),
    queryFn: () => socialApi.getFollowing(userId!, params),
    enabled: enabled && !!userId,
    ...socialQueryOptions,
  });

export const useToggleFollowUser = () => {
  const queryClient = useQueryClient();
  const currentUser = useAppSelector((state) => state.auth.user);

  return useMutation({
    mutationFn: ({
      userId,
      isFollowing,
    }: {
      userId: string;
      isFollowing: boolean;
    }) =>
      isFollowing
        ? socialApi.unfollowUser(userId)
        : socialApi.followUser(userId),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.social.all });
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["account"] });

      if (currentUser?.id) {
        queryClient.invalidateQueries({
          queryKey: ["social", "followers", currentUser.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["social", "following", currentUser.id],
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["social", "followers", variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["social", "following", variables.userId],
      });
    },
  });
};
