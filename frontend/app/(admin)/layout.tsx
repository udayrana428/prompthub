// app/(admin)/admin/layout.tsx
// Keep this as a server component — no "use client" here
import { AdminShell } from "@/shared/components/feature/admin/layout/admin-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
