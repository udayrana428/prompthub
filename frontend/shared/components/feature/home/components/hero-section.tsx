"use client";

import { motion } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useIsMobile } from "@/shared/hooks/use-mobile";

const galleryImages = [
  "/img/landing/hero-img1.jpeg",
  "/img/landing/hero-img2.jpeg",
  "/img/landing/hero-img3.jpeg",
  "/img/landing/hero-img4.jpeg",
  "/img/landing/hero-img5.jpeg",
  "/img/landing/hero-img6.jpeg",
  "/img/landing/hero-img7.jpeg",
  "/img/landing/hero-img8.jpeg",
  "/img/landing/hero-img9.jpeg",
  "/img/landing/hero-img10.jpeg",
  "/img/landing/hero-img11.jpeg",
  "/img/landing/hero-img12.jpeg",
];

// ─── Desktop: vertical scrolling column ───────────────────────────────────────
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
        animate={{ y: direction === "up" ? [0, -1200] : [-1200, 0] }}
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

// ─── Mobile: horizontal scrolling row ─────────────────────────────────────────
interface ScrollingRowProps {
  images: string[];
  direction: "left" | "right";
  speed: number;
  delay: number;
}

function ScrollingRow({ images, direction, speed, delay }: ScrollingRowProps) {
  return (
    <div className="overflow-hidden w-full">
      <motion.div
        className="flex flex-row gap-3"
        animate={{ x: direction === "left" ? [0, -1200] : [-1200, 0] }}
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
            className="w-36 h-28 rounded-lg overflow-hidden flex-shrink-0"
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function HeroSection() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const isMobile = useIsMobile();

  const submitSearch = () => {
    const query = search.trim();
    router.push(
      query ? `/prompts?search=${encodeURIComponent(query)}` : "/prompts",
    );
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* ── Desktop background: vertical columns ── */}
      {!isMobile && (
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
      )}

      {/* ── Mobile background: horizontal rows ── */}
      {/* ── Mobile background: horizontal rows ── */}
      {isMobile && (
        <div className="absolute inset-0 flex flex-col justify-between py-4 gap-3">
          <ScrollingRow
            images={galleryImages.slice(0, 6)}
            direction="left"
            speed={18}
            delay={0}
          />
          <ScrollingRow
            images={galleryImages.slice(6, 12)}
            direction="right"
            speed={22}
            delay={0.4}
          />
          <ScrollingRow
            images={galleryImages.slice(0, 6)}
            direction="left"
            speed={20}
            delay={0.8}
          />
          <ScrollingRow
            images={galleryImages.slice(6, 12)}
            direction="right"
            speed={16}
            delay={0.2}
          />
          <ScrollingRow
            images={galleryImages.slice(0, 6)}
            direction="left"
            speed={19}
            delay={0.6}
          />
          <ScrollingRow
            images={galleryImages.slice(6, 12)}
            direction="right"
            speed={23}
            delay={0.3}
          />
          <ScrollingRow
            images={galleryImages.slice(0, 6)}
            direction="left"
            speed={17}
            delay={1.0}
          />
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/60 via-slate-950/40 to-slate-950/60" />

      {/* ── Content ── */}
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

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col items-center sm:flex-row gap-4 w-full max-w-2xl mb-16"
        >
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300 z-10" />
            <Input
              placeholder="Try 'cyberpunk city' or 'fantasy landscape'..."
              className="pl-10 h-12 text-base bg-white/5 border-white/10 text-white
                placeholder:text-gray-300 backdrop-blur-md rounded-2xl
                focus-visible:ring-pink-500/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitSearch();
              }}
            />
          </div>
          <Link href="/prompts">
            <Button
              size="lg"
              className="h-12 px-8 rounded-2xl border-0 w-full sm:w-auto
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
