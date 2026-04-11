"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
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
  Bookmark,
  BookmarkX,
  Check,
  Copy,
  ExternalLink,
  Share,
} from "lucide-react";
import { promptApi } from "@/shared/api";
import { env } from "@/shared/lib/env";
import { ROUTES } from "@/shared/lib/routes";
import { formatModelLabel } from "@/shared/lib/utils";
import { appToast } from "@/shared/lib/toastify/toast";
import { useSavedPrompts, useUnsavePrompt } from "./hooks/use-account";

const AccountSavedPromptsPage = () => {
  const [search, setSearch] = useState("");
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [unsavedPromptId, setUnsavedPromptId] = useState<string | null>(null);
  const { data, isLoading } = useSavedPrompts({ page: 1, limit: 24 });
  const unsavePrompt = useUnsavePrompt();
  const savedPrompts = data?.data.data ?? [];

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

  const handleCopyPrompt = async (promptId: string) => {
    const response = await promptApi.client.copyPrompt(promptId);
    await navigator.clipboard.writeText(response.data.promptText);
    setCopiedPromptId(promptId);
    window.setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const handleSharePrompt = async (slug: string) => {
    const url = `${env.NEXT_PUBLIC_APP_URL}/prompts/${slug}`;
    if (navigator.share) {
      await navigator.share({ url });
      return;
    }
    await navigator.clipboard.writeText(url);
  };

  const handleUnsave = async (promptId: string) => {
    try {
      setUnsavedPromptId(promptId);
      await unsavePrompt.mutateAsync(promptId);
      appToast.success("Prompt removed from saved prompts.");
    } catch (err: any) {
      if (err?.errors?.length > 0) {
        err?.errors[0]?.message && appToast.error(err?.errors[0]?.message);
      } else if (err?.message) {
        appToast.error(
          err?.message ||
            "We could not remove this prompt from saved prompts..",
        );
      }
    } finally {
      setUnsavedPromptId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          Saved Prompts ({data?.data.pagination.total ?? 0})
        </h2>
        <Input
          placeholder="Search saved prompts..."
          className="w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── States ── */}
      {isLoading ? (
        <div className="text-sm text-muted-foreground">
          Loading your saved prompts...
        </div>
      ) : filteredPrompts.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          {search
            ? "No saved prompts match your search."
            : "You haven't saved any prompts yet."}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPrompts.map(({ id, createdOn, prompt }) => (
            <Card
              key={id}
              className="group overflow-hidden border-border bg-card p-0 transition-all duration-200 hover:shadow-lg h-full flex flex-col"
            >
              {/* ── Image — same pattern as listing card ── */}
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

                {/* Top-left: category + model badges */}
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

                {/* Top-right: unsave button */}
                <div className="absolute right-3 top-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-7 w-7 p-0 backdrop-blur-sm transition-opacity"
                    title="Remove from saved"
                    disabled={
                      unsavePrompt.isPending && unsavedPromptId === prompt.id
                    }
                    onClick={() => setUnsavedPromptId(prompt.id)}
                  >
                    <BookmarkX className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Bottom-left: saved date */}
                <div className="absolute bottom-3 left-3">
                  <span className="text-xs text-white/80 backdrop-blur-sm">
                    Saved {new Date(createdOn).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* ── Card body ── */}
              <CardContent className="p-3 flex flex-col flex-grow">
                <Link href={ROUTES.PROMPT(prompt.slug)}>
                  <h3 className="mb-2 cursor-pointer font-semibold text-card-foreground transition-colors group-hover:text-primary line-clamp-2">
                    {prompt.title}
                  </h3>
                </Link>

                <p className="mb-3 line-clamp-3 text-sm text-muted-foreground flex-grow">
                  {prompt.shortDescription ||
                    "Curated prompt ready for your workflow."}
                </p>

                <div className="mt-auto space-y-3">
                  {/* Author */}
                  <div className="text-xs text-muted-foreground">
                    <Link
                      href={ROUTES.PROFILE(prompt.createdBy.slug)}
                      className="transition-colors hover:text-primary"
                    >
                      by{" "}
                      {prompt.createdBy.profile?.displayName ||
                        prompt.createdBy.username}
                    </Link>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => void handleCopyPrompt(prompt.id)}
                    >
                      {copiedPromptId === prompt.id ? (
                        <Check className="mr-2 h-3.5 w-3.5" />
                      ) : (
                        <Copy className="mr-2 h-3.5 w-3.5" />
                      )}
                      {copiedPromptId === prompt.id ? "Copied!" : "Copy"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void handleSharePrompt(prompt.slug)}
                      title="Share"
                    >
                      <Share className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      title="Open prompt"
                    >
                      <Link href={ROUTES.PROMPT(prompt.slug)}>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
              This prompt will be removed from your saved prompts. You can save
              it again later from the prompt page whenever you want.
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
