"use client";

import { useEffect } from "react";
import { useFormikContext } from "formik";
import { scrollToFirstError } from "@/shared/lib/formik";

export function FormikErrorScroller() {
  const { submitCount, errors, isSubmitting, isValid } = useFormikContext();

  useEffect(() => {
    if (submitCount > 0 && !isSubmitting && !isValid) {
      setTimeout(() => {
        scrollToFirstError(errors);
      }, 80);
    }
  }, [submitCount, errors, isSubmitting, isValid]);

  return null;
}
