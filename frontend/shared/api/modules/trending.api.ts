import type { ApiResponse, Pagination } from "../types";
import { errorResponse } from "../types";
import apiClient from "../client";
import { env } from "@/shared/lib/env";
import type { Prompt } from "@/shared/components/feature/prompt/types";
import type { PromptListApiResponse, PromptListParams } from "@/shared/components/feature/prompt/types";

export type TrendingWindow = "DAILY" | "WEEKLY" | "MONTHLY";

interface TrendingSnapshotPrompt {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  imageUrl: string | null;
  modelType: string;
  likesCount: number;
  viewsCount: number;
  commentsCount: number;
  favoritesCount?: number;
  copiesCount?: number;
  featured?: boolean;
  status?: string;
  createdOn?: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  createdBy: {
    id: string;
    username: string;
    slug?: string;
    profile: {
      displayName: string | null;
      avatarUrl: string | null;
    } | null;
  };
  tags?: Array<{
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  likes?: Array<{ id: string }>;
  favorites?: Array<{ id: string }>;
}

export interface TrendingSnapshotItem {
  id: string;
  snapshotDate: string;
  windowType: TrendingWindow;
  score: number;
  rank: number;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  favoritesCount: number;
  prompt: TrendingSnapshotPrompt;
}

export type TrendingApiResponse = ApiResponse<{
  prompts: TrendingSnapshotItem[];
  window: TrendingWindow;
}>;

const buildQueryString = (
  params?: Record<string, string | number | undefined>,
) => {
  if (!params) return "";

  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    query.set(key, String(value));
  });

  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
};

const getServerFetchOptions = async (revalidateSeconds: number) => {
  const { cookies } = await import("next/headers");
  const cookieHeader = cookies().toString();

  if (cookieHeader) {
    return {
      headers: { Cookie: cookieHeader },
      cache: "no-store" as const,
    };
  }

  return {
    next: { revalidate: revalidateSeconds },
  };
};

const normalizeTrendingPrompt = (item: TrendingSnapshotItem): Prompt => ({
  id: item.prompt.id,
  title: item.prompt.title,
  slug: item.prompt.slug,
  shortDescription: item.prompt.shortDescription,
  imageUrl: item.prompt.imageUrl,
  modelType: item.prompt.modelType,
  viewsCount: item.prompt.viewsCount,
  likesCount: item.prompt.likesCount,
  favoritesCount: item.prompt.favoritesCount ?? item.favoritesCount ?? 0,
  commentsCount: item.prompt.commentsCount,
  copiesCount: item.prompt.copiesCount ?? 0,
  featured: item.prompt.featured ?? false,
  status: item.prompt.status ?? "APPROVED",
  createdOn: item.prompt.createdOn ?? item.snapshotDate,
  category: item.prompt.category,
  createdBy: {
    ...item.prompt.createdBy,
    slug: item.prompt.createdBy.slug ?? item.prompt.createdBy.username,
  },
  tags: item.prompt.tags ?? [],
  isLiked: Array.isArray(item.prompt.likes) && item.prompt.likes.length > 0,
  isFavorited:
    Array.isArray(item.prompt.favorites) && item.prompt.favorites.length > 0,
});

const applyTrendingFilters = (
  prompts: Prompt[],
  params?: PromptListParams,
) => {
  if (!params) return prompts;

  return prompts.filter((prompt) => {
    const search = params.search?.trim().toLowerCase();
    const matchesSearch = search
      ? [
          prompt.title,
          prompt.shortDescription,
          prompt.category.name,
          prompt.createdBy.profile?.displayName,
          prompt.createdBy.username,
          ...prompt.tags.map(({ tag }) => tag.name),
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(search))
      : true;

    const matchesCategory = params.category
      ? prompt.category.slug === params.category
      : true;
    const matchesTag = params.tag
      ? prompt.tags.some(({ tag }) => tag.slug === params.tag)
      : true;
    const matchesModel = params.model
      ? prompt.modelType === params.model
      : true;

    return matchesSearch && matchesCategory && matchesTag && matchesModel;
  });
};

export const toPromptListResponse = (
  response: TrendingApiResponse,
  params?: PromptListParams,
): PromptListApiResponse => {
  if (!response.success) return errorResponse(response.message);

  const normalized = response.data.prompts.map(normalizeTrendingPrompt);
  const filtered = applyTrendingFilters(normalized, params);
  const page = params?.page ?? 1;
  const limit = params?.limit ?? (filtered.length || 1);
  const paginated = page > 1 ? [] : filtered.slice(0, limit);

  const pagination: Pagination = {
    total: filtered.length,
    page,
    limit,
    totalPages: filtered.length > 0 ? 1 : 0,
    hasNextPage: false,
    hasPrevPage: false,
  };

  return {
    success: true,
    message: response.message,
    statusCode: response.statusCode,
    data: {
      data: paginated,
      pagination,
      meta: {
        title: `Weekly Trending AI Prompts | PromptHub`,
        description:
          "Explore the latest weekly trending prompts ranked from engagement snapshots.",
        keywords: ["weekly trending prompts", "AI prompts", "PromptHub"],
        canonical: `${env.NEXT_PUBLIC_APP_URL}/prompts?sortBy=trending`,
        noIndex: false,
      },
    },
  };
};

export const server = {
  getTrendingPrompts: async ({
    window = "WEEKLY",
    limit = 12,
  }: {
    window?: TrendingWindow;
    limit?: number;
  } = {}): Promise<TrendingApiResponse> => {
    const res = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/trending${buildQueryString({ window, limit })}`,
      await getServerFetchOptions(60),
    );

    if (!res.ok) return errorResponse();
    return res.json();
  },
};

export const client = {
  getTrendingPrompts: async ({
    window = "WEEKLY",
    limit = 12,
  }: {
    window?: TrendingWindow;
    limit?: number;
  } = {}): Promise<TrendingApiResponse> =>
    apiClient.get("/trending", {
      params: { window, limit },
    }),
};
