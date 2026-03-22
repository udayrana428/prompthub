"use client";

import { useField } from "formik";
import type { ComponentProps } from "react";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/lib/utils";

type BaseFieldProps = {
  name: string;
  label?: string;
  description?: string;
};

type FormikInputFieldProps = BaseFieldProps &
  Omit<ComponentProps<typeof Input>, "name">;

type FormikTextareaFieldProps = BaseFieldProps &
  Omit<ComponentProps<typeof Textarea>, "name">;

const getFieldMessage = (error: unknown) =>
  typeof error === "string" ? error : null;

export function FormikInputField({
  name,
  label,
  description,
  className,
  id,
  ...props
}: FormikInputFieldProps) {
  const [field, meta] = useField(name);
  const message = meta.touched ? getFieldMessage(meta.error) : null;
  const inputId = id ?? name;

  return (
    <div className="space-y-2">
      {label ? <Label htmlFor={inputId}>{label}</Label> : null}
      <Input
        {...field}
        {...props}
        id={inputId}
        className={className}
        aria-invalid={!!message}
      />
      {message ? (
        <p className="text-sm text-destructive">{message}</p>
      ) : description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export function FormikTextareaField({
  name,
  label,
  description,
  className,
  id,
  ...props
}: FormikTextareaFieldProps) {
  const [field, meta] = useField(name);
  const message = meta.touched ? getFieldMessage(meta.error) : null;
  const inputId = id ?? name;

  return (
    <div className="space-y-2">
      {label ? <Label htmlFor={inputId}>{label}</Label> : null}
      <Textarea
        {...field}
        {...props}
        id={inputId}
        className={cn(className)}
        aria-invalid={!!message}
      />
      {message ? (
        <p className="text-sm text-destructive">{message}</p>
      ) : description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
