import Link from "next/link";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Calendar, Clock, Eye, ArrowRight } from "lucide-react";

// Mock blog posts data
const blogPosts = [
  {
    id: "1",
    slug: "best-ai-prompts-logos-2025",
    title: "Best AI Prompts for Logos in 2025: Complete Guide",
    excerpt:
      "Discover the most effective AI prompts for creating professional logos. From minimalist designs to complex brand identities, learn how to craft prompts that deliver stunning results.",
    content: "Full article content would go here...",
    category: "Guides",
    readTime: "8 min read",
    publishedAt: "2024-01-15",
    author: {
      name: "Sarah Chen",
      avatar: "/img/placeholder-user.jpg?height=40&width=40",
      bio: "AI Art Specialist",
    },
    views: 12500,
    featured: true,
    tags: ["logos", "branding", "midjourney", "dalle"],
  },
  {
    id: "2",
    slug: "midjourney-vs-dalle-fantasy-art",
    title: "MidJourney vs DALL-E for Fantasy Art: Which is Better?",
    excerpt:
      "A comprehensive comparison of MidJourney and DALL-E 3 for creating fantasy artwork. We test both platforms with identical prompts and analyze the results.",
    content: "Full article content would go here...",
    category: "Comparisons",
    readTime: "12 min read",
    publishedAt: "2024-01-12",
    author: {
      name: "Alex Rodriguez",
      avatar: "/img/placeholder-user.jpg?height=40&width=40",
      bio: "Digital Artist",
    },
    views: 8900,
    featured: true,
    tags: ["midjourney", "dalle", "fantasy", "comparison"],
  },
  {
    id: "3",
    slug: "top-50-chatgpt-prompts-creative-images",
    title: "Top 50 ChatGPT Prompts for Creative Images",
    excerpt:
      "Unlock ChatGPT's image generation potential with our curated collection of 50 creative prompts. Perfect for artists, designers, and content creators.",
    content: "Full article content would go here...",
    category: "Collections",
    readTime: "15 min read",
    publishedAt: "2024-01-10",
    author: {
      name: "Maya Patel",
      avatar: "/img/placeholder-user.jpg?height=40&width=40",
      bio: "Content Creator",
    },
    views: 15200,
    featured: false,
    tags: ["chatgpt", "creative", "collection", "prompts"],
  },
  {
    id: "4",
    slug: "stable-diffusion-portrait-photography-guide",
    title: "Stable Diffusion Portrait Photography: Complete Guide",
    excerpt:
      "Master portrait photography with Stable Diffusion. Learn advanced techniques, lighting setups, and prompt structures for professional-quality portraits.",
    content: "Full article content would go here...",
    category: "Tutorials",
    readTime: "10 min read",
    publishedAt: "2024-01-08",
    author: {
      name: "David Kim",
      avatar: "/img/placeholder-user.jpg?height=40&width=40",
      bio: "Photography Expert",
    },
    views: 6700,
    featured: false,
    tags: ["stable-diffusion", "portraits", "photography", "tutorial"],
  },
  {
    id: "5",
    slug: "ai-art-trends-2025",
    title: "AI Art Trends to Watch in 2025",
    excerpt:
      "Explore the emerging trends shaping the AI art landscape in 2025. From new techniques to evolving aesthetics, stay ahead of the curve.",
    content: "Full article content would go here...",
    category: "Trends",
    readTime: "6 min read",
    publishedAt: "2024-01-05",
    author: {
      name: "Emma Thompson",
      avatar: "/img/placeholder-user.jpg?height=40&width=40",
      bio: "Trend Analyst",
    },
    views: 9800,
    featured: false,
    tags: ["trends", "2025", "ai-art", "future"],
  },
  {
    id: "6",
    slug: "prompt-engineering-masterclass",
    title: "Prompt Engineering Masterclass: From Beginner to Pro",
    excerpt:
      "Transform your AI art with advanced prompt engineering techniques. Learn the secrets of crafting prompts that consistently deliver exceptional results.",
    content: "Full article content would go here...",
    category: "Education",
    readTime: "20 min read",
    publishedAt: "2024-01-03",
    author: {
      name: "Michael Foster",
      avatar: "/img/placeholder-user.jpg?height=40&width=40",
      bio: "AI Researcher",
    },
    views: 18500,
    featured: false,
    tags: ["prompt-engineering", "education", "advanced", "techniques"],
  },
];

export function BlogGrid() {
  const featuredPosts = blogPosts.filter((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <div className="space-y-12">
      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Featured Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <Card
                key={post.id}
                className="group hover:shadow-lg transition-all duration-200 bg-card border-border"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="default" className="bg-primary">
                      Featured
                    </Badge>
                    <Badge variant="secondary">{post.category}</Badge>
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-xl font-semibold text-card-foreground mb-3 group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            post.author.avatar || "/img/placeholder-user.jpg"
                          }
                          alt={post.author.name}
                        />
                        <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">
                          {post.author.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {post.author.bio}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {post.views.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Regular Posts */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Latest Articles
        </h2>
        <div className="space-y-6">
          {regularPosts.map((post) => (
            <Card
              key={post.id}
              className="group hover:shadow-lg transition-all duration-200 bg-card border-border"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">{post.category}</Badge>
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="text-xl font-semibold text-card-foreground mb-3 group-hover:text-primary transition-colors cursor-pointer">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={
                              post.author.avatar || "/img/placeholder-user.jpg"
                            }
                            alt={post.author.name}
                          />
                          <AvatarFallback className="text-xs">
                            {post.author.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-card-foreground">
                          {post.author.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.views.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-48 flex-shrink-0">
                    <Link href={`/blog/${post.slug}`} className="group">
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                        <span className="text-muted-foreground text-sm">
                          Article Image
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Link
            href="/blog?page=2"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            Load More Articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
