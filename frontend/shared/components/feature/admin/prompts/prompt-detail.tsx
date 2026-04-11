"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  ExternalLink,
  Eye,
  Heart,
  MessageSquare,
  PenSquare,
  Star,
  Trash2,
} from "lucide-react";
import { ROUTES } from "@/shared/lib/routes";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
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
import {
  useAdminPromptDetail,
  useDeleteAdminPrompt,
  useToggleAdminPromptFeatured,
  useUpdateAdminPromptStatus,
} from "./hooks/use-admin-prompts";
import { PromptStatusBadge } from "./components/prompt-status-badge";

export function PromptDetail({ id }: { id: string }) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data, isLoading, isError } = useAdminPromptDetail(id);
  const deletePrompt = useDeleteAdminPrompt();
  const updateStatus = useUpdateAdminPromptStatus();
  const toggleFeatured = useToggleAdminPromptFeatured();

  const prompt = data?.data.prompt;

  const handleStatusUpdate = async (status: string) => {
    if (!prompt) return;

    try {
      await updateStatus.mutateAsync({
        id: prompt.id,
        status,
        rejectionReason:
          status === "REJECTED"
            ? prompt.rejectionReason || "Rejected by admin."
            : "",
      });
      appToast.success(`Prompt moved to ${status.toLowerCase()}.`);
    } catch (error: any) {
      appToast.error(
        error?.errors?.[0]?.message ||
          error?.message ||
          "Status update failed.",
      );
    }
  };

  const handleDelete = async () => {
    if (!prompt) return;

    try {
      await deletePrompt.mutateAsync(prompt.id);
      appToast.success("Prompt deleted successfully.");
      setDeleteOpen(false);
      router.push(ROUTES.ADMIN.PROMPTS);
    } catch (error: any) {
      appToast.error(
        error?.errors?.[0]?.message ||
          error?.message ||
          "Prompt could not be deleted.",
      );
    }
  };

  const handleFeaturedToggle = async () => {
    if (!prompt) return;

    try {
      await toggleFeatured.mutateAsync({
        id: prompt.id,
        featured: !prompt.featured,
      });
      appToast.success(
        prompt.featured
          ? "Prompt removed from featured."
          : "Prompt marked as featured.",
      );
    } catch (error: any) {
      appToast.error(
        error?.errors?.[0]?.message ||
          error?.message ||
          "Featured state could not be updated.",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border p-6 text-sm text-muted-foreground">
        Loading prompt details...
      </div>
    );
  }

  if (isError || !prompt) {
    return (
      <div className="rounded-lg border border-border p-6 text-sm text-destructive">
        Prompt details could not be loaded.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-2">
          <Button
            type="button"
            variant="ghost"
            className="px-0 text-muted-foreground"
            onClick={() => router.push(ROUTES.ADMIN.PROMPTS)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to prompts
          </Button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold text-foreground">
              {prompt.title}
            </h1>
            <PromptStatusBadge status={prompt.status} />
            {prompt.featured ? <Badge>Featured</Badge> : null}
          </div>
          <p className="max-w-3xl text-sm text-muted-foreground">
            {prompt.shortDescription || "No short description added yet."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href={ROUTES.PROMPT(prompt.slug)} target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open public page
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/admin/prompts/${prompt.id}/edit`}>
              <PenSquare className="mr-2 h-4 w-4" />
              Edit prompt
            </Link>
          </Button>
          <Button variant="outline" onClick={handleFeaturedToggle}>
            <Star className="mr-2 h-4 w-4" />
            {prompt.featured ? "Remove featured" : "Feature prompt"}
          </Button>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete prompt
          </Button>
          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this prompt?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will archive the prompt from the platform and remove it
                  from admin listings.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete prompt
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-hidden rounded-xl border border-border bg-black">
                <img
                  src={prompt.imageUrl || "/placeholder.svg"}
                  alt={prompt.title}
                  className="h-[420px] w-full object-contain"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prompt body</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">
                  Description
                </p>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {prompt.description || "No long-form description added."}
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">
                  Prompt text
                </p>
                <pre className="overflow-x-auto rounded-xl border border-border bg-muted/30 p-4 text-sm whitespace-pre-wrap text-foreground">
                  {prompt.promptText}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips and variations</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Tips</p>
                {prompt.tips.length ? (
                  prompt.tips.map((tip) => (
                    <div
                      key={tip.id}
                      className="rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground"
                    >
                      {tip.content}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No tips added.
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">
                  Variations
                </p>
                {prompt.variations.length ? (
                  prompt.variations.map((variation) => (
                    <div
                      key={variation.id}
                      className="rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground"
                    >
                      {variation.content}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No variations added.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Prompt overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Author</span>
                <Link
                  href={ROUTES.PROFILE(prompt.createdBy.slug)}
                  className="font-medium text-foreground hover:text-primary"
                >
                  {prompt.createdBy.profile?.displayName ||
                    prompt.createdBy.username}
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium text-foreground">
                  {prompt.createdBy.email}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium text-foreground">
                  {prompt.category.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Model</span>
                <span className="font-medium text-foreground">
                  {prompt.modelType.replaceAll("_", " ")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium text-foreground">
                  {format(new Date(prompt.createdOn), "dd MMM yyyy, hh:mm a")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last updated</span>
                <span className="font-medium text-foreground">
                  {format(new Date(prompt.modifiedOn), "dd MMM yyyy, hh:mm a")}
                </span>
              </div>
              {prompt.rejectionReason ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                  <p className="mb-1 font-medium">Rejection reason</p>
                  <p>{prompt.rejectionReason}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Engagement</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  Views
                </div>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {prompt.viewsCount.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  Likes
                </div>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {prompt.likesCount.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  Comments
                </div>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {prompt.commentsCount.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4" />
                  Saves
                </div>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {prompt.favoritesCount.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags and publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {prompt.tags.length ? (
                  prompt.tags.map(({ tag }) => (
                    <Badge key={tag.id} variant="outline">
                      #{tag.name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No tags added.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate("APPROVED")}
                >
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate("PENDING")}
                >
                  Mark pending
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate("REJECTED")}
                >
                  Reject
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate("ARCHIVED")}
                >
                  Archive
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
