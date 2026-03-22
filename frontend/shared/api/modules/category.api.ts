import apiClient from "../client";
import { env } from "@/shared/lib/env";
import { errorResponse } from "../types";
import type { ApiResponse, PaginatedData } from "../types";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  isSystem: boolean;
  parentId: string | null;
  parent: { id: string; name: string; slug: string } | null;
  children: Array<{ id: string; name: string; slug: string }>;
  createdOn: string;
}

export interface CategoryListParams {
  page?: number;
  limit?: number;
  search?: string;
  parentId?: string | "null";
  isActive?: boolean;
}

export type CategoryListApiResponse = ApiResponse<PaginatedData<CategoryItem>>;

const buildQueryString = (params?: CategoryListParams) => {
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
  listCategories: async (
    params?: CategoryListParams,
  ): Promise<CategoryListApiResponse> => {
    const res = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/categories${buildQueryString(params)}`,
      { next: { revalidate: 300 } },
    );

    if (!res.ok) return errorResponse();
    return res.json();
  },
};

export const client = {
  listCategories: async (
    params?: CategoryListParams,
  ): Promise<CategoryListApiResponse> =>
    apiClient.get("/categories", { params }),
};
