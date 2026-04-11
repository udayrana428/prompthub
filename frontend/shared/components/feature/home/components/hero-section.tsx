"use client";

import { motion } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

const galleryImages = [
  "https://images.unsplash.com/photo-1771515220905-ba0784fb7522?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGdlbmVyYXRlZCUyMGFydCUyMGN5YmVycHVua3xlbnwxfHx8fDE3NzQyMDk5MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1670073952001-1aafed4bfc02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwZGlnaXRhbCUyMGFydHxlbnwxfHx8fDE3NzQyMDk5MDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1705254613735-1abb457f8a60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNvbG9yZnVsJTIwYXJ0d29ya3xlbnwxfHx8fDE3NzQxNzM4MjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1728995025396-b5141e209455?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwbGFuZHNjYXBlJTIwZGlnaXRhbHxlbnwxfHx8fDE3NzQyMDk5MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1620983626305-88db754c9a29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwY2l0eSUyMG5pZ2h0fGVufDF8fHx8MTc3NDE5NzA5NXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1744138038271-2ffa619dcedf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjZSUyMG5lYnVsYSUyMGNvbG9yZnVsfGVufDF8fHx8MTc3NDIwOTkxMXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1634320714682-ae8b9c9cee60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwcGFpbnRpbmclMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQyMDk5MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1633334241793-ddb42c1749d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2ktZmklMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzc0MjA5OTEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1769265114376-50b2a7528258?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWJyYW50JTIwaWxsdXN0cmF0aW9uJTIwYXJ0fGVufDF8fHx8MTc3NDIwMjM1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1759083937558-e81d4e949a4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXJyZWFsJTIwZHJlYW1saWtlJTIwYXJ0fGVufDF8fHx8MTc3NDIwOTkxM3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1666302707255-13651d539be5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMHJlbmRlciUyMGFic3RyYWN0fGVufDF8fHx8MTc3NDE4OTk1OXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1669780080319-ac38af934355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGdyYWRpZW50JTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzQxNjY5NTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
];

interface ScrollingColumnProps {
  images: string[];
  direction: "up" | "down";
  speed: number;
  delay: number;
}

function ScrollingColumn({
  images,
  direction,
  speed,
  delay,
}: ScrollingColumnProps) {
  return (
    <div className="flex flex-col overflow-hidden h-full">
      <motion.div
        className="flex flex-col gap-4"
        animate={{
          y: direction === "up" ? [0, -1200] : [-1200, 0],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
          delay,
        }}
      >
        {[...images, ...images, ...images].map((img, i) => (
          <div
            key={i}
            className="w-48 h-64 rounded-lg overflow-hidden flex-shrink-0"
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function HeroSection() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const submitSearch = () => {
    const query = search.trim();
    router.push(
      query ? `/prompts?search=${encodeURIComponent(query)}` : "/prompts",
    );
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Animated background gallery */}
      <div className="absolute inset-0 flex gap-4 px-4">
        <ScrollingColumn
          images={galleryImages.slice(0, 3)}
          direction="down"
          speed={20}
          delay={0}
        />
        <ScrollingColumn
          images={galleryImages.slice(3, 6)}
          direction="up"
          speed={25}
          delay={0.5}
        />
        <ScrollingColumn
          images={galleryImages.slice(6, 9)}
          direction="down"
          speed={22}
          delay={1}
        />
        <ScrollingColumn
          images={galleryImages.slice(9, 12)}
          direction="up"
          speed={27}
          delay={0.2}
        />
        <ScrollingColumn
          images={galleryImages.slice(0, 3)}
          direction="down"
          speed={24}
          delay={0.8}
        />
        <ScrollingColumn
          images={galleryImages.slice(3, 6)}
          direction="up"
          speed={21}
          delay={0.3}
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/60 via-slate-950/40 to-slate-950/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full
            bg-gradient-to-r from-pink-500/20 to-purple-500/20
            border border-pink-500/30 mb-8"
        >
          <Sparkles className="h-4 w-4 text-pink-400" />
          <span className="text-sm text-gray-300">
            Discover 10,000+ AI Prompts
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center text-5xl sm:text-6xl lg:text-8xl font-bold mb-6 max-w-6xl"
        >
          <span className="block text-white">Discover Trending</span>
          <span className="block bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent">
            AI Prompts
          </span>
          <span className="block text-white">for Stunning Images</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center text-lg md:text-xl text-gray-100 max-w-2xl mb-12"
        >
          Find the perfect prompts for MidJourney, DALL-E, Stable Diffusion, and
          more. Copy, customize, and create amazing AI art in seconds.
        </motion.p>

        {/* Search CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl mb-16"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300" />
            <Input
              placeholder="Try 'cyberpunk city' or 'fantasy landscape'..."
              className="pl-10 h-12 text-base bg-white/5 border-white/10 text-white
                placeholder:text-gray-300 backdrop-blur-md rounded-2xl
                focus-visible:ring-pink-500/50"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") submitSearch();
              }}
            />
          </div>
          <Link href="/prompts">
            <Button
              size="lg"
              className="h-12 px-8 rounded-2xl border-0
              bg-gradient-to-r from-pink-500 to-purple-600
              hover:from-pink-600 hover:to-purple-700
              shadow-lg shadow-pink-500/30"
            >
              Explore Prompts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-12"
        >
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
              10,000+
            </span>
            <span className="text-sm text-gray-100 mt-1">Curated Prompts</span>
          </div>
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              50+
            </span>
            <span className="text-sm text-gray-100 mt-1">Categories</span>
          </div>
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
              1M+
            </span>
            <span className="text-sm text-gray-100 mt-1">Images Generated</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
