// **"Why shared/lib/errors/?"**
// Without it every hook has its own `error.message ?? "Something went wrong"` scattered everywhere. One place, one fix.

import { ApiError } from "@/shared/api/types";

// shared/lib/errors/index.ts
export const parseApiError = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "message" in error) {
    return (error as ApiError).message;
  }
  return "Something went wrong. Please try again.";
};

export const isAuthError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "statusCode" in error &&
  (error as ApiError).statusCode === 401;
