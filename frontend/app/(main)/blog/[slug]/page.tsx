import { BlogDetailPage } from "@/shared/components/feature/blog";
import { BlogPost } from "@/shared/components/feature/blog/components/blog-post";
import { BlogSidebar } from "@/shared/components/feature/blog/components/blog-sidebar";

import { notFound } from "next/navigation";

// Mock function to get blog post by slug
const getBlogPostBySlug = (slug: string) => {
  const posts = [
    {
      id: "1",
      slug: "best-ai-prompts-logos-2025",
      title: "Best AI Prompts for Logos in 2025: Complete Guide",
      excerpt:
        "Discover the most effective AI prompts for creating professional logos. From minimalist designs to complex brand identities, learn how to craft prompts that deliver stunning results.",
      content: `
# Best AI Prompts for Logos in 2025: Complete Guide

Creating professional logos with AI has never been easier, but crafting the perfect prompt requires skill and understanding. In this comprehensive guide, we'll explore the most effective AI prompts for logo design across all major platforms.

## Why AI Logo Design Matters

The landscape of logo design has been revolutionized by AI tools like MidJourney, DALL-E 3, and Stable Diffusion. These platforms can generate professional-quality logos in seconds, but only if you know how to prompt them correctly.

## Essential Elements of Logo Prompts

### 1. Style Definition
Always specify the style you want:
- "minimalist logo"
- "vintage badge design"
- "modern geometric logo"
- "hand-drawn illustration style"

### 2. Industry Context
Include the business type:
- "tech startup logo"
- "restaurant branding"
- "fitness brand identity"
- "luxury fashion logo"

### 3. Color Specifications
Be specific about colors:
- "monochrome black and white"
- "blue and gold color scheme"
- "vibrant rainbow gradient"
- "earth tone palette"

## Top 20 Logo Prompts for 2025

Here are the most effective logo prompts we've tested:

### Tech & Startup Logos
1. "Minimalist tech startup logo, geometric shapes, blue and white, clean lines, modern typography, vector style"
2. "AI company logo, neural network inspired, gradient from purple to cyan, futuristic font"

### Restaurant & Food
3. "Vintage restaurant logo, hand-drawn style, warm colors, classic typography, badge design"
4. "Modern coffee shop logo, minimalist cup icon, brown and cream colors, clean sans-serif"

### Fashion & Lifestyle
5. "Luxury fashion brand logo, elegant script font, gold and black, sophisticated design"
6. "Fitness brand logo, dynamic swoosh, energetic colors, bold typography"

## Platform-Specific Tips

### MidJourney
- Add "--no background" for transparent logos
- Use "--ar 1:1" for square formats
- Include "vector style" for clean lines

### DALL-E 3
- Specify "logo design" explicitly
- Use "professional branding" for business contexts
- Add "high contrast" for better visibility

### Stable Diffusion
- Include "logo, branding" in your prompt
- Use "clean vector art" for crisp results
- Add negative prompts to avoid unwanted elements

## Common Mistakes to Avoid

1. **Being too vague** - "nice logo" won't give you professional results
2. **Forgetting the medium** - Always specify it's for a logo
3. **Ignoring scalability** - Ensure your prompt creates simple, scalable designs
4. **Overcomplicating** - Simple prompts often yield better logo results

## Advanced Techniques

### Prompt Layering
Build your prompts in layers:
1. Base: "logo design"
2. Style: "minimalist, modern"
3. Industry: "tech startup"
4. Colors: "blue and white"
5. Format: "vector style, clean lines"

### Negative Prompting
Use negative prompts to avoid:
- "no text, no words, no letters"
- "no complex details, no photorealistic elements"
- "no gradients" (for simple designs)

## Testing and Iteration

The key to perfect logo prompts is iteration:
1. Start with a basic prompt
2. Generate multiple variations
3. Refine based on results
4. Test different platforms
5. Combine successful elements

## Conclusion

Mastering AI logo prompts requires practice and understanding of design principles. Start with these proven prompts and adapt them to your specific needs. Remember, the best logos are simple, memorable, and appropriate for their context.

The future of logo design is here, and with the right prompts, you can create professional branding that rivals traditional design agencies.
      `,
      category: "Guides",
      readTime: "8 min read",
      publishedAt: "2024-01-15",
      author: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        bio: "AI Art Specialist with 5+ years in digital design",
      },
      views: 12500,
      tags: ["logos", "branding", "midjourney", "dalle", "guides"],
    },
  ];

  return posts.find((post) => post.slug === slug);
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found - PromptHub Blog",
    };
  }

  return {
    title: `${post.title} | PromptHub Blog`,
    description: post.excerpt,
    keywords: post.tags.join(", "),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const props = { post };

  return <BlogDetailPage {...props} />;
}
