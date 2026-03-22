import apiClient from "../client";
import type { ApiResponse, PaginatedData } from "../types";

export interface PromptCommentAuthor {
  id: string;
  username: string;
  slug: string;
  profile: {
    displayName: string | null;
    avatarUrl: string | null;
  } | null;
}

export interface PromptCommentItem {
  id: string;
  content: string;
  status: string;
  edited: boolean;
  likesCount: number;
  repliesCount: number;
  parentId: string | null;
  createdOn: string;
  modifiedOn: string;
  user: PromptCommentAuthor;
}

export type PromptCommentsApiResponse = ApiResponse<
  PaginatedData<PromptCommentItem>
>;

export const client = {
  listComments: async (
    promptId: string,
    params?: { page?: number; limit?: number },
  ): Promise<PromptCommentsApiResponse> =>
    apiClient.get(`/prompts/${promptId}/comments`, {
      params,
    }),

  createComment: async (
    promptId: string,
    data: { content: string; parentId?: string | null },
  ): Promise<ApiResponse<{ comment: PromptCommentItem }>> =>
    apiClient.post(`/prompts/${promptId}/comments`, data),
};
