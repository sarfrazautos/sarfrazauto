"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import WholesaleHero from "./wholesale-hero";
import WholesaleCatalog from "./wholesale-catalog";

function WholesaleShopContent() {
  const searchParams = useSearchParams();
  const brandParam = searchParams.get("brand");
  const categoryParam = searchParams.get("category");

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeBike, setActiveBike] = useState("All Brands");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (brandParam) {
      const lower = brandParam.toLowerCase();
      const mapped =
        lower === "honda"
          ? "Honda"
          : lower === "yamaha"
          ? "Yamaha"
          : lower === "suzuki"
          ? "Suzuki"
          : lower === "united"
          ? "United"
          : lower === "crown"
          ? "Crown"
          : lower === "super-star"
          ? "Super Star"
          : lower === "unique"
          ? "Unique"
          : brandParam;
      setActiveBike(mapped);
      setCurrentPage(1);
    }
    if (categoryParam) {
      setActiveCategory(categoryParam);
      setCurrentPage(1);
    }
  }, [brandParam, categoryParam]);

  const handleSearchSubmit = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleBikeChange = (bike: string) => {
    setActiveBike(bike);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
    setActiveBike("All Brands");
    setCurrentPage(1);
  };

  return (
    <>
      <WholesaleHero
        searchQuery={searchQuery}
        onSearchSubmit={handleSearchSubmit}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        activeBike={activeBike}
        onBikeChange={handleBikeChange}
        onClearFilters={handleClearFilters}
      />
      <WholesaleCatalog
        searchQuery={searchQuery}
        activeCategory={activeCategory}
        activeBike={activeBike}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onClearFilters={handleClearFilters}
      />
    </>
  );
}

export function WholesaleShop() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <WholesaleShopContent />
    </Suspense>
  );
}

export default WholesaleShop;
