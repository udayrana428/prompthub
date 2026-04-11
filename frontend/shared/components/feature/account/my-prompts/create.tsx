"use client";

import { FieldArray, Form, Formik, useField, type FormikErrors } from "formik";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Plus, Save, Sparkles, Trash2, WandSparkles } from "lucide-react";
import { categoryApi } from "@/shared/api";
import {
  useCreatePrompt,
  useEditablePrompt,
  useUpdatePrompt,
} from "../hooks/use-account";
import { createFormikValidator, scrollToFirstError } from "@/shared/lib/formik";
import { appToast } from "@/shared/lib/toastify/toast";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  FormikInputField,
  FormikTextareaField,
} from "@/shared/components/ui/formik-field";
import { PromptImageUploader } from "./image-uploader";
import { FormikErrorScroller } from "@/shared/components/common/common-components/formik-error-scroller";

const modelOptions = [
  { value: "DALL_E", label: "DALL-E" },
  { value: "STABLE_DIFFUSION", label: "Stable Diffusion" },
  { value: "MIDJOURNEY", label: "MidJourney" },
  { value: "GEMINI", label: "Gemini" },
  { value: "OTHER", label: "Other" },
] as const;

const promptSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters.")
    .max(255),
  categoryId: z.string().trim().min(1, "Category is required."),
  modelType: z.string().trim().min(1, "Model type is required."),
  shortDescription: z
    .string()
    .trim()
    .max(500, "Short description is too long."),
  description: z.string().trim(),
  promptText: z
    .string()
    .trim()
    .min(20, "Prompt text should be at least 20 characters."),
  tagsText: z.string().trim(),
  tips: z.array(
    z.string().trim().max(280, "Each tip must be 280 characters or fewer."),
  ),
  variations: z.array(
    z
      .string()
      .trim()
      .max(280, "Each variation must be 280 characters or fewer."),
  ),
  image: z.instanceof(File).nullable().optional(),
});

type PromptFormValues = z.infer<typeof promptSchema>;

const parseTags = (value: string) =>
  Array.from(
    new Set(
      value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ).slice(0, 10);

function PromptSelectField({
  name,
  label,
  placeholder,
  options,
}: {
  name: string;
  label: string;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
}) {
  const [field, meta, helpers] = useField<string>(name);
  const message =
    meta.touched && typeof meta.error === "string" ? meta.error : null;

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Select
        value={field.value}
        onValueChange={(value) => helpers.setValue(value)}
      >
        <SelectTrigger id={name} className="w-full" aria-invalid={!!message}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {message ? <p className="text-sm text-destructive">{message}</p> : null}
    </div>
  );
}

