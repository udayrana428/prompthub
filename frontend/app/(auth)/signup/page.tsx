"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { authApi } from "@/shared/api";
import { useAppDispatch, useAppSelector } from "@/shared/redux/hooks";
import {
  setAccessToken,
  setAuth,
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

const signupSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters.")
      .max(50, "Username must be 50 characters or fewer.")
      .regex(
        /^[a-zA-Z0-9]+$/,
        "Username can only contain letters and numbers.",
      ),
    email: z
      .string()
      .trim()
      .min(1, "Email is required.")
      .email("Enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[a-z]/, "Password must include a lowercase letter.")
      .regex(/[A-Z]/, "Password must include an uppercase letter.")
      .regex(/\d/, "Password must include a number."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isInitialized } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace(ROUTES.ACCOUNT);
    }
  }, [isAuthenticated, isInitialized, router]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your PromptHub account</CardTitle>
        <CardDescription>
          Start saving prompts, following creators, and publishing your own.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validate={createFormikValidator(signupSchema)}
          onSubmit={async (values, helpers) => {
            try {
              const response = await authApi.register({
                username: values.username.trim(),
                email: values.email.trim(),
                password: values.password,
              });

              dispatch(setAuth({ user: normalizeUser(response.data.user) }));
              dispatch(
                setAccessToken({ accessToken: response.data.accessToken }),
              );

              try {
                const me = await authApi.me();
                dispatch(setAuth({ user: normalizeUser(me.data.user) }));
              } catch {
                // Register already returned an authenticated user payload.
              }

              appToast.success("Your account has been created.");
              router.push(ROUTES.ACCOUNT);
              router.refresh();
            } catch (err: any) {
              if (err?.errors?.length > 0) {
                err?.errors[0]?.message &&
                  appToast.error(err?.errors[0]?.message);
              } else if (err?.message) {
                appToast.error(
                  err?.message || "We could not create your account.",
                );
              }
            } finally {
              helpers.setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4" noValidate>
              <FormikInputField
                name="username"
                label="Username"
                placeholder="promptcreator"
              />
              <FormikInputField
                name="email"
                type="email"
                label="Email"
                placeholder="you@example.com"
              />
              <FormikInputField
                name="password"
                type="password"
                label="Password"
                placeholder="Create a strong password"
                description="Use at least 8 characters with uppercase, lowercase, and a number."
              />
              <FormikInputField
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="Re-enter your password"
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create Account"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href={ROUTES.LOGIN}
                  className="font-medium text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}
