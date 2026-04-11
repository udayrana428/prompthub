"use client";

import { Badge } from "@/shared/components/ui/badge";

const statusClasses: Record<string, string> = {
  APPROVED: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  PENDING: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  REJECTED: "bg-rose-100 text-rose-700 hover:bg-rose-100",
  ARCHIVED: "bg-slate-100 text-slate-700 hover:bg-slate-100",
  DRAFT: "bg-blue-100 text-blue-700 hover:bg-blue-100",
};

export function PromptStatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="secondary"
      className={statusClasses[status] ?? "bg-muted text-foreground"}
    >
      {status.replaceAll("_", " ")}
    </Badge>
  );
}
