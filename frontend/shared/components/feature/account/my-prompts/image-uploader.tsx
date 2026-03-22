"use client";

import { useEffect, useState } from "react";
import { ImagePlus, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface ImageUploaderProps {
  value: File | null;
  existingImageUrl?: string | null;
  onChange: (file: File | null) => void;
}

export function PromptImageUploader({
  value,
  existingImageUrl,
  onChange,
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingImageUrl ?? null);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(existingImageUrl ?? null);
      return;
    }

    const objectUrl = URL.createObjectURL(value);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [existingImageUrl, value]);

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "rounded-xl border border-dashed border-border bg-muted/30 p-4",
          previewUrl ? "space-y-4" : "flex flex-col items-center justify-center gap-3",
        )}
      >
        {previewUrl ? (
          <>
            <div className="overflow-hidden rounded-lg border border-border bg-background">
              <img
                src={previewUrl}
                alt="Prompt preview"
                className="h-56 w-full object-cover"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0] ?? null;
                    onChange(file);
                    event.currentTarget.value = "";
                  }}
                />
                <Button type="button" variant="outline" asChild>
                  <span>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Replace Image
                  </span>
                </Button>
              </label>
              <Button type="button" variant="outline" onClick={() => onChange(null)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Selection
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="rounded-full bg-background p-3 text-primary">
              <ImagePlus className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">Upload a prompt cover image</p>
              <p className="mt-1 text-sm text-muted-foreground">
                PNG, JPG, or WebP up to 2MB.
              </p>
            </div>
            <label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0] ?? null;
                  onChange(file);
                  event.currentTarget.value = "";
                }}
              />
              <Button type="button" variant="outline" asChild>
                <span>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Choose Image
                </span>
              </Button>
            </label>
          </>
        )}
      </div>
    </div>
  );
}
