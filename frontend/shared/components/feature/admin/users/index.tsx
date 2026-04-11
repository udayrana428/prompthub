"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export function UsersIndex() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Users</h1>
        <p className="text-sm text-muted-foreground">
          User management is next in line for the new admin page pattern.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Admin module placeholder</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          The legacy user management import has been removed so the admin shell
          stays stable while we finish the prompt module first.
        </CardContent>
      </Card>
    </div>
  );
}
