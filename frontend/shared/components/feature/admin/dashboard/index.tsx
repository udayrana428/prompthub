"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export function DashboardIndex() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">
          Admin Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          This surface is ready for the rest of the admin modules as we bring
          them into the new route pattern.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin workspace</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Prompt management is the first fully upgraded admin module. The
          remaining modules can now move into the same page/create/detail/edit
          structure cleanly.
        </CardContent>
      </Card>
    </div>
  );
}
