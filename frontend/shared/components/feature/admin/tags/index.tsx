"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export function TagsIndex() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Tags</h1>
        <p className="text-sm text-muted-foreground">
          Tag administration will follow the same view/create/detail/edit route
          structure next.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Admin module placeholder</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          The page is wired into the new feature-admin layer so the overall
          admin app remains consistent while prompt management leads the
          migration.
        </CardContent>
      </Card>
    </div>
  );
}
