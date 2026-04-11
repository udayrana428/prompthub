"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export function CategoriesIndex() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Categories</h1>
        <p className="text-sm text-muted-foreground">
          This module is ready to move into the same admin page pattern next.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Migration note</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          The old category management route wiring has been replaced with the
          new feature-admin surface so the admin app stays build-safe while
          prompt management ships first.
        </CardContent>
      </Card>
    </div>
  );
}
