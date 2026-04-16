"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils";

interface ExpandableTextProps {
  text: string;
  maxLines?: number; // default clamp
  className?: string;
  textClassName?: string;
}

export function ExpandableText({
  text,
  maxLines = 4,
  className,
  textClassName,
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={cn("space-y-2", className)}>
      <p
        className={cn(
          "font-mono text-sm leading-relaxed text-foreground",
          !expanded && `line-clamp-${maxLines}`,
          textClassName,
        )}
      >
        {text}
      </p>

      {text.length > 200 && ( // prevent showing button for small text
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="text-sm font-medium text-primary hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
