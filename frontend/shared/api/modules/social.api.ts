import type { ApiResponse, PaginatedData } from "../types";
import apiClient from "../client";

export interface SocialUser {
  id: string;
  username: string;
  slug: string;
  profile: {
    displayName: string | null;
    avatarUrl: string | null;
  } | null;
}

export interface SocialConnection {
  id: string;
  createdOn: string;
  user: SocialUser;
}

export type SocialConnectionsResponse = ApiResponse<PaginatedData<SocialConnection>>;

type SocialConnectionListParams = {
  page?: number;
  limit?: number;
};

type RawSocialConnection = {
  id: string;
  createdOn: string;
  follower?: SocialUser;
  following?: SocialUser;
};

const normalizeConnectionsResponse = (
  response: ApiResponse<PaginatedData<RawSocialConnection>>,
  key: "follower" | "following",
): SocialConnectionsResponse => ({
  ...response,
  data: {
    ...response.data,
    data: response.data.data.map((connection) => ({
      id: connection.id,
      createdOn: connection.createdOn,
      user: connection[key]!,
    })),
  },
});

export const getFollowers = async (
  userId: string,
  params?: SocialConnectionListParams,
): Promise<SocialConnectionsResponse> => {
  const response = (await apiClient.get(`/users/${userId}/followers`, {
    params,
  })) as ApiResponse<PaginatedData<RawSocialConnection>>;

  return normalizeConnectionsResponse(response, "follower");
};

export const getFollowing = async (
  userId: string,
  params?: SocialConnectionListParams,
): Promise<SocialConnectionsResponse> => {
  const response = (await apiClient.get(`/users/${userId}/following`, {
    params,
  })) as ApiResponse<PaginatedData<RawSocialConnection>>;

  return normalizeConnectionsResponse(response, "following");
};

export const followUser = (userId: string): Promise<ApiResponse<null>> =>
  apiClient.post(`/users/${userId}/follow`);

export const unfollowUser = (userId: string): Promise<ApiResponse<null>> =>
  apiClient.delete(`/users/${userId}/follow`);
