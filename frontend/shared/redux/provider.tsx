"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { ReactNode } from "react";
import { AuthSessionSync } from "@/shared/components/common/auth-session-sync";

type Props = {
  children: ReactNode;
};

export function ReduxProvider({ children }: Props) {
  return (
    <Provider store={store}>
      <AuthSessionSync />
      {children}
    </Provider>
  );
}
