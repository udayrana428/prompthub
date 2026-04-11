"use client";
import { AdminSidebar } from "@/shared/components/feature/admin/layout/admin-sidebar";
import { AdminHeader } from "@/shared/components/feature/admin/layout/admin-header";
// import { requireAdminServer } from "@/shared/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
