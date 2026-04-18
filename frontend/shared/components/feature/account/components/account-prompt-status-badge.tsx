"use client";

import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/components/ui/badge";

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  APPROVED: {
    label: "Approved",
    className:
      "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  },
  DRAFT: {
    label: "Draft",
    className:
      "bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400",
  },
  PENDING: {
    label: "Pending",
    className:
      "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
  },
  ARCHIVED: {
    label: "Archived",
    className: "bg-muted text-muted-foreground border-border",
  },
};

export function AccountPromptStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const config = STATUS_STYLES[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground border-border",
  };

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
