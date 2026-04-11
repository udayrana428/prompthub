"use client";

import { FieldArray, Form, Formik, useField, type FormikErrors } from "formik";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  ArrowLeft,
  Plus,
  Save,
  Sparkles,
  Trash2,
  WandSparkles,
} from "lucide-react";
import { categoryApi } from "@/shared/api";
import type { AdminPromptFormPayload } from "@/shared/api/modules/admin-prompt.api";
import {
  useAdminPromptDetail,
  useCreateAdminPrompt,
  useUpdateAdminPrompt,
} from "./hooks/use-admin-prompts";
import { createFormikValidator } from "@/shared/lib/formik";
import { appToast } from "@/shared/lib/toastify/toast";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import {
  FormikInputField,
  FormikTextareaField,
} from "@/shared/components/ui/formik-field";
import { PromptImageUploader } from "@/shared/components/feature/account/my-prompts/image-uploader";
import { FormikErrorScroller } from "@/shared/components/common/common-components/formik-error-scroller";
import { ROUTES } from "@/shared/lib/routes";

const modelOptions = [
  { value: "DALL_E", label: "DALL-E" },
  { value: "STABLE_DIFFUSION", label: "Stable Diffusion" },
  { value: "MIDJOURNEY", label: "MidJourney" },
  { value: "GEMINI", label: "Gemini" },
  { value: "OTHER", label: "Other" },
] as const;

const statusOptions = [
  { value: "APPROVED", label: "Approved" },
  { value: "PENDING", label: "Pending review" },
  { value: "REJECTED", label: "Rejected" },
  { value: "ARCHIVED", label: "Archived" },
  { value: "DRAFT", label: "Draft" },
] as const;

const promptSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters.")
    .max(255),
  categoryId: z.string().trim().min(1, "Category is required."),
  modelType: z.string().trim().min(1, "Model type is required."),
  status: z.string().trim().min(1, "Status is required."),
  featured: z.boolean(),
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
  rejectionReason: z.string().trim().max(255, "Rejection reason is too long."),
  metaTitle: z.string().trim().max(255, "Meta title is too long."),
  metaDescription: z.string().trim().max(500, "Meta description is too long."),
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

