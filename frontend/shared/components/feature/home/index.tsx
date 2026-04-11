import React from "react";
import { HeroSection } from "./components/hero-section";
import { PopularCategories } from "./components/popular-categories";
import { TrendingPrompts } from "./components/trending-prompts";
import { CategoriesGrid } from "./components/categories-grid";
import { LatestPrompts } from "./components/latest-prompts";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <PopularCategories />
      <TrendingPrompts />
      <LatestPrompts />
      <CategoriesGrid />
    </>
  );
};

export default HomePage;
