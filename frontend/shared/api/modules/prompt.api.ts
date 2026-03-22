import type {
  PromptListParams,
  PromptListApiResponse,
  PromptDetailApiResponse,
  PromptTagWrapper,
} from "@/shared/components/feature/prompt/types";
import type { ApiResponse } from "../types";
import { errorResponse } from "../types";
import apiClient from "../client";
import { env } from "@/shared/lib/env";

const buildQueryString = (params?: PromptListParams) => {
  if (!params) return "";

  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    query.set(key, String(value));
  });

  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
};

export interface EditablePrompt {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  promptText: string;
  imageUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  categoryId: string;
  modelType: string;
  status: string;
  createdOn: string;
  modifiedOn: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags: Array<
    PromptTagWrapper & {
      id?: string;
      tagId?: string;
    }
  >;
  tips: Array<{ id: string; content: string; createdOn: string }>;
  variations: Array<{ id: string; content: string; createdOn: string }>;
}

export type EditablePromptResponse = ApiResponse<{ prompt: EditablePrompt }>;

export interface PromptMutationPayload {
  title: string;
  promptText: string;
  categoryId: string;
  shortDescription?: string;
  description?: string;
  modelType?: string;
  tags?: string[];
  tips?: string[];
  variations?: string[];
  metaTitle?: string;
  metaDescription?: string;
  image?: File | null;
}

export type PromptMutationResponse = ApiResponse<{ prompt: EditablePrompt }>;

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

const appendPromptFormData = (payload: PromptMutationPayload) => {
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
    variations: payload.variations?.map((variation) => variation.trim()) ?? [],
    metaTitle: payload.metaTitle?.trim() ?? "",
    metaDescription: payload.metaDescription?.trim() ?? "",
  };

  formData.append("data", JSON.stringify(serializedPayload));

  if (payload.image) {
    formData.append("image", payload.image);
  }

  return formData;
};

export const server = {
  getPromptBySlug: async (slug: string): Promise<PromptDetailApiResponse> => {
    const res = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/prompts/${slug}`,
      await getServerFetchOptions(300),
    );
    if (!res.ok) return errorResponse();
    return res.json();
  },

  listPrompts: async (
    params?: PromptListParams,
  ): Promise<PromptListApiResponse> => {
    const res = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/prompts${buildQueryString(params)}`,
      await getServerFetchOptions(60),
    );
    if (!res.ok) return errorResponse();
    return res.json();
  },

  getTrendingPrompts: (params?: Omit<PromptListParams, "sortBy">) =>
    server.listPrompts({ ...params, sortBy: "trending" }),
};

export const client = {
  listPrompts: async (
    params?: PromptListParams,
  ): Promise<PromptListApiResponse> => apiClient.get("/prompts", { params }),

  getPromptBySlug: async (slug: string): Promise<PromptDetailApiResponse> =>
    apiClient.get(`/prompts/${slug}`),

  getTrendingPrompts: async (
    params?: Omit<PromptListParams, "sortBy">,
  ): Promise<PromptListApiResponse> =>
    apiClient.get("/prompts", {
      params: { ...params, sortBy: "trending" },
    }),

  getEditablePrompt: async (id: string): Promise<EditablePromptResponse> =>
    apiClient.get(`/prompts/${id}/edit`),

  createPrompt: async (data: unknown): Promise<PromptMutationResponse> =>
    apiClient.post(
      "/prompts",
      data instanceof FormData
        ? data
        : appendPromptFormData(data as PromptMutationPayload),
    ),

  updatePrompt: async (
    id: string,
    data: unknown,
  ): Promise<PromptMutationResponse> =>
    apiClient.patch(
      `/prompts/${id}`,
      data instanceof FormData
        ? data
        : appendPromptFormData(data as PromptMutationPayload),
    ),

  deletePrompt: async (id: string): Promise<ApiResponse<null>> =>
    apiClient.delete(`/prompts/${id}`),

  likePrompt: async (id: string): Promise<ApiResponse<null>> =>
    apiClient.post(`/prompts/${id}/likes`),

  unlikePrompt: async (id: string): Promise<ApiResponse<null>> =>
    apiClient.delete(`/prompts/${id}/likes`),

  savePrompt: async (id: string): Promise<ApiResponse<null>> =>
    apiClient.post(`/prompts/${id}/favorites`),

  unsavePrompt: async (id: string): Promise<ApiResponse<null>> =>
    apiClient.delete(`/prompts/${id}/favorites`),

  copyPrompt: async (
    id: string,
  ): Promise<ApiResponse<{ promptText: string }>> =>
    apiClient.post(`/prompts/${id}/copies`),
};
