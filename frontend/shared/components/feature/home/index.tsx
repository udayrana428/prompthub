import React from "react";
import { HeroSection } from "./components/hero-section";
import { PopularCategories } from "./components/popular-categories";
import { TrendingPrompts } from "./components/trending-prompts";
import { CategoriesGrid } from "./components/categories-grid";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <PopularCategories />
      <TrendingPrompts />
      <CategoriesGrid />
    </>
  );
};

export default HomePage;
