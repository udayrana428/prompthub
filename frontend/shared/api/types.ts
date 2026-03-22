// shared/api/types.ts

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ← meta added to match backend list response
export interface PaginatedData<T> {
  data: T[];
  pagination: Pagination;
  meta: ListPageMeta;
}

export interface ListPageMeta {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string; // optional — search pages don't have canonical
  noIndex: boolean;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

// Helper for failed server-side fetches
export const errorResponse = (message = "Request failed") => ({
  success: false as const,
  message,
  statusCode: 500,
  data: null as any,
});
