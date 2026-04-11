"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export function ReportsIndex() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground">
          Moderation and reports can now be upgraded into the same pattern after
          prompt management.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Admin module placeholder</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          This route is intentionally kept lightweight for now so it no longer
          imports removed legacy admin components.
        </CardContent>
      </Card>
    </div>
  );
}
