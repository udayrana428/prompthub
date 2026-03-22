"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import { appToast } from "@/shared/lib/toastify/toast";
import {
  useDeletePrompt,
  useMyPrompts,
} from "./hooks/use-account";
import { PromptEditorModal } from "./my-prompts/create";

const AccountMyPromptsPage = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const { data, isLoading } = useMyPrompts({ page: 1, limit: 12 });
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

  return (
    <div className="space-y-4">
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
              Browse Prompts
            </Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Loading your prompts...
          </CardContent>
        </Card>
      ) : prompts.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            You have not created any prompts yet.
          </CardContent>
        </Card>
      ) : (
        prompts.map((prompt) => (
          <Card
            key={prompt.id}
            className="transition-all duration-200 hover:shadow-lg"
          >
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 lg:flex-row">
                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {prompt.category.name}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {prompt.status}
                    </Badge>
                  </div>

                  <h3 className="mb-3 text-xl font-semibold text-card-foreground">
                    {prompt.title}
                  </h3>

                  <div className="mb-4 rounded-lg bg-background p-3">
                    <p className="line-clamp-3 text-sm text-foreground">
                      {prompt.shortDescription || "No description provided yet."}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Best with: {prompt.modelType}</span>
                    <span>
                      Uploaded {new Date(prompt.createdOn).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0 lg:w-48">
                  <div className="mb-4 grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-foreground">
                        {prompt.viewsCount.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-foreground">
                        {prompt.likesCount}
                      </div>
                      <div className="text-xs text-muted-foreground">Likes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-foreground">
                        {prompt.favoritesCount}
                      </div>
                      <div className="text-xs text-muted-foreground">Saves</div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => openEditModal(prompt.id)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Prompt
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full"
                  >
                    <Link href={`/prompts/${prompt.slug}`}>View Prompt</Link>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full text-destructive hover:text-destructive"
                    disabled={deletePrompt.isPending}
                    onClick={async () => {
                      const confirmed = window.confirm(
                        "Delete this prompt? This will archive it from your account view.",
                      );

                      if (!confirmed) {
                        return;
                      }

                      try {
                        await deletePrompt.mutateAsync(prompt.id);
                        appToast.success("Prompt deleted successfully.");
                      } catch (error: any) {
                        appToast.error(
                          error?.message || "Prompt could not be deleted.",
                        );
                      }
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Prompt
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <PromptEditorModal
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        promptId={editingPromptId}
      />
    </div>
  );
};

export default AccountMyPromptsPage;
