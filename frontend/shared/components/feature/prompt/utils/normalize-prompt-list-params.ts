import type { PromptListParams } from "../types";

type SearchParamValue = string | string[] | undefined | null;

type SearchParamSource =
  | URLSearchParams
  | {
      get(name: string): string | null;
    }
  | Record<string, SearchParamValue>;

const readValue = (source: SearchParamSource, key: string) => {
  if ("get" in source && typeof source.get === "function") {
    return source.get(key) ?? undefined;
  }

  const value = (source as Record<string, SearchParamValue>)[key];
  return Array.isArray(value) ? value[0] : (value ?? undefined);
};

const toNumber = (value?: string) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const normalizePromptListParams = (
  source: SearchParamSource,
): PromptListParams => ({
  page: toNumber(readValue(source, "page")),
  limit: toNumber(readValue(source, "limit")),
  search: readValue(source, "search") || undefined,
  category: readValue(source, "category") || undefined,
  tag: readValue(source, "tag") || undefined,
  model: readValue(source, "model") || undefined,
  sortBy:
    (readValue(source, "sortBy") as PromptListParams["sortBy"]) || "latest",
});
