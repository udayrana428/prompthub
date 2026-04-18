"use client";

import Link from "next/link";
import { useState } from "react";
import { MoreHorizontal, MoreVertical } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useIsMobile } from "@/shared/components/ui/use-mobile";
import { cn } from "@/shared/lib/utils";

export interface AccountPromptAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onSelect?: () => void;
  href?: string;
  destructive?: boolean;
  disabled?: boolean;
}

export function AccountPromptActionMenu({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions: AccountPromptAction[];
  className?: string;
}) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const trigger = (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      className={cn(
        "h-8 w-8 rounded-full bg-transparent backdrop-blur-sm",
        className,
      )}
      aria-label={`Open actions for ${title}`}
    >
      <MoreVertical className="h-4 w-4" />
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen} direction="bottom">
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="max-h-[78vh]">
          <DrawerHeader className="border-b border-border text-left">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>
              {description ?? "Choose what you want to do with this prompt."}
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto p-4">
            <div className="space-y-2">
              {actions.map((action) => {
                const actionContent = (
                  <>
                    <action.icon className="h-4 w-4" />
                    <span>{action.label}</span>
                  </>
                );

                if (action.href) {
                  return (
                    <Button
                      key={action.label}
                      asChild
                      type="button"
                      variant={action.destructive ? "destructive" : "outline"}
                      className="w-full justify-start"
                      disabled={action.disabled}
                    >
                      <Link href={action.href} onClick={() => setOpen(false)}>
                        {actionContent}
                      </Link>
                    </Button>
                  );
                }

                return (
                  <Button
                    key={action.label}
                    type="button"
                    variant={action.destructive ? "destructive" : "outline"}
                    className="w-full justify-start"
                    disabled={action.disabled}
                    onClick={() => {
                      action.onSelect?.();
                      setOpen(false);
                    }}
                  >
                    {actionContent}
                  </Button>
                );
              })}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {actions.map((action, index) => {
          const content = (
            <>
              <action.icon className="h-4 w-4" />
              <span>{action.label}</span>
            </>
          );

          const item = action.href ? (
            <DropdownMenuItem
              key={action.label}
              asChild
              className={cn(action.destructive && "text-destructive")}
              disabled={action.disabled}
            >
              <Link href={action.href}>{content}</Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              key={action.label}
              onSelect={action.onSelect}
              className={cn(action.destructive && "text-destructive")}
              disabled={action.disabled}
            >
              {content}
            </DropdownMenuItem>
          );

          return (
            <div key={action.label}>
              {item}
              {index < actions.length - 1 ? <DropdownMenuSeparator /> : null}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
