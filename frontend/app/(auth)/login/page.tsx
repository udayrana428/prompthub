"use client";

import { useEffect } from "react";
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
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { FormikInputField } from "@/shared/components/ui/formik-field";
import { createFormikValidator } from "@/shared/lib/formik";
import { appToast } from "@/shared/lib/toastify/toast";

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

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isInitialized } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace("/account");
    }
  }, [isAuthenticated, isInitialized, router]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in to PromptHub</CardTitle>
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

              dispatch(setAuth({ user: normalizeUser(response.data.user) }));
              dispatch(
                setAccessToken({ accessToken: response.data.accessToken }),
              );

              try {
                const me = await authApi.me();
                dispatch(setAuth({ user: normalizeUser(me.data.user) }));
              } catch {
                // Login already returned a usable user payload.
              }

              appToast.success("Signed in successfully.");
              router.push("/");
              router.refresh();
            } catch (err: any) {
              if (err?.errors) {
                err?.errors[0]?.message &&
                  appToast.error(err?.errors[0]?.message);
              } else if (err?.message) {
                appToast.error(
                  err?.message ||
                    "Login failed. Please check your credentials.",
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
                name="email"
                type="email"
                label="Email"
                placeholder="you@example.com"
              />
              <FormikInputField
                name="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}
