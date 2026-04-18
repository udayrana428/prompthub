"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  Eye,
  Heart,
  LoaderCircle,
  MessageSquare,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
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
import { appToast } from "@/shared/lib/toastify/toast";
import { ROUTES } from "@/shared/lib/routes";
import { formatModelLabel } from "@/shared/lib/utils";
import { useIsMobile } from "@/shared/components/ui/use-mobile";
import {
  flattenInfiniteItems,
  getInfiniteTotal,
  useDeletePrompt,
  useMyPrompts,
} from "./hooks/use-account";
import { PromptEditorModal } from "./my-prompts/create";
import { AccountPromptPreviewCard } from "./components/account-prompt-preview-card";
import { AccountPromptStatusBadge } from "./components/account-prompt-status-badge";
import { AccountPromptActionMenu } from "./components/account-prompt-action-menu";
import type { UserPrompt } from "@/shared/api/modules/user.api";

const STATUS_FILTERS = [
  { label: "All", value: "ALL" },
  { label: "Drafts", value: "DRAFT" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
] as const;

// ─── Mobile Feed View ────────────────────────────────────────────────────────

function MobileFeedView({
  prompts,
  focusedId,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onBack,
  onEdit,
  onDelete,
  deletingPromptId,
}: {
  prompts: UserPrompt[];
  focusedId: string;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  onBack: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  deletingPromptId: string | null;
}) {
  const focusedRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Scroll focused card into view on mount
  useEffect(() => {
    focusedRef.current?.scrollIntoView({ behavior: "instant", block: "start" });
  }, []);

  // Infinite scroll
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
        <h2 className="text-sm font-semibold text-foreground">My Prompts</h2>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 p-4">
          {prompts.map((prompt) => (
            <div
              key={prompt.id}
              ref={prompt.id === focusedId ? focusedRef : null}
            >
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
                          label: "Edit prompt",
                          icon: Pencil,
                          onSelect: () => onEdit(prompt.id),
                        },
                        {
                          label: "Open prompt",
                          icon: Sparkles,
                          href: ROUTES.PROMPT(prompt.slug),
                        },
                        {
                          label: "Delete prompt",
                          icon: Trash2,
                          destructive: true,
                          onSelect: () => onDelete(prompt.id),
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
                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {prompt.viewsCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {prompt.likesCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {prompt.commentsCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bookmark className="h-3 w-3" />
                      {prompt.favoritesCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 ml-auto">
                      <CalendarDays className="h-3 w-3" />
                      {new Date(prompt.createdOn).toLocaleDateString()}
                    </span>
                  </div>
                  {/* <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      type="button"
                      onClick={() => onEdit(prompt.id)}
                    >
                      <Pencil className="mr-1.5 h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={ROUTES.PROMPT(prompt.slug)}>View</Link>
                    </Button>
                  </div> */}
                  {prompt.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {prompt.tags.slice(0, 6).map(({ tag }) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="text-xs"
                        >
                          #{tag.name}
                        </Badge>
                      ))}
                      {prompt.tags.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{prompt.tags.length - 6}
                        </Badge>
                      )}
                    </div>
                  )}
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

const AccountMyPromptsPage = () => {
  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_FILTERS)[number]["value"]>("ALL");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [deletingPromptId, setDeletingPromptId] = useState<string | null>(null);
  const [feedFocusedId, setFeedFocusedId] = useState<string | null>(null);

  const isMobile = useIsMobile();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const gridScrollRef = useRef<number>(0);

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useMyPrompts({
      limit: 12,
      status: statusFilter === "ALL" ? undefined : statusFilter,
    });

  const deletePrompt = useDeletePrompt();
  const prompts = flattenInfiniteItems(data?.pages);
  const total = getInfiniteTotal(data?.pages);

  // Replace setFeedFocusedId(prompt.id) calls with this:
  const openFeedView = (promptId: string) => {
    gridScrollRef.current = window.scrollY; // save current scroll
    window.history.pushState({ feedFocusedId: promptId }, ""); // push fake history entry
    setFeedFocusedId(promptId);
  };

  const closeFeedView = useCallback((fromPopState = false) => {
    setFeedFocusedId(null);
    if (!fromPopState && window.history.state?.feedFocusedId) {
      window.history.back();
    }
    requestAnimationFrame(() => {
      window.scrollTo({ top: gridScrollRef.current, behavior: "instant" });
    });
  }, []); // no deps needed since it only touches refs and state setters

  const openCreateModal = () => {
    setEditingPromptId(null);
    setIsEditorOpen(true);
  };

  const openEditModal = (promptId: string) => {
    setEditingPromptId(promptId);
    setIsEditorOpen(true);
  };

  // Grid infinite scroll
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
      // If we're in feed view and user hits back, close it instead
      if (feedFocusedId) closeFeedView(true);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [feedFocusedId, closeFeedView]);

  const handleDelete = async () => {
    if (!deletingPromptId) return;
    try {
      await deletePrompt.mutateAsync(deletingPromptId);
      appToast.success("Prompt deleted successfully.");
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.message ||
        err?.message ||
        "Prompt could not be deleted.";
      appToast.error(msg);
    } finally {
      setDeletingPromptId(null);
    }
  };

  // Mobile feed view
  if (isMobile && feedFocusedId) {
    return (
      <>
        <MobileFeedView
          prompts={prompts}
          focusedId={feedFocusedId}
          hasNextPage={!!hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
          onBack={() => closeFeedView(false)}
          onEdit={(id) => {
            closeFeedView();
            openEditModal(id);
          }}
          onDelete={(id) => setDeletingPromptId(id)}
          deletingPromptId={deletingPromptId}
        />

        {/* Delete dialog still accessible from feed */}
        <AlertDialog
          open={!!deletingPromptId}
          onOpenChange={(open) => {
            if (!open) setDeletingPromptId(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this prompt?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove the prompt. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDelete}
                disabled={deletePrompt.isPending}
              >
                {deletePrompt.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              My Prompts ({total})
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse your drafts, reviewed prompts, and anything still moving
              through moderation.
            </p>
          </div>
          <Button type="button" onClick={openCreateModal}>
            <Plus className="mr-2 h-4 w-4" />
            Create Prompt
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <Button
              key={filter.value}
              type="button"
              variant={statusFilter === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Loading your prompts...
        </div>
      ) : prompts.length === 0 ? (
        <Card className="rounded-2xl border-dashed">
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <div className="rounded-full bg-primary/10 p-4 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                No prompts here yet
              </h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                {statusFilter === "ALL"
                  ? "Start with a draft or submit a finished prompt for review."
                  : `You do not have any ${statusFilter.toLowerCase()} prompts right now.`}
              </p>
            </div>
            <Button type="button" onClick={openCreateModal}>
              <Plus className="mr-2 h-4 w-4" />
              Create Prompt
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Grid — 2 cols mobile, 3 cols desktop */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {prompts.map((prompt) => (
              <AccountPromptPreviewCard
                key={prompt.id}
                title={prompt.title}
                imageUrl={prompt.imageUrl}
                modelType={prompt.modelType}
                status={prompt.status}
                createdLabel={`Created ${new Date(prompt.createdOn).toLocaleDateString()}`}
                viewsCount={prompt.viewsCount}
                likesCount={prompt.likesCount}
                commentsCount={prompt.commentsCount}
                favoritesCount={prompt.favoritesCount}
                // Mobile only: tap card → feed view
                onCardClick={
                  isMobile ? () => openFeedView(prompt.id) : undefined
                }
                actions={[
                  {
                    label: "Edit prompt",
                    icon: Pencil,
                    onSelect: () => openEditModal(prompt.id),
                  },
                  {
                    label: "Open prompt",
                    icon: Sparkles,
                    href: ROUTES.PROMPT(prompt.slug),
                  },
                  {
                    label: "Delete prompt",
                    icon: Trash2,
                    destructive: true,
                    onSelect: () => setDeletingPromptId(prompt.id),
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
                Loading more prompts...
              </div>
            ) : hasNextPage ? (
              <span className="text-xs text-muted-foreground">
                Scroll down to load more
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                You have reached the end of your prompt library.
              </span>
            )}
          </div>
        </>
      )}

      {/* Delete dialog */}
      <AlertDialog
        open={!!deletingPromptId}
        onOpenChange={(open) => {
          if (!open) setDeletingPromptId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this prompt?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the prompt from your account. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={deletePrompt.isPending}
            >
              {deletePrompt.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PromptEditorModal
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        promptId={editingPromptId}
      />
    </div>
  );
};

export default AccountMyPromptsPage;
