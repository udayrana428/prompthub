"use client";

import React from "react";
import { Form, Formik } from "formik";
import { z } from "zod";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
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
} from "./hooks/use-account";

const settingsSchema = z.object({
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

const AccountSettingPage = () => {
  const user = useCurrentAuthUser();
  const { data: profileResponse } = useCurrentUserProfile();
  const saveSettings = useSaveAccountSettings();
  const profile = profileResponse?.data.user.profile ?? user?.profile ?? null;
  const initialValues = {
    displayName: profile?.displayName ?? "",
    username: user?.username ?? "",
    firstName: profile?.firstName ?? "",
    lastName: profile?.lastName ?? "",
    location: profile?.location ?? "",
    website: profile?.website ?? "",
    bio: profile?.bio ?? "",
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validate={createFormikValidator(settingsSchema)}
            onSubmit={async (values, helpers) => {
              try {
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
                appToast.success("Your account settings have been updated.");
              } catch (err: any) {
                if (err?.errors) {
                  err?.errors[0]?.message &&
                    appToast.error(err?.errors[0]?.message);
                } else if (err?.message) {
                  appToast.error(
                    err?.message || "We could not update your settings.",
                  );
                }
              } finally {
                helpers.setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, resetForm }) => (
              <Form className="space-y-6" noValidate>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                      rows={4}
                      placeholder="Tell people a little about yourself and your prompt style."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => resetForm()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || saveSettings.isPending}
                  >
                    {isSubmitting || saveSettings.isPending
                      ? "Saving..."
                      : "Save Changes"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Public Profile</p>
              <p className="text-sm text-muted-foreground">
                Your public profile is visible through your PromptHub slug.
              </p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Enabled
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">
                Saved Prompt Privacy
              </p>
              <p className="text-sm text-muted-foreground">
                Saved prompts stay private to your account.
              </p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Private
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Email Address</p>
              <p className="text-sm text-muted-foreground">
                Email changes are not available from this screen yet.
              </p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Locked
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettingPage;
