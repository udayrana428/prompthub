import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Calendar,
  Clock,
  Eye,
  Share,
  Bookmark,
  Heart,
  Twitter,
  Facebook,
  Linkedin,
} from "lucide-react";

interface BlogPostProps {
  post: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    readTime: string;
    publishedAt: string;
    author: {
      name: string;
      avatar: string;
      bio: string;
    };
    views: number;
    tags: string[];
  };
}

export function BlogPost({ post }: BlogPostProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6">
        <span>Home</span> / <span>Blog</span> / <span>{post.category}</span> /{" "}
        <span className="text-foreground">{post.title}</span>
      </nav>

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary">{post.category}</Badge>
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
          {post.title}
        </h1>

        <p className="text-lg text-muted-foreground mb-6 text-pretty">
          {post.excerpt}
        </p>

        {/* Author and Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={post.author.avatar || "/placeholder.svg"}
                alt={post.author.name}
              />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">{post.author.bio}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post.publishedAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {post.views.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Social Actions */}
        <div className="flex items-center justify-between pt-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-2" />
              Like
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Share:</span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Linkedin className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="prose prose-gray dark:prose-invert max-w-none mb-12">
        <div className="whitespace-pre-wrap text-foreground leading-relaxed">
          {post.content}
        </div>
      </div>

      {/* Tags */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Author Bio */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Avatar className="h-16 w-16 flex-shrink-0">
              <AvatarImage
                src={post.author.avatar || "/placeholder.svg"}
                alt={post.author.name}
              />
              <AvatarFallback className="text-lg">
                {post.author.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                About {post.author.name}
              </h3>
              <p className="text-muted-foreground mb-4">{post.author.bio}</p>
              <Button variant="outline" size="sm">
                View All Posts
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
