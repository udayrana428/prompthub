"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  Flag,
  Tags,
  DollarSign,
  BarChart3,
  Bell,
  FileCheck,
  Home,
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Prompt Management",
    href: "/admin/prompts",
    icon: FileText,
  },
  {
    title: "Reports & Moderation",
    href: "/admin/reports",
    icon: Flag,
  },
  {
    title: "Categories & Tags",
    href: "/admin/categories",
    icon: Tags,
  },
  {
    title: "Monetization",
    href: "/admin/monetization",
    icon: DollarSign,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    title: "Audit Logs",
    href: "/admin/audit",
    icon: FileCheck,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-muted/30 border-r border-border min-h-screen">
      <div className="p-6">
        <div className="space-y-2">
          <Link
            href="/"
            className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <Home className="h-4 w-4" />
            <span>Back to Site</span>
          </Link>

          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
