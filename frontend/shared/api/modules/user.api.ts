import type { ApiResponse, PaginatedData } from "../types";
import { errorResponse } from "../types";
import apiClient from "../client";
import { env } from "@/shared/lib/env";
import type {
  PromptCategory,
  PromptTagWrapper,
} from "@/shared/components/feature/prompt/types";

export interface UserProfile {
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  website: string | null;
  location: string | null;
  avatarUrl: string | null;
  coverImageUrl: string | null;
  promptCount: number;
  followersCount: number;
  followingCount: number;
  reputationScore: number;
}

export interface UserAccount {
  id: string;
  username: string;
  slug: string;
  email?: string;
  createdOn: string;
  status?: string;
  roles?: string[];
  permissions?: string[];
  profile: UserProfile | null;
  isFollowedByViewer?: boolean;
  isOwnedByViewer?: boolean;
}

export interface UserPrompt {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  imageUrl: string | null;
  modelType: string;
  status: string;
  likesCount: number;
  viewsCount: number;
  commentsCount: number;
  favoritesCount: number;
  featured: boolean;
  createdOn: string;
  category: PromptCategory;
  createdBy: {
    id: string;
    username: string;
    slug: string;
    profile: {
      displayName: string | null;
      avatarUrl: string | null;
    } | null;
  };
  tags: PromptTagWrapper[];
}

export interface FavoritePrompt {
  id: string;
  createdOn: string;
  prompt: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string | null;
    imageUrl: string | null;
    modelType: string;
    likesCount: number;
    viewsCount: number;
    createdOn: string;
    category: PromptCategory;
    createdBy: {
      id: string;
      username: string;
      slug: string;
      profile: {
        displayName: string | null;
        avatarUrl: string | null;
      } | null;
    };
  };
}

export interface UserPromptListParams {
  page?: number;
  limit?: number;
  status?: "APPROVED" | "DRAFT" | "PENDING" | "REJECTED" | "ARCHIVED";
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  bio?: string;
  website?: string;
  location?: string;
}

export interface UpdateUsernamePayload {
  username: string;
}

export type PublicProfileResponse = ApiResponse<{ user: UserAccount }>;
export type UserPromptsResponse = ApiResponse<PaginatedData<UserPrompt>>;
export type UserFavoritesResponse = ApiResponse<PaginatedData<FavoritePrompt>>;

const getServerFetchOptions = async (revalidateSeconds: number) => {
  const { cookies } = await import("next/headers");
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();

  if (cookieHeader) {
    return {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store" as const,
    };
  }

  return {
    next: { revalidate: revalidateSeconds },
  };
};

const buildQueryString = (
  params?: UserPromptListParams,
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

export const server = {
  getPublicProfile: async (slug: string): Promise<PublicProfileResponse> => {
    const res = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/users/${slug}`,
      await getServerFetchOptions(300),
    );

    if (!res.ok) return errorResponse();
    return res.json();
  },

  getUserPrompts: async (
    slug: string,
    params?: UserPromptListParams,
  ): Promise<UserPromptsResponse> => {
    const res = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/users/${slug}/prompts${buildQueryString(params)}`,
      await getServerFetchOptions(120),
    );

    if (!res.ok) return errorResponse();
    return res.json();
  },
};

export const getPublicProfile = async (
  slug: string,
): Promise<PublicProfileResponse> => apiClient.get(`/users/${slug}`);

export const getUserPrompts = async (
  slug: string,
  params?: UserPromptListParams,
): Promise<UserPromptsResponse> =>
  apiClient.get(`/users/${slug}/prompts`, { params });

export const getMyFavorites = (
  params?: Pick<UserPromptListParams, "page" | "limit">,
): Promise<UserFavoritesResponse> =>
  apiClient.get("/users/me/favorites", { params });

export const updateMyProfile = async (
  payload: UpdateProfilePayload,
): Promise<ApiResponse<{ profile: UserProfile }>> =>
  apiClient.patch("/users/me/profile", payload);

export const updateMyAvatar = async (
  file: File,
): Promise<ApiResponse<{ profile: UserProfile }>> => {
  const formData = new FormData();
  formData.append("avatar", file);
  return apiClient.patch("/users/me/avatar", formData);
};

export const updateMyUsername = async (
  payload: UpdateUsernamePayload,
): Promise<ApiResponse<{ user: UserAccount }>> =>
  apiClient.patch("/users/me/username", payload);
