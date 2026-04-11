"use client";

import { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { z } from "zod";
import { Button } from "@/shared/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Camera, Trash2, UploadCloud } from "lucide-react";
import {
  FormikInputField,
  FormikTextareaField,
} from "@/shared/components/ui/formik-field";
import { createFormikValidator } from "@/shared/lib/formik";
import { appToast } from "@/shared/lib/toastify/toast";
import {
  useCurrentAuthUser,
  useCurrentUserProfile,
  useSaveAccountSettings,
  useUpdateAvatar,
} from "../hooks/use-account";

const profileSchema = z.object({
  displayName: z.string().trim().max(80, "Display name is too long."),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(30, "Username must be 30 characters or fewer.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores.",
    ),
  firstName: z.string().trim().max(50, "First name is too long."),
  lastName: z.string().trim().max(50, "Last name is too long."),
  location: z.string().trim().max(120, "Location is too long."),
  website: z
    .string()
    .trim()
    .max(255, "Website URL is too long.")
    .refine(
      (value) =>
        value.length === 0 || /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(value),
      "Enter a valid website URL starting with http:// or https://.",
    ),
  bio: z.string().trim().max(500, "Bio must be 500 characters or fewer."),
});

export function ProfileEditModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const user = useCurrentAuthUser();
  const { data: profileResponse } = useCurrentUserProfile();
  const saveSettings = useSaveAccountSettings();
  const updateAvatar = useUpdateAvatar();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);

  const profile = profileResponse?.data.user.profile ?? user?.profile ?? null;
  const displayName =
    profile?.displayName ||
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    "Account";
  const avatarFallback = displayName.charAt(0).toUpperCase() || "A";
  const initialValues = {
    displayName: profile?.displayName ?? "",
    username: user?.username ?? "",
    firstName: profile?.firstName ?? "",
    lastName: profile?.lastName ?? "",
    location: profile?.location ?? "",
    website: profile?.website ?? "",
    bio: profile?.bio ?? "",
  };

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(avatarFile);
    setAvatarPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [avatarFile]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update how your profile appears across PromptHub.
          </DialogDescription>
        </DialogHeader>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validate={createFormikValidator(profileSchema)}
          onSubmit={async (values, helpers) => {
            try {
              if (avatarFile) {
                await updateAvatar.mutateAsync(avatarFile);
              }

              await saveSettings.mutateAsync({
                username: values.username.trim(),
                profile: {
                  displayName: values.displayName.trim(),
                  firstName: values.firstName.trim(),
                  lastName: values.lastName.trim(),
                  location: values.location.trim(),
                  website: values.website.trim(),
                  bio: values.bio.trim(),
                },
              });
              appToast.success("Profile updated successfully.");
              setAvatarFile(null);
              onOpenChange(false);
            } catch (err: any) {
              if (err?.errors?.length > 0) {
                err?.errors[0]?.message &&
                  appToast.error(err?.errors[0]?.message);
              } else if (err?.message) {
                appToast.error(
                  err?.message || "We could not update your profile.",
                );
              }
            } finally {
              helpers.setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, resetForm }) => (
            <Form className="space-y-6" noValidate>
              <div className="rounded-xl border border-border bg-muted/20 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Avatar className="h-24 w-24 border border-border">
                    <AvatarImage
                      src={
                        avatarPreviewUrl ||
                        profile?.avatarUrl ||
                        "/placeholder.svg"
                      }
                      alt={displayName}
                    />
                    <AvatarFallback className="text-2xl">
                      {avatarFallback}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-foreground">
                        Profile Photo
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Upload a JPG, PNG, or WebP image and preview it before
                        saving.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <label>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.currentTarget.files?.[0] ?? null;
                            setAvatarFile(file);
                            event.currentTarget.value = "";
                          }}
                        />
                        <Button type="button" variant="outline" asChild>
                          <span>
                            {avatarPreviewUrl || profile?.avatarUrl ? (
                              <Camera className="mr-2 h-4 w-4" />
                            ) : (
                              <UploadCloud className="mr-2 h-4 w-4" />
                            )}
                            {avatarPreviewUrl || profile?.avatarUrl
                              ? "Replace Avatar"
                              : "Upload Avatar"}
                          </span>
                        </Button>
                      </label>
                      {avatarPreviewUrl ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setAvatarFile(null)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove Selection
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <FormikInputField name="displayName" label="Display Name" />
                <FormikInputField name="username" label="Username" />
                <FormikInputField name="firstName" label="First Name" />
                <FormikInputField name="lastName" label="Last Name" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Email</p>
                  <div className="flex h-9 items-center rounded-md border border-border bg-muted px-3 text-sm text-muted-foreground">
                    {user?.email ?? "No email available"}
                  </div>
                </div>
                <FormikInputField name="location" label="Location" />
                <div className="md:col-span-2">
                  <FormikInputField
                    name="website"
                    label="Website"
                    placeholder="https://your-site.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <FormikTextareaField
                    name="bio"
                    label="Bio"
                    rows={5}
                    placeholder="Tell people a little about yourself and your prompt style."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setAvatarFile(null);
                    onOpenChange(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    saveSettings.isPending ||
                    updateAvatar.isPending
                  }
                >
                  {isSubmitting ||
                  saveSettings.isPending ||
                  updateAvatar.isPending
                    ? "Saving..."
                    : "Save Changes"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