function DynamicListField({
  name,
  label,
  placeholder,
}: {
  name: "tips" | "variations";
  label: string;
  placeholder: string;
}) {
  const [field, meta] = useField<string[]>(name);
  const error =
    meta.touched && typeof meta.error === "string" ? meta.error : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
      </div>
      <FieldArray name={name}>
        {({ push, remove }) => (
          <div className="space-y-3">
            {field.value.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                No {label.toLowerCase()} added yet.
              </div>
            ) : null}
            {field.value.map((_, index) => (
              <div key={`${name}-${index}`} className="flex gap-2">
                <FormikInputField
                  name={`${name}.${index}`}
                  placeholder={placeholder}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => push("")}>
              <Plus className="mr-2 h-4 w-4" />
              Add {label.slice(0, -1)}
            </Button>
          </div>
        )}
      </FieldArray>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

interface PromptEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promptId?: string | null;
}

export function PromptEditorModal({
  open,
  onOpenChange,
  promptId,
}: PromptEditorModalProps) {
  const isEditMode = !!promptId;
  const createPrompt = useCreatePrompt();
  const updatePrompt = useUpdatePrompt();
  const { data: editablePromptResponse, isLoading: isPromptLoading } =
    useEditablePrompt(promptId ?? undefined, open && isEditMode);

  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useQuery(
    {
      queryKey: ["categories", "editor-options"],
      queryFn: () =>
        categoryApi.client.listCategories({
          page: 1,
          limit: 100,
          isActive: true,
        }),
      staleTime: 1000 * 60 * 10,
    },
  );

  const editablePrompt = editablePromptResponse?.data.prompt;
  const categories = categoriesResponse?.data.data ?? [];
  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    [categories],
  );

  const initialValues: PromptFormValues = {
    title: editablePrompt?.title ?? "",
    categoryId: editablePrompt?.categoryId ?? "",
    modelType: editablePrompt?.modelType ?? "OTHER",
    shortDescription: editablePrompt?.shortDescription ?? "",
    description: editablePrompt?.description ?? "",
    promptText: editablePrompt?.promptText ?? "",
    tagsText: editablePrompt?.tags.map((tag) => tag.tag.name).join(", ") ?? "",
    tips: editablePrompt?.tips.map((tip) => tip.content) ?? [],
    variations:
      editablePrompt?.variations.map((variation) => variation.content) ?? [],
    image: null,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-radix-dialog-content
        className="max-h-[92vh] overflow-y-auto sm:max-w-4xl"
      >
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Update Prompt" : "Create a New Prompt"}
          </DialogTitle>
          <DialogDescription>
            Build a complete prompt entry with image, metadata, and reusable
            prompt variants.
          </DialogDescription>
        </DialogHeader>

        {isEditMode && isPromptLoading ? (
          <div className="rounded-lg border border-border p-6 text-sm text-muted-foreground">
            Loading prompt details...
          </div>
        ) : (
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validate={(values) => {
              const errors = createFormikValidator<PromptFormValues>(
                promptSchema,
              )(values) as FormikErrors<PromptFormValues>;
              const parsedTags = parseTags(values.tagsText);

              if (parsedTags.length === 0) {
                errors.tagsText = "Add at least one tag.";
              }

              const hasExistingImage = !!editablePrompt?.imageUrl;
              if (!values.image && (!isEditMode || !hasExistingImage)) {
                errors.image = "Prompt image is required.";
              }

              if (values.image && values.image.size > 2 * 1024 * 1024) {
                errors.image = "Image must be 2MB or smaller.";
              }

              if (
                values.image &&
                !["image/jpeg", "image/png", "image/webp"].includes(
                  values.image.type,
                )
              ) {
                errors.image = "Only PNG, JPG, and WebP images are allowed.";
              }

              return errors;
            }}
            onSubmit={async (values, helpers) => {
              const payload = {
                title: values.title,
                categoryId: values.categoryId,
                modelType: values.modelType,
                shortDescription: values.shortDescription,
                description: values.description,
                promptText: values.promptText,
                tags: parseTags(values.tagsText),
                tips: values.tips.map((tip) => tip.trim()).filter(Boolean),
                variations: values.variations
                  .map((variation) => variation.trim())
                  .filter(Boolean),
                image: values.image ?? null,
              };

              try {
                if (isEditMode && promptId) {
                  console.log("payloaddddddddd", payload);
                  await updatePrompt.mutateAsync({ id: promptId, payload });
                  appToast.success("Prompt updated successfully.");
                } else {
                  await createPrompt.mutateAsync(payload);
                  appToast.success("Prompt submitted successfully.");
                }

                helpers.resetForm();
                onOpenChange(false);
              } catch (err: any) {
                if (err?.errors?.length > 0) {
                  err?.errors[0]?.message &&
                    appToast.error(err?.errors[0]?.message);
                } else if (err?.message) {
                  appToast.error(
                    err?.message ||
                      `Prompt could not be ${isEditMode ? "updated" : "created"}.`,
                  );
                }
              } finally {
                helpers.setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, values, errors, setFieldValue, resetForm }) => (
              <Form className="space-y-6" noValidate>
                <FormikErrorScroller />
                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-6">
                    <FormikInputField
                      name="title"
                      label="Prompt Title"
                      placeholder="Cinematic monsoon chai stall in Mumbai"
                    />
                    <div className="grid gap-6 md:grid-cols-2">
                      <PromptSelectField
                        name="categoryId"
                        label="Category"
                        placeholder={
                          isCategoriesLoading
                            ? "Loading categories..."
                            : "Select category"
                        }
                        options={categoryOptions}
                      />
                      <PromptSelectField
                        name="modelType"
                        label="Model"
                        placeholder="Select model"
                        options={modelOptions.map((option) => ({
                          value: option.value,
                          label: option.label,
                        }))}
                      />
                    </div>
                    <FormikTextareaField
                      name="shortDescription"
                      label="Short Description"
                      rows={3}
                      placeholder="A concise summary that helps users understand what this prompt creates."
                    />
                    <FormikTextareaField
                      name="description"
                      label="Detailed Description"
                      rows={4}
                      placeholder="Add any extra context, style notes, or usage guidance for this prompt."
                    />
                    <FormikTextareaField
                      name="promptText"
                      label="Prompt Text"
                      rows={8}
                      placeholder="Write the full prompt exactly as users should copy it."
                    />
                    <FormikInputField
                      name="tagsText"
                      label="Tags"
                      placeholder="cinematic, monsoon, street photography, chai"
                      description="Separate tags with commas. Up to 10 tags."
                    />
                    <div className="grid gap-6 lg:grid-cols-2">
                      <DynamicListField
                        name="tips"
                        label="Tips"
                        placeholder="Example: Increase stylization for richer lighting."
                      />
                      <DynamicListField
                        name="variations"
                        label="Variations"
                        placeholder="Example: Swap Mumbai street for Delhi market."
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div
                      id="image"
                      className="rounded-xl border border-border bg-card p-4"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <WandSparkles className="h-4 w-4 text-primary" />
                        <p className="font-medium text-card-foreground">
                          Prompt Cover *
                        </p>
                      </div>
                      <PromptImageUploader
                        value={values.image ?? null}
                        existingImageUrl={editablePrompt?.imageUrl}
                        onChange={(file) => void setFieldValue("image", file)}
                      />
                      {typeof errors.image === "string" ? (
                        <p className="mt-2 text-sm text-destructive">
                          {errors.image}
                        </p>
                      ) : !editablePrompt?.imageUrl ? (
                        <p className="mt-2 text-sm text-muted-foreground">
                          Upload a required cover image before saving this
                          prompt.
                        </p>
                      ) : null}
                    </div>

                    <div className="rounded-xl border border-border bg-muted/30 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <p className="font-medium text-foreground">
                          Publishing flow
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        New and updated prompts go through moderation and will
                        appear as pending until review completes.
                      </p>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      onOpenChange(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      createPrompt.isPending ||
                      updatePrompt.isPending
                    }
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ||
                    createPrompt.isPending ||
                    updatePrompt.isPending
                      ? isEditMode
                        ? "Updating..."
                        : "Saving..."
                      : isEditMode
                        ? "Update Prompt"
                        : "Save Prompt"}
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        )}
      </DialogContent>
    </Dialog>
  );
}
