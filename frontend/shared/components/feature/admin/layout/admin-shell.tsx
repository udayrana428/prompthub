"use client";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";
// import { requireAdminServer } from "@/shared/lib/auth";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  // const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  // const router = useRouter();

  // useEffect(() => {
  //   if (!isAuthenticated || !isAdmin(user?.roles)) {
  //     router.replace("/");
  //   }
  // }, [isAuthenticated]);

  // if (!isAuthenticated) return <PageLoader />;

  // await requireAdminServer(); // redirects to / if not admin

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header — fixed at top, never scrolls */}
      <div className="shrink-0 z-40 border-b border-border bg-background">
        <AdminHeader />
      </div>

      {/* Body row — fills remaining height, nothing overflows out */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar slot — reserves width, sidebar scrolls independently */}
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

        {/* Main content — scrolls independently, sidebar never moves */}
        <main className="flex-1 overflow-y-auto min-w-0">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
