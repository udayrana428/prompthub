"use client";

import type { FormikErrors } from "formik";
import type { ZodTypeAny } from "zod";

const assignNestedError = (
  target: Record<string, unknown>,
  path: (string | number)[],
  message: string,
) => {
  let cursor: Record<string, unknown> = target;

  path.forEach((segment, index) => {
    const key = String(segment);

    if (index === path.length - 1) {
      cursor[key] = message;
      return;
    }

    const existingValue = cursor[key];

    if (
      !existingValue ||
      typeof existingValue !== "object" ||
      Array.isArray(existingValue)
    ) {
      cursor[key] = {};
    }

    cursor = cursor[key] as Record<string, unknown>;
  });
};

export const createFormikValidator =
  <TValues>(schema: ZodTypeAny) =>
  (values: TValues) => {
    const result = schema.safeParse(values);

    if (result.success) {
      return {} as FormikErrors<TValues>;
    }

    const errors: Record<string, unknown> = {};

    result.error.issues.forEach((issue) => {
      if (issue.path.length === 0) return;
      assignNestedError(errors, issue.path, issue.message);
    });

    return errors as FormikErrors<TValues>;
  };

function findFirstErrorKey(errors: any, path = ""): string | null {
  for (const key in errors) {
    const value = errors[key];
    const currentPath = path ? `${path}.${key}` : key;

    if (typeof value === "string") return currentPath;

    if (typeof value === "object" && value !== null) {
      const nested = findFirstErrorKey(value, currentPath);
      if (nested) return nested;
    }
  }

  return null;
}

export function scrollToFirstError<T>(errors: FormikErrors<T>, offset = 80) {
  const firstErrorField = findFirstErrorKey(errors);

  if (!firstErrorField) return;

  const element = document.querySelector(
    `[name="${firstErrorField}"], #${firstErrorField}`,
  ) as HTMLElement | null;

  if (!element) return;

  const scrollContainer = element.closest(
    "[data-radix-dialog-content]",
  ) as HTMLElement | null;

  const container = scrollContainer || document.documentElement;

  const elementTop =
    element.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop -
    offset;

  container.scrollTo({
    top: elementTop,
    behavior: "smooth",
  });

  element.focus?.();
}
