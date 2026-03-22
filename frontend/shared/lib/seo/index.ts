import type { Metadata } from "next";
import type { PromptMeta } from "@/shared/components/feature/prompt/types";
import type { ListPageMeta } from "@/shared/api/types";

// shared/components/feature/blog/types/index.ts

export interface BlogMeta {
  title: string;
  description: string;
  keywords: string[];
  image: string;
  url: string;
  noIndex: boolean;
  // Blog-specific extras
  publishedTime?: string; // for article structured data
  modifiedTime?: string;
  author?: string;
  category?: string;
}

export interface BlogListMeta {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  noIndex: boolean;
}

const SITE_NAME = "PromptHub";
const DEFAULT_DESCRIPTION =
  "Find the best AI prompts for image generation. Browse thousands of curated prompts for MidJourney, DALL-E, Stable Diffusion, and more.";
const DEFAULT_IMAGE = "/og-default.png";

// Used for backend-driven meta (detail pages, list pages)
// Backend sends complete strings — no transformation needed

type BuildableMetaInput = PromptMeta | BlogMeta | ListPageMeta;

export function buildMetadata(meta: BuildableMetaInput): Metadata {
  const image = "image" in meta ? meta.image : undefined;
  const url = "url" in meta ? meta.url : undefined;
  const canonical = "canonical" in meta ? meta.canonical : url;

  // Blog posts get article OG type + structured data
  const isBlogMeta = "publishedTime" in meta || "author" in meta;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    robots: meta.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: meta.title,
      description: meta.description,
      images: image
        ? [{ url: image, width: 1200, height: 630 }]
        : [DEFAULT_IMAGE],
      url,
      siteName: SITE_NAME,
      type: isBlogMeta ? "article" : "website",
      // Article-specific fields — only present for blog
      ...(isBlogMeta &&
        "publishedTime" in meta && {
          publishedTime: meta.publishedTime,
          modifiedTime: meta.modifiedTime,
          authors: meta.author ? [meta.author] : undefined,
          section: meta.category,
        }),
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: image ? [image] : [DEFAULT_IMAGE],
    },
    alternates: {
      canonical,
    },
  };
}

// Used for static pages where backend isn't involved
// Only place where frontend builds title strings
export function buildStaticMetadata({
  title,
  description,
  image,
  url,
  noIndex = false,
}: {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  noIndex?: boolean;
}): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const desc = description ?? DEFAULT_DESCRIPTION;

  return {
    title: fullTitle,
    description: desc,
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: fullTitle,
      description: desc,
      images: [{ url: image ?? DEFAULT_IMAGE }],
      url,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [image ?? DEFAULT_IMAGE],
    },
  };
}

export const notFoundMetadata: Metadata = {
  title: "Not Found – PromptHub",
  description: "This page does not exist or has been removed.",
  robots: { index: false, follow: false },
};

export const defaultMetadata: Metadata = {
  // template applies to all child pages automatically
  // child page sets title: "Browse Prompts"
  // rendered as: "Browse Prompts | PromptHub"
  title: {
    default: "PromptHub – Discover & Share AI Prompts",
    template: "%s | PromptHub",
  },
  description:
    "Find the best AI prompts for image generation. Browse thousands of curated prompts for MidJourney, DALL-E, Stable Diffusion, and more.",
  keywords: [
    "AI prompts",
    "image generation",
    "MidJourney",
    "DALL-E",
    "Stable Diffusion",
    "AI art",
  ],
  metadataBase: new URL("https://prompthub.com"), // ← required for absolute OG image URLs
  openGraph: {
    siteName: "PromptHub",
    type: "website",
    images: ["/og-default.png"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@prompthub", // your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
  },
};
