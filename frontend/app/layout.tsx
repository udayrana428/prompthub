// app/layout.tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "../styles/globals.css";
import type React from "react";
import { Suspense } from "react";
import { ThemeProvider } from "@/shared/components/common/theme-provider";
import { AppToastProvider } from "@/shared/lib/toastify/app-toast-provider";
import { ReactQueryProvider } from "@/shared/lib/react-query/provider";
import { ReduxProvider } from "@/shared/redux/provider";
import { defaultMetadata } from "@/shared/lib/seo";
import { PageLoader } from "@/shared/components/common/page-loader";

// ── Metadata ──────────────────────────────────────────────────────────────────
// Root metadata — provides defaults for all pages
// Individual pages override via their own generateMetadata or metadata export
// template: "%s | PromptHub" means child page titles become "X | PromptHub"
export const metadata: Metadata = defaultMetadata;

// ── Layout ────────────────────────────────────────────────────────────────────
// Bare shell — providers only, no UI chrome
// Header/Footer live in (main)/layout.tsx
// Admin chrome lives in (admin)/layout.tsx
// Auth centering lives in (auth)/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <ReduxProvider>
            <ReactQueryProvider>
              <Suspense fallback={<PageLoader />}>{children}</Suspense>
            </ReactQueryProvider>
          </ReduxProvider>
          <AppToastProvider />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
