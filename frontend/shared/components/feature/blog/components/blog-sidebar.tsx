import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Calendar, TrendingUp, Tag, Mail } from "lucide-react";

const popularPosts = [
  {
    title: "Best AI Prompts for Logos in 2025",
    slug: "best-ai-prompts-logos-2025",
    views: 12500,
  },
  {
    title: "Prompt Engineering Masterclass",
    slug: "prompt-engineering-masterclass",
    views: 18500,
  },
  {
    title: "Top 50 ChatGPT Prompts for Creative Images",
    slug: "top-50-chatgpt-prompts-creative-images",
    views: 15200,
  },
];

const categories = [
  { name: "Guides", count: 24, slug: "guides" },
  { name: "Tutorials", count: 18, slug: "tutorials" },
  { name: "Comparisons", count: 12, slug: "comparisons" },
  { name: "Trends", count: 15, slug: "trends" },
  { name: "Collections", count: 8, slug: "collections" },
  { name: "Education", count: 21, slug: "education" },
];

const popularTags = [
  "midjourney",
  "dalle",
  "stable-diffusion",
  "prompt-engineering",
  "tutorials",
  "tips",
  "ai-art",
  "photography",
  "logos",
  "fantasy",
  "portraits",
  "landscapes",
];

const recentPosts = [
  {
    title: "AI Art Trends to Watch in 2025",
    slug: "ai-art-trends-2025",
    date: "2024-01-05",
  },
  {
    title: "Stable Diffusion Portrait Guide",
    slug: "stable-diffusion-portrait-photography-guide",
    date: "2024-01-08",
  },
  {
    title: "MidJourney vs DALL-E Comparison",
    slug: "midjourney-vs-dalle-fantasy-art",
    date: "2024-01-12",
  },
];

export function BlogSidebar() {
  return (
    <div className="space-y-6">
      {/* Newsletter Signup */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Stay Updated
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Get the latest AI art tips, tutorials, and prompt collections
            delivered to your inbox.
          </p>
          <div className="space-y-2">
            <Input placeholder="Enter your email" type="email" />
            <Button className="w-full" size="sm">
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            No spam. Unsubscribe anytime.
          </p>
        </CardContent>
      </Card>

      {/* Popular Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Popular Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {popularPosts.map((post, index) => (
            <div key={post.slug} className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  <h4 className="text-sm font-medium line-clamp-2">
                    {post.title}
                  </h4>
                </Link>
                <p className="text-xs text-muted-foreground mt-1">
                  {post.views.toLocaleString()} views
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/blog/category/${category.slug}`}
              className="flex items-center justify-between py-2 hover:text-primary transition-colors"
            >
              <span className="text-sm">{category.name}</span>
              <Badge variant="secondary" className="text-xs">
                {category.count}
              </Badge>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Popular Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Link key={tag} href={`/blog/tag/${tag}`}>
                <Badge
                  variant="outline"
                  className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Recent Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentPosts.map((post) => (
            <div key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="hover:text-primary transition-colors"
              >
                <h4 className="text-sm font-medium line-clamp-2 mb-1">
                  {post.title}
                </h4>
              </Link>
              <p className="text-xs text-muted-foreground">
                {new Date(post.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
