"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { notificationApi } from "@/shared/api";
import { queryKeys } from "@/shared/lib/react-query/keys";
import { useAppSelector } from "@/shared/redux/hooks";

const notificationQueryOptions = {
  staleTime: 0,
  gcTime: 60 * 1000,
  refetchOnMount: "always" as const,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
};

export const useNotifications = (
  params?: { page?: number; limit?: number },
  options?: { enabled?: boolean; refetchInterval?: number | false },
) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return useInfiniteQuery({
    queryKey: queryKeys.notifications.list(params ?? {}),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      notificationApi.getMyNotifications({
        ...params,
        page: pageParam as number,
      }),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.data.pagination;
      return pagination.hasNextPage ? pagination.page + 1 : undefined;
    },
    enabled: (options?.enabled ?? true) && isAuthenticated,
    refetchInterval: options?.refetchInterval,
    staleTime: 0,
    gcTime: 60 * 1000,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationApi.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationApi.markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
};
