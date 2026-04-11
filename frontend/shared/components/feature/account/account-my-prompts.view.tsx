"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
import {
  Eye,
  Heart,
  Bookmark,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { appToast } from "@/shared/lib/toastify/toast";
import { ROUTES } from "@/shared/lib/routes";
import { formatModelLabel } from "@/shared/lib/utils";
import { useDeletePrompt, useMyPrompts } from "./hooks/use-account";
import { PromptEditorModal } from "./my-prompts/create";

const STATUS_STYLES: Record<
  string,
  {
    label: string;
    variant:
      | "default"
      | "secondary"
      | "outline"
      | "destructive"
      | "warning"
      | "success"
      | "info";
  }
> = {
  APPROVED: { label: "Approved", variant: "success" },
  DRAFT: { label: "Draft", variant: "warning" },
  PENDING: { label: "Pending", variant: "warning" },
  REJECTED: { label: "Rejected", variant: "destructive" },
  ARCHIVED: { label: "Archived", variant: "warning" },
};

const AccountMyPromptsPage = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [deletingPromptId, setDeletingPromptId] = useState<string | null>(null);

  const { data, isLoading } = useMyPrompts({ page: 1, limit: 24 });
  const deletePrompt = useDeletePrompt();
  const prompts = data?.data.data ?? [];
  const total = data?.data.pagination.total ?? 0;

  const openCreateModal = () => {
    setEditingPromptId(null);
    setIsEditorOpen(true);
  };

  const openEditModal = (promptId: string) => {
    setEditingPromptId(promptId);
    setIsEditorOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingPromptId) return;
    try {
      await deletePrompt.mutateAsync(deletingPromptId);
      appToast.success("Prompt deleted successfully.");
    } catch (err: any) {
      if (err?.errors?.length > 0) {
        err?.errors[0]?.message && appToast.error(err?.errors[0]?.message);
      } else if (err?.message) {
        appToast.error(err?.message || "Prompt could not be deleted.");
      }
    } finally {
      setDeletingPromptId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          My Prompts ({total})
        </h2>
        <div className="flex gap-2">
          <Button type="button" onClick={openCreateModal}>
            <Plus className="mr-2 h-4 w-4" />
            Create Prompt
          </Button>
          <Button asChild variant="outline">
            <Link href="/prompts">
              <Sparkles className="mr-2 h-4 w-4" />
              Browse
            </Link>
          </Button>
        </div>
      </div>

      {/* ── States ── */}
      {isLoading ? (
        <div className="text-sm text-muted-foreground">
          Loading your prompts...
        </div>
      ) : prompts.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          You haven't created any prompts yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {prompts.map((prompt) => {
            const status = STATUS_STYLES[prompt.status] ?? {
              label: prompt.status,
              variant: "outline",
            };

            return (
              <Card
                key={prompt.id}
                className="group overflow-hidden border-border bg-card p-0 transition-all duration-200 hover:shadow-lg h-full flex flex-col"
              >
                {/* ── Image ── */}
                <div className="relative aspect-square overflow-hidden bg-black">
                  {prompt.imageUrl && (
                    <Image
                      src={prompt.imageUrl}
                      alt=""
                      fill
                      className="object-cover scale-110 blur-lg brightness-50 opacity-60"
                      aria-hidden
                    />
                  )}
                  <Image
                    src={prompt.imageUrl || "/placeholder.svg"}
                    alt={prompt.title}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                  {/* Top-left: category + model */}
                  <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="text-xs backdrop-blur-sm"
                    >
                      {prompt.category.name}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-background/90 text-xs backdrop-blur-sm"
                    >
                      {formatModelLabel(prompt.modelType)}
                    </Badge>
                  </div>

                  {/* Top-right: status */}
                  <div className="absolute right-3 top-3">
                    <Badge
                      variant={status.variant}
                      className="text-xs backdrop-blur-sm"
                    >
                      {status.label}
                    </Badge>
                  </div>

                  {/* Bottom-left: created date */}
                  <div className="absolute bottom-3 left-3">
                    <span className="text-xs text-white/80">
                      Created {new Date(prompt.createdOn).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* ── Body ── */}
                <CardContent className="p-3 flex flex-col flex-grow">
                  <Link href={ROUTES.PROMPT(prompt.slug)}>
                    <h3 className="mb-2 cursor-pointer font-semibold text-card-foreground transition-colors group-hover:text-primary line-clamp-2">
                      {prompt.title}
                    </h3>
                  </Link>

                  <p className="mb-3 line-clamp-3 text-sm text-muted-foreground flex-grow">
                    {prompt.shortDescription || "No description provided yet."}
                  </p>

                  <div className="mt-auto space-y-3">
                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {prompt.viewsCount.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {prompt.likesCount.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bookmark className="h-3 w-3" />
                        {prompt.favoritesCount.toLocaleString()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => openEditModal(prompt.id)}
                      >
                        <Pencil className="mr-2 h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Link href={ROUTES.PROMPT(prompt.slug)}>View</Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 px-2.5"
                        onClick={() => setDeletingPromptId(prompt.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Delete confirmation dialog ── */}
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
