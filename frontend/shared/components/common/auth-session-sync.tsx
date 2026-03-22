"use client";

import { useEffect, useRef } from "react";
import { authApi } from "@/shared/api";
import { useAppDispatch, useAppSelector } from "@/shared/redux/hooks";
import {
  clearAuth,
  setAuth,
  setAuthLoading,
  type AuthUser,
} from "@/shared/redux/slices/auth.slice";

const normalizeUser = (user: any): AuthUser => ({
  id: user?.id ?? "",
  username: user?.username ?? "",
  slug: user?.slug ?? "",
  email: user?.email ?? "",
  status: user?.status,
  createdOn: user?.createdOn,
  roles: Array.isArray(user?.roles) ? user.roles : [],
  permissions: Array.isArray(user?.permissions) ? user.permissions : [],
  profile: user?.profile ?? null,
});

export function AuthSessionSync() {
  const dispatch = useAppDispatch();
  const { isInitialized } = useAppSelector((state) => state.auth);
  const hasBootstrapped = useRef(false);

  useEffect(() => {
    if (isInitialized || hasBootstrapped.current) {
      return;
    }

    hasBootstrapped.current = true;
    let isMounted = true;

    const bootstrapSession = async () => {
      dispatch(setAuthLoading(true));

      try {
        const response = await authApi.me();

        if (!isMounted) return;
        dispatch(setAuth({ user: normalizeUser(response.data.user) }));
      } catch {
        if (!isMounted) return;
        dispatch(clearAuth());
      } finally {
        if (isMounted) {
          dispatch(setAuthLoading(false));
        }
      }
    };

    void bootstrapSession();

    return () => {
      isMounted = false;
      if (!isInitialized) {
        hasBootstrapped.current = false; // allow retry on remount in dev
      }
    };
  }, [dispatch, isInitialized]);

  return null;
}