function PromptSwitchField({
  name,
  label,
  description,
}: {
  name: string;
  label: string;
  description: string;
}) {
  const [field, , helpers] = useField<boolean>(name);

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-muted/30 p-4">
      <div className="space-y-1">
        <Label htmlFor={name}>{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch
        id={name}
        checked={field.value}
        onCheckedChange={(checked) => helpers.setValue(checked)}
      />
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
      <Label>{label}</Label>
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

export function PromptCreate({ id }: { id?: string }) {
  const isEditMode = !!id;
  const router = useRouter();
  const createPrompt = useCreateAdminPrompt();
  const updatePrompt = useUpdateAdminPrompt();
  const { data: editablePromptResponse, isLoading: isPromptLoading } =
    useAdminPromptDetail(id);

  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useQuery(
    {
      queryKey: ["categories", "admin-editor-options"],
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
    status: editablePrompt?.status ?? "APPROVED",
    featured: editablePrompt?.featured ?? false,
    shortDescription: editablePrompt?.shortDescription ?? "",
    description: editablePrompt?.description ?? "",
    promptText: editablePrompt?.promptText ?? "",
    tagsText: editablePrompt?.tags.map((tag) => tag.tag.name).join(", ") ?? "",
    rejectionReason: editablePrompt?.rejectionReason ?? "",
    metaTitle: editablePrompt?.metaTitle ?? "",
    metaDescription: editablePrompt?.metaDescription ?? "",
    tips: editablePrompt?.tips.map((tip) => tip.content) ?? [],
    variations:
      editablePrompt?.variations.map((variation) => variation.content) ?? [],
    image: null,
  };

  if (isEditMode && isPromptLoading) {
    return (
      <div className="rounded-lg border border-border p-6 text-sm text-muted-foreground">
        Loading prompt details...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Button
            type="button"
            variant="ghost"
            className="px-0 text-muted-foreground"
            onClick={() => router.push(ROUTES.ADMIN.PROMPTS)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to prompts
          </Button>
          <h1 className="text-3xl font-semibold text-foreground">
            {isEditMode ? "Edit Prompt" : "Create Prompt"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage publish state, featured placement, and the complete prompt
            payload from one place.
          </p>
        </div>
      </div>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validate={(values) => {
          const errors = createFormikValidator<PromptFormValues>(promptSchema)(
            values,
          ) as FormikErrors<PromptFormValues>;
          const parsedTags = parseTags(values.tagsText);

          if (parsedTags.length === 0)
            errors.tagsText = "Add at least one tag.";

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

          if (values.status === "REJECTED" && !values.rejectionReason.trim()) {
            errors.rejectionReason =
              "Add a rejection reason for rejected prompts.";
          }

          return errors;
        }}
        onSubmit={async (values, helpers) => {
          const payload: AdminPromptFormPayload = {
            title: values.title,
            categoryId: values.categoryId,
            modelType: values.modelType,
            status: values.status,
            featured: values.featured,
            shortDescription: values.shortDescription,
            description: values.description,
            promptText: values.promptText,
            tags: parseTags(values.tagsText),
            tips: values.tips.map((tip) => tip.trim()).filter(Boolean),
            variations: values.variations
              .map((variation) => variation.trim())
              .filter(Boolean),
            image: values.image ?? null,
            rejectionReason: values.rejectionReason,
            metaTitle: values.metaTitle,
            metaDescription: values.metaDescription,
          };

          try {
            const response =
              isEditMode && id
                ? await updatePrompt.mutateAsync({ id, payload })
                : await createPrompt.mutateAsync(payload);

            appToast.success(
              isEditMode
                ? "Prompt updated successfully."
                : "Prompt created successfully.",
            );

            router.push(`/admin/prompts/${response.data.prompt.id}`);
          } catch (err: any) {
            const message =
              err?.errors?.[0]?.message ||
              err?.message ||
              `Prompt could not be ${isEditMode ? "updated" : "created"}.`;
            appToast.error(message);
          } finally {
            helpers.setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, values, errors, setFieldValue }) => (
          <Form className="space-y-6" noValidate>
            <FormikErrorScroller />
            <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Prompt content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormikInputField
                      name="title"
                      label="Prompt title"
                      placeholder="Cinematic monsoon chai stall in Mumbai"
                    />

                    <div className="grid gap-6 md:grid-cols-3">
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
                      <PromptSelectField
                        name="status"
                        label="Workflow status"
                        placeholder="Select status"
                        options={statusOptions.map((option) => ({
                          value: option.value,
                          label: option.label,
                        }))}
                      />
                    </div>

                    <FormikTextareaField
                      name="shortDescription"
                      label="Short description"
                      rows={3}
                      placeholder="A concise summary that helps users understand what this prompt creates."
                    />

                    <FormikTextareaField
                      name="description"
                      label="Detailed description"
                      rows={4}
                      placeholder="Add extra context, style notes, or usage guidance for this prompt."
                    />

                    <FormikTextareaField
                      name="promptText"
                      label="Prompt text"
                      rows={10}
                      placeholder="Write the full prompt exactly as users should copy it."
                    />

                    <FormikInputField
                      name="tagsText"
                      label="Tags"
                      placeholder="cinematic, monsoon, street photography, chai"
                      description="Separate tags with commas. Up to 10 tags."
                    />

                    {values.status === "REJECTED" ? (
                      <FormikTextareaField
                        name="rejectionReason"
                        label="Rejection reason"
                        rows={3}
                        placeholder="Explain why this prompt was rejected."
                      />
                    ) : null}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Prompt extras</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-6 lg:grid-cols-2">
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
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cover image</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="mb-3 flex items-center gap-2">
                      <WandSparkles className="h-4 w-4 text-primary" />
                      <p className="font-medium text-card-foreground">
                        Prompt image *
                      </p>
                    </div>
                    <PromptImageUploader
                      value={values.image ?? null}
                      existingImageUrl={editablePrompt?.imageUrl}
                      onChange={(file) => void setFieldValue("image", file)}
                    />
                    {typeof errors.image === "string" ? (
                      <p className="text-sm text-destructive">{errors.image}</p>
                    ) : !editablePrompt?.imageUrl ? (
                      <p className="text-sm text-muted-foreground">
                        Upload a required cover image before saving this prompt.
                      </p>
                    ) : null}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Publishing controls</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <PromptSwitchField
                      name="featured"
                      label="Feature this prompt"
                      description="Featured prompts can be surfaced in premium admin-curated spaces."
                    />
                    <div className="rounded-xl border border-border bg-muted/30 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <p className="font-medium text-foreground">
                          SEO metadata
                        </p>
                      </div>
                      <div className="space-y-4">
                        <FormikInputField
                          name="metaTitle"
                          label="Meta title"
                          placeholder="Optional custom SEO title"
                        />
                        <FormikTextareaField
                          name="metaDescription"
                          label="Meta description"
                          rows={3}
                          placeholder="Optional custom SEO description"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push(
                    isEditMode && id
                      ? `/admin/prompts/${id}`
                      : ROUTES.ADMIN.PROMPTS,
                  )
                }
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
                    : "Create Prompt"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
