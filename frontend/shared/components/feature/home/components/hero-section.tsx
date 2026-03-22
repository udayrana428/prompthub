import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Search, ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative py-20 lg:py-5 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-card via-background to-muted" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm text-card-foreground mb-8">
            <Sparkles className="h-4 w-4 mr-2 text-primary" />
            {"Discover 10,000+ AI Prompts"}
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6">
            Discover Trending <span className="text-primary">AI Prompts</span>{" "}
            for Stunning Images
          </h1>

          {/* Subheading */}
          <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
            Find the perfect prompts for MidJourney, DALL-E, Stable Diffusion,
            and more. Copy, customize, and create amazing AI art in seconds.
          </p>

          {/* Search CTA */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Try 'cyberpunk city' or 'fantasy landscape'..."
                className="pl-10 h-12 text-base bg-background border-border"
              />
            </div>
            <Button size="lg" className="h-12 px-8">
              Explore Prompts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <span className="font-semibold text-foreground mr-1">
                10,000+
              </span>
              Curated Prompts
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-foreground mr-1">50+</span>
              Categories
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-foreground mr-1">1M+</span>
              Images Generated
            </div>
          </div>
        </div>
      </div>

      {/* Featured prompt preview */}
      {/* <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-card-foreground mb-2">Featured Prompt</h3>
                <p className="text-sm text-muted-foreground">Most popular this week</p>
              </div>
              <Button variant="outline" size="sm">
                Copy Prompt
              </Button>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-mono text-foreground">
                "A majestic dragon soaring through a cyberpunk cityscape at sunset, neon lights reflecting off its
                scales, ultra-detailed, cinematic lighting, 8K resolution, trending on ArtStation"
              </p>
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
              <span>Works best with: MidJourney, DALL-E 3</span>
              <span>2.3K copies this week</span>
            </div>
          </div>
        </div>
      </div> */}
    </section>
  );
}
