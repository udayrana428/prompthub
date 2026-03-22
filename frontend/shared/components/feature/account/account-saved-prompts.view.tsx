"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Bookmark, Copy, ExternalLink, Share } from "lucide-react";
import { promptApi } from "@/shared/api";
import { env } from "@/shared/lib/env";
import { ROUTES } from "@/shared/lib/routes";
import { useSavedPrompts } from "./hooks/use-account";

const AccountSavedPromptsPage = () => {
  const [search, setSearch] = useState("");
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const { data, isLoading } = useSavedPrompts({ page: 1, limit: 24 });
  const savedPrompts = data?.data.data ?? [];

  const filteredPrompts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return savedPrompts;

    return savedPrompts.filter(({ prompt }) => {
      const authorName =
        prompt.createdBy.profile?.displayName || prompt.createdBy.username;

      return [prompt.title, prompt.shortDescription, prompt.category.name, authorName]
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          Saved Prompts ({data?.data.pagination.total ?? 0})
        </h2>
        <div className="flex gap-2">
          <Input
            placeholder="Search saved prompts..."
            className="w-64"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Loading your saved prompts...
          </CardContent>
        </Card>
      ) : filteredPrompts.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            No saved prompts match your search yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrompts.map(({ id, createdOn, prompt }) => (
            <Card
              key={id}
              className="group transition-all duration-200 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {prompt.category.name}
                  </Badge>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Bookmark className="h-4 w-4 fill-current text-primary" />
                  </Button>
                </div>

                <h3 className="mb-3 line-clamp-2 font-semibold text-card-foreground">
                  {prompt.title}
                </h3>

                <div className="mb-4 rounded-lg bg-background p-3">
                  <p className="line-clamp-3 text-sm text-foreground">
                    {prompt.shortDescription || "No description available."}
                  </p>
                </div>

                <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
                  <Link
                    href={ROUTES.PROFILE(prompt.createdBy.slug)}
                    className="transition-colors hover:text-primary"
                  >
                    by{" "}
                    {prompt.createdBy.profile?.displayName ||
                      prompt.createdBy.username}
                  </Link>
                  <span>Saved {new Date(createdOn).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => void handleCopyPrompt(prompt.id)}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    {copiedPromptId === prompt.id ? "Copied" : "Copy"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void handleSharePrompt(prompt.slug)}
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/prompts/${prompt.slug}`}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountSavedPromptsPage;
