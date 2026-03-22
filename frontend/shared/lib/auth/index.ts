"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/shared/redux/hooks";

export function useRequireAuth(redirectTo = "/login") {
  const { isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isInitialized, redirectTo, router]);

  return {
    isAuthenticated,
    isInitialized,
  };
}
