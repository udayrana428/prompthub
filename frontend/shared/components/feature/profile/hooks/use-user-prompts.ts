"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserPrompts } from "@/shared/api/modules/user.api";
import { queryKeys } from "@/shared/lib/react-query/keys";

export const useUserPrompts = (slug: string, limit = 12) =>
  useInfiniteQuery({
    queryKey: queryKeys.users.prompts(slug), // add this key if missing, or use ["users", slug, "prompts"]
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getUserPrompts(slug, { page: pageParam as number, limit }),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.data.pagination;
      return pagination.hasNextPage ? pagination.page + 1 : undefined;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 2,
  });
