"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LayoutDashboard, LogOut, Settings, Shield } from "lucide-react";
import { authApi } from "@/shared/api";
import { useAppDispatch, useAppSelector } from "@/shared/redux/hooks";
import { clearAuth } from "@/shared/redux/slices/auth.slice";
import { Button } from "@/shared/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ThemeToggle } from "@/shared/components/common/common-components/theme-toggle";
import { ROUTES } from "@/shared/lib/routes";

export function AdminHeader() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const displayName =
    user?.profile?.displayName?.trim() || user?.username || "Admin";
  const avatarUrl = user?.profile?.avatarUrl ?? undefined;
  const avatarFallback = displayName.charAt(0).toUpperCase() || "A";

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Clear client state even if session is already gone.
    } finally {
      dispatch(clearAuth());
      router.push(ROUTES.ADMIN.LOGIN);
      router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={ROUTES.ADMIN.ROOT} className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2 text-primary">
            <Shield className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-foreground">PromptHub Admin</p>
            <p className="text-xs text-muted-foreground">
              Moderation and platform controls
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
            asChild
          >
            <Link href={ROUTES.ADMIN.ROOT}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>

          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 gap-3 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
                <div className="hidden text-left md:block">
                  <p className="text-sm font-medium leading-none">
                    {displayName}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {user?.roles?.[0] ?? "Admin"}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || "admin@prompthub"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/account">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  My account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  void handleLogout();
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
