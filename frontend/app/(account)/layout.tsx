"use client";

import type React from "react";
import AccountHeader from "@/shared/components/feature/account/components/account-header";
import AccountTabs from "@/shared/components/feature/account/components/account-tabs";
import { Header } from "@/shared/components/common/header";
import { Footer } from "@/shared/components/common/footer";
import { PageLoader } from "@/shared/components/common/page-loader";
import { useRequireAuth } from "@/shared/lib/auth";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isInitialized } = useRequireAuth();

  if (!isInitialized) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <AccountHeader />
          <AccountTabs />
          <main className="pb-6">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
