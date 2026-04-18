import apiClient from "../client";
import type { ApiResponse, PaginatedData } from "../types";
import type { PromptMutationPayload } from "./prompt.api";

export interface AdminPromptAuthor {
  id: string;
  username: string;
  slug: string;
  email: string;
  profile: {
    displayName: string | null;
    avatarUrl: string | null;
  } | null;
}

export interface AdminPromptCategory {
  id: string;
  name: string;
  slug: string;
}

export interface AdminPromptTag {
  tag: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface AdminPromptListItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  imageUrl: string | null;
  modelType: string;
  viewsCount: number;
  likesCount: number;
  favoritesCount: number;
  commentsCount: number;
  copiesCount: number;
  featured: boolean;
  status: string;
  rejectionReason: string | null;
  createdOn: string;
  modifiedOn: string;
  category: AdminPromptCategory;
  createdBy: AdminPromptAuthor;
  tags: AdminPromptTag[];
}

export interface AdminPromptDetail extends AdminPromptListItem {
  description: string | null;
  promptText: string;
  metaTitle: string | null;
  metaDescription: string | null;
  categoryId: string;
  reportsCount: number;
  modifiedById: string | null;
  deletedOn: string | null;
  deletedById: string | null;
  createdById: string;
  tips: Array<{ id: string; content: string; createdOn: string }>;
  variations: Array<{ id: string; content: string; createdOn: string }>;
}

export interface AdminPromptListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  featured?: boolean;
  categoryId?: string;
  createdById?: string;
  modelType?: string;
  sortBy?: "latest" | "oldest" | "popular" | "mostViewed";
}

export interface AdminPromptFormPayload
  extends Omit<PromptMutationPayload, "status"> {
  status?: string;
  featured?: boolean;
  rejectionReason?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export type AdminPromptListResponse = ApiResponse<
  PaginatedData<AdminPromptListItem>
>;

export type AdminPromptDetailResponse = ApiResponse<{
  prompt: AdminPromptDetail;
}>;

export type AdminPromptMutationResponse = ApiResponse<{
  prompt: AdminPromptDetail;
}>;

const appendPromptFormData = (payload: AdminPromptFormPayload) => {
  const formData = new FormData();
  const serializedPayload = {
    title: payload.title.trim(),
    promptText: payload.promptText.trim(),
    categoryId: payload.categoryId,
    shortDescription: payload.shortDescription?.trim() ?? "",
    description: payload.description?.trim() ?? "",
    modelType: payload.modelType ?? "OTHER",
    tags: payload.tags?.map((tag) => tag.trim()) ?? [],
    tips: payload.tips?.map((tip) => tip.trim()) ?? [],
    variations:
      payload.variations?.map((variation) => variation.trim()) ?? [],
    status: payload.status ?? "APPROVED",
    featured: payload.featured ?? false,
    rejectionReason: payload.rejectionReason?.trim() ?? "",
    metaTitle: payload.metaTitle?.trim() ?? "",
    metaDescription: payload.metaDescription?.trim() ?? "",
  };

  formData.append("data", JSON.stringify(serializedPayload));

  if (payload.image) {
    formData.append("image", payload.image);
  }

  return formData;
};

export const adminPromptApi = {
  listPrompts: async (
    params?: AdminPromptListParams,
  ): Promise<AdminPromptListResponse> =>
    apiClient.get("/admin/prompts", { params }),

  getPrompt: async (id: string): Promise<AdminPromptDetailResponse> =>
    apiClient.get(`/admin/prompts/${id}`),

  createPrompt: async (
    payload: AdminPromptFormPayload,
  ): Promise<AdminPromptMutationResponse> =>
    apiClient.post("/admin/prompts", appendPromptFormData(payload)),

  updatePrompt: async (
    id: string,
    payload: AdminPromptFormPayload,
  ): Promise<AdminPromptMutationResponse> =>
    apiClient.patch(`/admin/prompts/${id}`, appendPromptFormData(payload)),

  updatePromptStatus: async (
    id: string,
    payload: { status: string; rejectionReason?: string },
  ): Promise<AdminPromptMutationResponse> =>
    apiClient.patch(`/admin/prompts/${id}/status`, payload),

  updatePromptFeatured: async (
    id: string,
    featured: boolean,
  ): Promise<AdminPromptMutationResponse> =>
    apiClient.patch(`/admin/prompts/${id}/featured`, { featured }),

  deletePrompt: async (id: string): Promise<ApiResponse<null>> =>
    apiClient.delete(`/admin/prompts/${id}`),
};
