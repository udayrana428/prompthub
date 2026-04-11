"use client";

import React from "react";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { authApi } from "@/shared/api";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  FormikInputField,
  FormikTextareaField,
} from "@/shared/components/ui/formik-field";
import { createFormikValidator } from "@/shared/lib/formik";
import { ROUTES } from "@/shared/lib/routes";
import { appToast } from "@/shared/lib/toastify/toast";
import { useAppDispatch } from "@/shared/redux/hooks";
import { clearAuth, setAccessToken } from "@/shared/redux/slices/auth.slice";
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

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[a-z]/, "Password must include a lowercase letter.")
      .regex(/[A-Z]/, "Password must include an uppercase letter.")
      .regex(/\d/, "Password must include a number."),
    confirmNewPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((values) => values.currentPassword !== values.newPassword, {
    message: "New password must be different from your current password.",
    path: ["newPassword"],
  })
  .refine((values) => values.newPassword === values.confirmNewPassword, {
    message: "Passwords do not match.",
    path: ["confirmNewPassword"],
  });

const AccountSettingPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
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
                if (err?.errors?.length > 0) {
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

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Manage your password and active account sessions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Formik
            initialValues={{
              currentPassword: "",
              newPassword: "",
              confirmNewPassword: "",
            }}
            validate={createFormikValidator(changePasswordSchema)}
            onSubmit={async (values, helpers) => {
              try {
                await authApi.changePassword({
                  currentPassword: values.currentPassword,
                  newPassword: values.newPassword,
                });

                dispatch(clearAuth());
                dispatch(setAccessToken({ accessToken: null }));
                appToast.success(
                  "Password changed successfully. Please sign in again.",
                );
                router.push(ROUTES.LOGIN);
                router.refresh();
              } catch (err: any) {
                if (err?.errors?.length > 0) {
                  err?.errors[0]?.message &&
                    appToast.error(err?.errors[0]?.message);
                } else if (err?.message) {
                  appToast.error(
                    err?.message || "We could not change your password.",
                  );
                }
              } finally {
                helpers.setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, resetForm }) => (
              <Form className="space-y-4" noValidate>
                <FormikInputField
                  name="currentPassword"
                  type="password"
                  label="Current Password"
                  placeholder="Enter your current password"
                />
                <FormikInputField
                  name="newPassword"
                  type="password"
                  label="New Password"
                  placeholder="Create a stronger password"
                  description="Use at least 8 characters with uppercase, lowercase, and a number."
                />
                <FormikInputField
                  name="confirmNewPassword"
                  type="password"
                  label="Confirm New Password"
                  placeholder="Re-enter your new password"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => resetForm()}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Change Password"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="rounded-lg border border-border p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-foreground">
                  Sign out of all devices
                </p>
                <p className="text-sm text-muted-foreground">
                  Revoke every active session linked to your account.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  try {
                    await authApi.logoutAll();
                    dispatch(clearAuth());
                    dispatch(setAccessToken({ accessToken: null }));
                    appToast.success(
                      "All sessions signed out. Please sign in again.",
                    );
                    router.push(ROUTES.LOGIN);
                    router.refresh();
                  } catch (err: any) {
                    if (err?.errors?.length > 0) {
                      err?.errors[0]?.message &&
                        appToast.error(err?.errors[0]?.message);
                    } else if (err?.message) {
                      appToast.error(
                        err?.message ||
                          "We could not sign you out of all devices.",
                      );
                    }
                  }
                }}
              >
                Logout All Devices
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettingPage;
