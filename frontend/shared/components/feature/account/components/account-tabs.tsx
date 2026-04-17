"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Badge } from "@/shared/components/ui/badge";
import { useNotifications } from "@/shared/components/feature/notification/hooks/use-notifications";
import { ROUTES } from "@/shared/lib/routes";

const AccountTabs = () => {
  const pathname = usePathname();
  const notificationsQuery = useNotifications(
    { page: 1, limit: 1 },
    { refetchInterval: 30000 },
  );

  const tabs = [
    { label: "Overview", href: "/account" },
    { label: "Saved", href: "/account/saved-prompts" },
    { label: "My Prompts", href: "/account/my-prompts" },
    { label: "Settings", href: "/account/settings" },
  ];
  return (
    <div className="flex border-b mb-6">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium",
            pathname === tab.href
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
};

export default AccountTabs;
