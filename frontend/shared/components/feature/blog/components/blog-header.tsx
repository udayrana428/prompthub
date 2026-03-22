import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Search, Rss } from "lucide-react";

export function BlogHeader() {
  return (
    <section className="bg-card border-b border-border py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            AI Art Blog
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-card-foreground mb-4 text-balance">
            Master AI Art with Expert Tips & Guides
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Stay ahead of the curve with the latest AI art techniques, prompt
            engineering strategies, and comprehensive tutorials for all major AI
            image generators.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="pl-10 bg-background border-border"
              />
            </div>
            <Button variant="outline">
              <Rss className="h-4 w-4 mr-2" />
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
