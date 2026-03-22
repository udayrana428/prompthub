"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bookmark,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import { authApi } from "@/shared/api";
import { useAppDispatch, useAppSelector } from "@/shared/redux/hooks";
import { clearAuth } from "@/shared/redux/slices/auth.slice";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
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
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ThemeToggle } from "@/shared/components/common/theme-toggle";

export function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isAuthenticated, isInitialized, user } = useAppSelector(
    (state) => state.auth,
  );

  const displayName =
    user?.profile?.displayName?.trim() || user?.username || "Account";
  const avatarUrl = user?.profile?.avatarUrl ?? undefined;
  const avatarFallback = displayName.charAt(0).toUpperCase() || "A";

  const submitSearch = () => {
    const query = search.trim();
    router.push(
      query ? `/prompts?search=${encodeURIComponent(query)}` : "/prompts",
    );
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await authApi.logout();
    } catch {
      // Clear client state even if the server session is already gone.
    } finally {
      dispatch(clearAuth());
      setIsLoggingOut(false);
      router.push("/login");
      router.refresh();
    }
  };

  const renderDesktopAuth = () => {
    if (!isInitialized) {
      return (
        <div className="hidden items-center gap-3 md:flex">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
        </div>
      );
    }

    if (!isAuthenticated || !user) {
      return (
        <>
          <Button asChild variant="ghost" size="sm" className="hidden md:flex">
            <Link href="/login">
              <User className="mr-2 h-4 w-4" />
              Sign In
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/login">Get Started</Link>
          </Button>
        </>
      );
    }

    return (
      <>
        <Button asChild variant="ghost" size="sm" className="hidden md:flex">
          <Link href="/account">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            My Account
          </Link>
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
                  @{user.username}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" inPortal className="w-56">
            <DropdownMenuLabel>
              <div className="space-y-1">
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/account">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Overview
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account/my-prompts">
                <Sparkles className="mr-2 h-4 w-4" />
                My Prompts
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account/saved-prompts">
                <Bookmark className="mr-2 h-4 w-4" />
                Saved Prompts
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
              disabled={isLoggingOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isLoggingOut ? "Signing out..." : "Sign Out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  };

  const renderMobileMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" inPortal className="w-56">
        <DropdownMenuItem asChild>
          <Link href="/prompts">Browse Prompts</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/blog">Blog</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {!isInitialized ? (
          <div className="space-y-2 p-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : isAuthenticated && user ? (
          <>
            <DropdownMenuLabel>
              <div className="space-y-1">
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground">
                  @{user.username}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/account">My Account</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account/my-prompts">My Prompts</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account/saved-prompts">Saved Prompts</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                void handleLogout();
              }}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Signing out..." : "Sign Out"}
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href="/login" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/login">Get Started</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">
              PromptHub
            </span>
          </Link>

          <div className="mx-8 hidden max-w-md flex-1 md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search prompts..."
                className="border-border bg-input pl-10"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") submitSearch();
                }}
              />
            </div>
          </div>

          <nav className="hidden items-center space-x-6 md:flex">
            <Link
              href="/prompts"
              className="text-foreground transition-colors hover:text-primary"
            >
              Browse Prompts
            </Link>
            <Link
              href="/blog"
              className="text-foreground transition-colors hover:text-primary"
            >
              Blog
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {renderDesktopAuth()}
            {renderMobileMenu()}
          </div>
        </div>

        <div className="pb-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search prompts..."
              className="border-border bg-input pl-10"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") submitSearch();
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
