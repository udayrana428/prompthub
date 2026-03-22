// src/shared/services/seo.service.js
import prisma from "../../db/index.js";

// Builds the pageKey for any page type
export const buildPageKey = {
  prompt: (slug) => `prompt:${slug}`,
  promptListing: () => `listing:prompts`,
  promptsByCategory: (category) => `listing:prompts:category:${category}`,
  promptsByTag: (tag) => `listing:prompts:tag:${tag}`,
  promptsBySearch: () => null, // search pages are never overridden
  profile: (username) => `profile:${username}`,
};

// Core function — checks DB override first, falls back to generated
export const resolveMeta = async (pageKey, generated) => {
  if (!pageKey) return generated; // search pages — no override possible

  const override = await prisma.seoOverride.findUnique({
    where: { pageKey },
  });

  // Merge — override wins field by field, generated fills the rest
  return {
    title: override?.title ?? generated.title,
    description: override?.description ?? generated.description,
    keywords: override?.keywords
      ? override.keywords.split(",").map((k) => k.trim())
      : generated.keywords,
    image: override?.image ?? generated.image,
    url: generated.url, // url never overridden
    noIndex: override?.noIndex ?? false,
  };
};
