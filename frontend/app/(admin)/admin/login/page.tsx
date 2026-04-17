"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { Shield, Sparkles } from "lucide-react";
import { authApi } from "@/shared/api";
import { useAppDispatch, useAppSelector } from "@/shared/redux/hooks";
import {
  setAccessToken,
  setAuth,
  clearAuth,
  type AuthUser,
} from "@/shared/redux/slices/auth.slice";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { FormikInputField } from "@/shared/components/ui/formik-field";
import { createFormikValidator } from "@/shared/lib/formik";
import { appToast } from "@/shared/lib/toastify/toast";
import { ROUTES } from "@/shared/lib/routes";

const ADMIN_ROLES = new Set(["SUPER_ADMIN", "ADMIN", "MODERATOR"]);

const isAdminUser = (roles?: string[] | null) =>
  Array.isArray(roles) && roles.some((role) => ADMIN_ROLES.has(role));

const normalizeUser = (user: any): AuthUser => ({
  id: user?.id ?? "",
  username: user?.username ?? "",
  slug: user?.slug ?? "",
  email: user?.email ?? "",
  status: user?.status,
  createdOn: user?.createdOn,
  roles: Array.isArray(user?.roles) ? user.roles : [],
  permissions: Array.isArray(user?.permissions) ? user.permissions : [],
  profile: user?.profile ?? null,
});

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isInitialized, user } = useAppSelector(
    (state) => state.auth,
  );

  const nextPath = searchParams.get("next") || ROUTES.ADMIN.ROOT;
  const isAdmin = isAdminUser(user?.roles);

  useEffect(() => {
    if (!isInitialized) return;

    if (isAuthenticated && isAdmin) {
      router.replace(nextPath);
    }
  }, [isAdmin, isAuthenticated, isInitialized, nextPath, router]);

  if (isInitialized && isAuthenticated && !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin access required</CardTitle>
            <CardDescription>
              This account is signed in, but it does not have access to the
              admin dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href={ROUTES.HOME}>Back to site</Link>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={async () => {
                try {
                  await authApi.logout();
                } catch {
                  // Clear client auth even if server session is already gone.
                } finally {
                  dispatch(clearAuth());
                  router.refresh();
                }
              }}
            >
              Sign out and try another account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              PromptHub Admin
            </div>
          </div>
          <CardTitle>Sign in to the admin dashboard</CardTitle>
          <CardDescription>
            Use an administrator account to access moderation, prompt
            management, and platform controls.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{ email: "", password: "" }}
            validate={createFormikValidator(loginSchema)}
            onSubmit={async (values, helpers) => {
              try {
                const response = await authApi.login({
                  email: values.email.trim(),
                  password: values.password,
                });

                const normalizedUser = normalizeUser(response.data.user);

                dispatch(setAuth({ user: normalizedUser }));
                dispatch(
                  setAccessToken({ accessToken: response.data.accessToken }),
                );

                try {
                  const me = await authApi.me();
                  const hydratedUser = normalizeUser(me.data.user);

                  if (!isAdminUser(hydratedUser.roles)) {
                    try {
                      await authApi.logout();
                    } catch {
                      // Best effort logout for non-admin login attempts.
                    }
                    dispatch(clearAuth());
                    appToast.error(
                      "This account does not have access to the admin dashboard.",
                    );
                    return;
                  }

                  dispatch(setAuth({ user: hydratedUser }));
                } catch {
                  // Login payload already contains usable auth data.
                }

                router.push(nextPath);
                router.refresh();
              } catch (err: any) {
                const message =
                  err?.errors?.[0]?.message ||
                  err?.message ||
                  "Admin login failed. Please check your credentials.";
                appToast.error(message);
              } finally {
                helpers.setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4" noValidate>
                <FormikInputField
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="admin@example.com"
                />
                <FormikInputField
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Enter Admin Dashboard"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Looking for the regular app?{" "}
                  <Link
                    href={ROUTES.LOGIN}
                    className="font-medium text-primary hover:underline"
                  >
                    User sign in
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}
