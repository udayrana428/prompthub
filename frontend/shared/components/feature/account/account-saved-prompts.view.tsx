"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  BookmarkX,
  Check,
  Copy,
  ExternalLink,
  Heart,
  Eye,
  LoaderCircle,
  MessageSquare,
  Search,
  Share2,
  ArrowLeft,
  CalendarDays,
} from "lucide-react";
import { promptApi } from "@/shared/api";
import { env } from "@/shared/lib/env";
import { ROUTES } from "@/shared/lib/routes";
import { formatModelLabel } from "@/shared/lib/utils";
import { appToast } from "@/shared/lib/toastify/toast";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { useIsMobile } from "@/shared/components/ui/use-mobile";
import {
  flattenInfiniteItems,
  getInfiniteTotal,
  useSavedPrompts,
  useUnsavePrompt,
} from "./hooks/use-account";
import { AccountPromptPreviewCard } from "./components/account-prompt-preview-card";
import { AccountPromptStatusBadge } from "./components/account-prompt-status-badge";
import { AccountPromptActionMenu } from "./components/account-prompt-action-menu";
import type { FavoritePrompt } from "@/shared/api/modules/user.api";

// ─── Mobile Feed View ────────────────────────────────────────────────────────

function MobileSavedFeedView({
  savedPrompts,
  focusedId,
  hasNextPage,
  isFetchingNextPage,
  copiedPromptId,
  onLoadMore,
  onBack,
  onCopy,
  onShare,
  onUnsave,
}: {
  savedPrompts: FavoritePrompt[];
  focusedId: string;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  copiedPromptId: string | null;
  onLoadMore: () => void;
  onBack: () => void;
  onCopy: (promptId: string) => void;
  onShare: (slug: string) => void;
  onUnsave: (promptId: string) => void;
}) {
  const focusedRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    focusedRef.current?.scrollIntoView({ behavior: "instant", block: "start" });
  }, []);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      { rootMargin: "250px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-sm font-semibold text-foreground">Saved Prompts</h2>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 p-4">
          {savedPrompts.map(({ id, createdOn, prompt }) => (
            <div key={id} ref={id === focusedId ? focusedRef : null}>
              <Card className="overflow-hidden rounded-2xl border border-border bg-card">
                {/* Image */}
                <div className="relative aspect-square bg-black">
                  {prompt.imageUrl && (
                    <Image
                      src={prompt.imageUrl}
                      alt=""
                      fill
                      className="object-cover blur-2xl brightness-50 opacity-60"
                      aria-hidden
                    />
                  )}
                  <Image
                    src={prompt.imageUrl || "/img/placeholder.svg"}
                    alt={prompt.title}
                    fill
                    className="object-contain p-4"
                  />
                  <div className="absolute left-3 top-3">
                    <AccountPromptStatusBadge
                      status={prompt.status}
                      className="border-transparent bg-background/90 text-xs backdrop-blur-sm"
                    />
                  </div>
                  <div
                    className="absolute right-3 top-3 z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <AccountPromptActionMenu
                      title={prompt.title}
                      actions={[
                        {
                          label:
                            copiedPromptId === prompt.id
                              ? "Copied!"
                              : "Copy prompt text",
                          icon: copiedPromptId === prompt.id ? Check : Copy,
                          onSelect: () => onCopy(prompt.id),
                        },
                        {
                          label: "Share prompt",
                          icon: Share2,
                          onSelect: () => onShare(prompt.slug),
                        },
                        {
                          label: "Open prompt",
                          icon: ExternalLink,
                          href: ROUTES.PROMPT(prompt.slug),
                        },
                        {
                          label: "Remove from saved",
                          icon: BookmarkX,
                          destructive: true,
                          onSelect: () => onUnsave(prompt.id),
                        },
                      ]}
                    />
                  </div>
                </div>

                {/* Details */}
                <CardContent className="p-4 py-0">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                      {formatModelLabel(prompt.modelType)}
                    </Badge>
                    <Badge variant="secondary">{prompt.category.name}</Badge>
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-foreground line-clamp-1">
                    {prompt.title}
                  </h3>
                  {prompt.shortDescription && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {prompt.shortDescription}
                    </p>
                  )}
                  <div className="mt-1 text-xs text-muted-foreground">
                    by{" "}
                    <Link
                      href={ROUTES.PROFILE(prompt.createdBy.slug)}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {prompt.createdBy.profile?.displayName ||
                        prompt.createdBy.username}
                    </Link>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {prompt.viewsCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {prompt.likesCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 ml-auto">
                      <CalendarDays className="h-3 w-3" />
                      Saved {new Date(createdOn).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-3 mb-4 flex gap-2">
                    <Button
                      size="sm"
                      type="button"
                      onClick={() => onCopy(prompt.id)}
                    >
                      {copiedPromptId === prompt.id ? (
                        <Check className="mr-1.5 h-3.5 w-3.5" />
                      ) : (
                        <Copy className="mr-1.5 h-3.5 w-3.5" />
                      )}
                      {copiedPromptId === prompt.id ? "Copied!" : "Copy"}
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={ROUTES.PROMPT(prompt.slug)}>
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                        Open
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      type="button"
                      onClick={() => onShare(prompt.slug)}
                    >
                      <Share2 className="mr-1.5 h-3.5 w-3.5" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}

          <div ref={loadMoreRef} className="h-10 w-full" />

          {isFetchingNextPage && (
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Loading more...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const AccountSavedPromptsPage = () => {
  // 1. STATE
  const [search, setSearch] = useState("");
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [unsavedPromptId, setUnsavedPromptId] = useState<string | null>(null);
  const [feedFocusedId, setFeedFocusedId] = useState<string | null>(null);

  // 2. REFS
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const gridScrollRef = useRef<number>(0);

  // 3. CONTEXT / EXTERNAL HOOKS
  const isMobile = useIsMobile();

  // 4. DATA HOOKS
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSavedPrompts({ limit: 12 });
  const unsavePrompt = useUnsavePrompt();

  // 5. DERIVED STATE
  const savedPrompts = flattenInfiniteItems(data?.pages);
  const total = getInfiniteTotal(data?.pages);

  const filteredPrompts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return savedPrompts;
    return savedPrompts.filter(({ prompt }) => {
      const authorName =
        prompt.createdBy.profile?.displayName || prompt.createdBy.username;
      return [
        prompt.title,
        prompt.shortDescription,
        prompt.category.name,
        authorName,
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query));
    });
  }, [savedPrompts, search]);

  // 6. CALLBACKS
  const closeFeedView = useCallback((fromPopState = false) => {
    setFeedFocusedId(null);
    if (!fromPopState && window.history.state?.feedFocusedId) {
      window.history.back();
    }
    requestAnimationFrame(() => {
      window.scrollTo({ top: gridScrollRef.current, behavior: "instant" });
    });
  }, []);

  const openFeedView = useCallback((savedId: string) => {
    gridScrollRef.current = window.scrollY;
    window.history.pushState({ feedFocusedId: savedId }, "");
    setFeedFocusedId(savedId);
  }, []);

  const handleCopyPrompt = useCallback(async (promptId: string) => {
    const response = await promptApi.client.copyPrompt(promptId);
    await navigator.clipboard.writeText(response.data.promptText);
    setCopiedPromptId(promptId);
    window.setTimeout(() => setCopiedPromptId(null), 2000);
  }, []);

  const handleSharePrompt = useCallback(async (slug: string) => {
    const url = `${env.NEXT_PUBLIC_APP_URL}/prompts/${slug}`;
    if (navigator.share) {
      await navigator.share({ url });
      return;
    }
    await navigator.clipboard.writeText(url);
    appToast.success("Prompt link copied to clipboard.");
  }, []);

  const handleUnsave = useCallback(
    async (promptId: string) => {
      try {
        await unsavePrompt.mutateAsync(promptId);
        appToast.success("Prompt removed from saved prompts.");
      } catch (err: any) {
        const msg =
          err?.errors?.[0]?.message ||
          err?.message ||
          "We could not remove this prompt from saved prompts.";
        appToast.error(msg);
      } finally {
        setUnsavedPromptId(null);
      }
    },
    [unsavePrompt],
  );

  // 7. EFFECTS
  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void fetchNextPage();
      },
      { rootMargin: "250px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const handlePopState = () => {
      if (feedFocusedId) closeFeedView(true);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [feedFocusedId, closeFeedView]);

  // 8. EARLY RETURNS — after all hooks
  if (isMobile && feedFocusedId) {
    return (
      <>
        <MobileSavedFeedView
          savedPrompts={filteredPrompts}
          focusedId={feedFocusedId}
          hasNextPage={!!hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          copiedPromptId={copiedPromptId}
          onLoadMore={() => fetchNextPage()}
          onBack={() => closeFeedView(false)}
          onCopy={(promptId) => void handleCopyPrompt(promptId)}
          onShare={(slug) => void handleSharePrompt(slug)}
          onUnsave={(promptId) => setUnsavedPromptId(promptId)}
        />

        <AlertDialog
          open={!!unsavedPromptId}
          onOpenChange={(open) => {
            if (!open) setUnsavedPromptId(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove this saved prompt?</AlertDialogTitle>
              <AlertDialogDescription>
                This prompt will be removed from your saved list. You can always
                save it again later from the prompt page.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  unsavedPromptId
                    ? void handleUnsave(unsavedPromptId)
                    : undefined
                }
                disabled={unsavePrompt.isPending}
              >
                {unsavePrompt.isPending ? "Removing..." : "Remove"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // 9. MAIN RENDER
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Saved Prompts ({total})
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Keep a visual shortlist, then open the selected prompt when you
              want the full context and actions.
            </p>
          </div>
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search saved prompts..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Loading your saved prompts...
        </div>
      ) : filteredPrompts.length === 0 ? (
        <Card className="rounded-2xl border-dashed">
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <div className="rounded-full bg-primary/10 p-4 text-primary">
              <Bookmark className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {search
                  ? "No saved prompts match your search"
                  : "No saved prompts yet"}
              </h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                {search
                  ? "Try a different keyword or keep scrolling to load more."
                  : "Save prompts from the public feed so you can revisit them here later."}
              </p>
            </div>
            <Button asChild>
              <Link href={ROUTES.PROMPTS}>Browse Prompts</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Grid — 2 cols mobile, 3 cols desktop */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {filteredPrompts.map(({ id, createdOn, prompt }) => (
              <AccountPromptPreviewCard
                key={id}
                title={prompt.title}
                imageUrl={prompt.imageUrl}
                modelType={prompt.modelType}
                status={prompt.status}
                createdLabel={`Saved ${new Date(createdOn).toLocaleDateString()}`}
                viewsCount={prompt.viewsCount}
                likesCount={prompt.likesCount}
                onCardClick={isMobile ? () => openFeedView(id) : undefined}
                actions={[
                  {
                    label:
                      copiedPromptId === prompt.id
                        ? "Copied!"
                        : "Copy prompt text",
                    icon: copiedPromptId === prompt.id ? Check : Copy,
                    onSelect: () => void handleCopyPrompt(prompt.id),
                  },
                  {
                    label: "Share prompt",
                    icon: Share2,
                    onSelect: () => void handleSharePrompt(prompt.slug),
                  },
                  {
                    label: "Open prompt",
                    icon: ExternalLink,
                    href: ROUTES.PROMPT(prompt.slug),
                  },
                  {
                    label: "Remove from saved",
                    icon: BookmarkX,
                    destructive: true,
                    onSelect: () => setUnsavedPromptId(prompt.id),
                  },
                ]}
              />
            ))}
          </div>

          {/* Sentinel */}
          <div
            ref={loadMoreRef}
            className="flex min-h-10 items-center justify-center"
          >
            {isFetchingNextPage ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Loading more saved prompts...
              </div>
            ) : hasNextPage ? (
              <span className="text-xs text-muted-foreground">
                Scroll down to load more saved prompts
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                You have reached the end of your saved prompts.
              </span>
            )}
          </div>
        </>
      )}

      {/* Unsave dialog */}
      <AlertDialog
        open={!!unsavedPromptId}
        onOpenChange={(open) => {
          if (!open) setUnsavedPromptId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this saved prompt?</AlertDialogTitle>
            <AlertDialogDescription>
              This prompt will be removed from your saved list. You can always
              save it again later from the prompt page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                unsavedPromptId ? void handleUnsave(unsavedPromptId) : undefined
              }
              disabled={unsavePrompt.isPending}
            >
              {unsavePrompt.isPending ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AccountSavedPromptsPage;
