"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import RetailHero from "./retail-hero";
import RetailCatalog from "./retail-catalog";
import { normalizeCategory } from "@/lib/category-mapper";

function RetailShopContent() {
  const searchParams = useSearchParams();
  const brandParam = searchParams.get("brand");
  const categoryParam = searchParams.get("category");
  const bikeParam = searchParams.get("bike") || searchParams.get("model");

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeBrand, setActiveBrand] = useState("All Brands");
  const [activeBike, setActiveBike] = useState("All Bikes");
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
          : lower === "all" || lower === "all brands"
          ? "All Brands"
          : brandParam;
      setActiveBrand(mapped);
      setCurrentPage(1);
    }
    if (bikeParam) {
      const lowerBike = bikeParam.toLowerCase();
      const mappedBike =
        lowerBike.includes("70")
          ? "70cc"
          : lowerBike.includes("100")
          ? "100cc"
          : lowerBike.includes("110")
          ? "110cc"
          : lowerBike.includes("125")
          ? "125cc"
          : lowerBike.includes("150")
          ? "150cc"
          : lowerBike.includes("all models") || lowerBike.includes("universal")
          ? "All Models"
          : bikeParam;
      setActiveBike(mappedBike);
      setCurrentPage(1);
    }
    if (categoryParam) {
      const lowerCat = categoryParam.toLowerCase();
      if (lowerCat === "cd70" || lowerCat === "cd-70") {
        setActiveBike("70cc");
        setActiveCategory("All");
      } else if (lowerCat === "cg125" || lowerCat === "cg-125") {
        setActiveBike("125cc");
        setActiveCategory("All");
      } else {
        const mappedCat = normalizeCategory(categoryParam);
        setActiveCategory(mappedCat);
      }
      setCurrentPage(1);
    }
  }, [brandParam, categoryParam, bikeParam]);

  const handleSearchSubmit = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleBrandChange = (brand: string) => {
    setActiveBrand(brand);
    setCurrentPage(1);
  };

  const handleBikeChange = (bike: string) => {
    setActiveBike(bike);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
    setActiveBrand("All Brands");
    setActiveBike("All Bikes");
    setCurrentPage(1);
  };

  return (
    <>
      <RetailHero
        searchQuery={searchQuery}
        onSearchSubmit={handleSearchSubmit}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        activeBrand={activeBrand}
        onBrandChange={handleBrandChange}
        activeBike={activeBike}
        onBikeChange={handleBikeChange}
        onClearFilters={handleClearFilters}
      />
      <RetailCatalog
        searchQuery={searchQuery}
        activeCategory={activeCategory}
        activeBrand={activeBrand}
        activeBike={activeBike}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onClearFilters={handleClearFilters}
      />
    </>
  );
}

export function RetailShop() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <RetailShopContent />
    </Suspense>
  );
}

export default RetailShop;
