import type { ApiResponse, PaginatedData } from "@/shared/api/types";

export interface PromptListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tag?: string;
  model?: string;
  sortBy?: "latest" | "popular" | "trending";
}

export interface PromptAuthor {
  id: string;
  username: string;
  slug: string;
  profile: {
    displayName: string | null;
    avatarUrl: string | null;
    followersCount?: number;
  } | null;
}

export interface PromptCategory {
  id: string;
  name: string;
  slug: string;
}

export interface PromptTagWrapper {
  tag: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface PromptTagWrapperDetail {
  id: string;
  promptId: string;
  tagId: string;
  createdOn: string;
  tag: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    status: string;
    promptCount: number;
  };
}

export interface PromptTip {
  id: string;
  content: string;
  createdOn: string;
}

export interface PromptVariation {
  id: string;
  content: string;
  createdOn: string;
}

export interface PromptMeta {
  title: string;
  description: string;
  keywords: string[];
  image: string;
  url: string;
  noIndex: boolean;
}

export interface Prompt {
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
  createdOn: string;
  category: PromptCategory;
  createdBy: PromptAuthor;
  tags: PromptTagWrapper[];
  isLiked: boolean;
  isFavorited: boolean;
}

export interface PromptDetail {
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
  viewsCount: number;
  likesCount: number;
  favoritesCount: number;
  commentsCount: number;
  copiesCount: number;
  reportsCount: number;
  featured: boolean;
  status: string;
  rejectionReason: string | null;
  createdById: string;
  createdOn: string;
  modifiedOn: string;
  modifiedById: string | null;
  deletedOn: string | null;
  deletedById: string | null;
  category: PromptCategory;
  createdBy: PromptAuthor;
  tags: PromptTagWrapperDetail[];
  tips: PromptTip[];
  variations: PromptVariation[];
  isLiked: boolean;
  isFavorited: boolean;
}

export interface PromptDetailData {
  prompt: PromptDetail;
  meta: PromptMeta;
}

export type PromptListApiResponse = ApiResponse<PaginatedData<Prompt>>;
export type PromptDetailApiResponse = ApiResponse<PromptDetailData>;
