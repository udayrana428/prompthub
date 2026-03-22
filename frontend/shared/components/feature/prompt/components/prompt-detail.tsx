"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Calendar,
  Copy,
  Eye,
  Heart,
  Lightbulb,
  Shuffle,
  Users,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import type { PromptDetail as PromptDetailType } from "../types";
import {
  useCopyPrompt,
  useToggleFavoritePrompt,
  useToggleLikePrompt,
} from "../hooks/use-prompts";
import { ROUTES } from "@/shared/lib/routes";
import { formatModelLabel } from "@/shared/lib/utils";
import { useAppSelector } from "@/shared/redux/hooks";
import { appToast } from "@/shared/lib/toastify/toast";

interface PromptDetailProps {
  prompt: PromptDetailType;
}

export function PromptDetail({ prompt }: PromptDetailProps) {
  const [copied, setCopied] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const likePrompt = useToggleLikePrompt();
  const favoritePrompt = useToggleFavoritePrompt();
  const copyPrompt = useCopyPrompt();

  const authorName =
    prompt.createdBy.profile?.displayName || prompt.createdBy.username;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.promptText);
    copyPrompt.mutate(prompt.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      appToast.info("Sign in to save prompts.");
      return;
    }

    favoritePrompt.mutate({
      id: prompt.id,
      isFavorited: prompt.isFavorited,
    });
  };

  const handleToggleLike = () => {
    if (!isAuthenticated) {
      appToast.info("Sign in to like prompts.");
      return;
    }

    likePrompt.mutate({
      id: prompt.id,
      isLiked: prompt.isLiked,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/">Home</Link> / <Link href="/prompts">Prompts</Link> /{" "}
          <Link href={`/prompts?category=${prompt.category.slug}`}>
            {prompt.category.name}
          </Link>{" "}
          / <span className="text-foreground">{prompt.title}</span>
        </nav>

        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="secondary">{prompt.category.name}</Badge>
            <Badge variant="outline">
              {formatModelLabel(prompt.modelType)}
            </Badge>
          </div>

          <h1 className="mb-4 text-3xl font-bold text-foreground text-balance lg:text-4xl">
            {prompt.title}
          </h1>

          <p className="mb-6 text-lg text-muted-foreground">
            {prompt.description || prompt.shortDescription}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Link
                href={ROUTES.PROFILE(prompt.createdBy.slug)}
                className="flex items-center gap-3 rounded-md transition-colors hover:text-primary"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={
                      prompt.createdBy.profile?.avatarUrl || "/placeholder.svg"
                    }
                    alt={authorName}
                  />
                  <AvatarFallback>{authorName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-foreground">
                    {authorName}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {(
                        prompt.createdBy.profile?.followersCount || 0
                      ).toLocaleString()}{" "}
                      followers
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(prompt.createdOn).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {prompt.viewsCount.toLocaleString()} views
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {prompt.likesCount.toLocaleString()} likes
              </span>
              <span className="flex items-center gap-1">
                <Copy className="h-4 w-4" />
                {prompt.copiesCount.toLocaleString()} copies
              </span>
            </div>
          </div>
        </div>

        <Card className="mb-8 overflow-hidden">
          <div className="relative aspect-[16/10] bg-muted">
            <Image
              src={prompt.imageUrl || "/placeholder.svg"}
              alt={prompt.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-card-foreground">
                AI Prompt
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant={prompt.isFavorited ? "default" : "outline"}
                  size="sm"
                  onClick={handleToggleFavorite}
                  disabled={favoritePrompt.isPending}
                >
                  {prompt.isFavorited ? "Saved" : "Save"}
                </Button>
                <Button
                  variant={prompt.isLiked ? "default" : "outline"}
                  size="sm"
                  onClick={handleToggleLike}
                  disabled={likePrompt.isPending}
                >
                  <Heart
                    className={`h-4 w-4 ${prompt.isLiked ? "fill-current" : ""}`}
                  />
                </Button>
              </div>
            </div>

            <div className="mb-4 rounded-lg border border-border bg-background p-4">
              <p className="font-mono text-sm leading-relaxed text-foreground">
                {prompt.promptText}
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button onClick={handleCopy} className="flex-1" size="lg">
                <Copy className="mr-2 h-4 w-4" />
                {copied ? "Copied!" : "Copy Prompt"}
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Best with:</span>
                <Badge variant="outline">
                  {formatModelLabel(prompt.modelType)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-card-foreground">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {prompt.tags.map(({ tag }) => (
                <Badge key={tag.id} variant="secondary">
                  #{tag.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-card-foreground">
                <Lightbulb className="h-5 w-5 text-primary" />
                Pro Tips
              </h3>
              <ul className="space-y-3">
                {prompt.tips.length > 0 ? (
                  prompt.tips.map((tip) => (
                    <li
                      key={tip.id}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="font-bold text-primary">•</span>
                      <span>{tip.content}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground">
                    No tips added yet.
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-card-foreground">
                <Shuffle className="h-5 w-5 text-primary" />
                Variations
              </h3>
              <div className="space-y-3">
                {prompt.variations.length > 0 ? (
                  prompt.variations.map((variation) => (
                    <div
                      key={variation.id}
                      className="rounded-lg border border-border bg-background p-3"
                    >
                      <p className="line-clamp-2 font-mono text-sm text-foreground">
                        {variation.content}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-6 text-xs"
                        onClick={() =>
                          navigator.clipboard.writeText(variation.content)
                        }
                      >
                        Copy Variation
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No variations added yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
