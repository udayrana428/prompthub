"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import { cn } from "@/shared/lib/utils";
import { useAppSelector } from "@/shared/redux/hooks";
import { PageLoader } from "@/shared/components/common/common-components/page-loader";
import { ROUTES } from "@/shared/lib/routes";

const ADMIN_ROLES = new Set(["SUPER_ADMIN", "ADMIN", "MODERATOR"]);

const isAdminUser = (roles?: string[] | null) =>
  Array.isArray(roles) && roles.some((role) => ADMIN_ROLES.has(role));

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAppSelector(
    (state) => state.auth,
  );

  const isLoginPage = pathname === ROUTES.ADMIN.LOGIN;
  const hasAdminAccess = useMemo(() => isAdminUser(user?.roles), [user?.roles]);

  useEffect(() => {
    if (!isInitialized) return;

    if (isLoginPage) {
      if (isAuthenticated && hasAdminAccess) {
        router.replace(ROUTES.ADMIN.ROOT);
      }
      return;
    }

    if (!isAuthenticated) {
      router.replace(
        `${ROUTES.ADMIN.LOGIN}?next=${encodeURIComponent(pathname || ROUTES.ADMIN.ROOT)}`,
      );
      return;
    }

    if (!hasAdminAccess) {
      router.replace(ROUTES.HOME);
    }
  }, [
    hasAdminAccess,
    isAuthenticated,
    isInitialized,
    isLoginPage,
    pathname,
    router,
  ]);

  if (!isInitialized) {
    return <PageLoader />;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAuthenticated || !hasAdminAccess) {
    return <PageLoader />;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="shrink-0 z-40 border-b border-border bg-background">
        <AdminHeader />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div
          className={cn(
            "relative shrink-0 transition-all duration-300 ease-in-out",
            collapsed ? "w-16" : "w-64",
          )}
        >
          <AdminSidebar
            collapsed={collapsed}
            onToggle={() => setCollapsed((p) => !p)}
          />
        </div>

        <main className="flex-1 overflow-y-auto min-w-0">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
