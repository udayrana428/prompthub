"use client";

import Image from "next/image";
import { Bookmark, Eye, Heart, MessageSquare } from "lucide-react";
import { cn, formatModelLabel } from "@/shared/lib/utils";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import {
  AccountPromptAction,
  AccountPromptActionMenu,
} from "./account-prompt-action-menu";
import { AccountPromptStatusBadge } from "./account-prompt-status-badge";

export function AccountPromptPreviewCard({
  title,
  imageUrl,
  modelType,
  status,
  createdLabel,
  viewsCount,
  likesCount,
  commentsCount,
  favoritesCount,
  onCardClick,
  actions,
}: {
  title: string;
  imageUrl: string | null;
  modelType: string;
  status: string;
  createdLabel: string;
  viewsCount: number;
  likesCount: number;
  commentsCount?: number;
  favoritesCount?: number;
  onCardClick?: () => void;
  actions: AccountPromptAction[];
}) {
  return (
    <Card
      className="group overflow-hidden rounded-2xl border border-border bg-card p-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      role={onCardClick ? "button" : undefined}
      tabIndex={onCardClick ? 0 : undefined}
      onClick={onCardClick}
      onKeyDown={(e) => {
        if (onCardClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onCardClick();
        }
      }}
    >
      <div className="relative aspect-square overflow-hidden bg-black">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover scale-110 blur-lg brightness-50 opacity-60"
            aria-hidden
          />
        ) : null}
        <Image
          src={imageUrl || "/img/placeholder.svg"}
          alt={title}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute left-3 top-3 hidden md:block">
          <AccountPromptStatusBadge
            status={status}
            className="border-transparent bg-background/90 text-xs backdrop-blur-sm"
          />
        </div>

        <div
          className="absolute right-3 top-3 z-10 hidden md:block"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <AccountPromptActionMenu title={title} actions={actions} />
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4 hidden md:block">
          <div className="mb-2">
            <Badge variant="secondary" className="text-xs backdrop-blur-sm">
              {formatModelLabel(modelType)}
            </Badge>
          </div>
          <h3 className="line-clamp-2 font-semibold text-white">{title}</h3>
          <p className="mt-1 text-xs text-white/80">{createdLabel}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/90">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {viewsCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {likesCount.toLocaleString()}
            </span>
            {typeof commentsCount === "number" ? (
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {commentsCount.toLocaleString()}
              </span>
            ) : null}
            {typeof favoritesCount === "number" ? (
              <span className="flex items-center gap-1">
                <Bookmark className="h-3 w-3" />
                {favoritesCount.toLocaleString()}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}
