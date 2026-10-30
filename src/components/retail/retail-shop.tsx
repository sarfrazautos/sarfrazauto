"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RetailHero from "./retail-hero";
import RetailCatalog from "./retail-catalog";
import { normalizeCategory } from "@/lib/category-mapper";

function RetailShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParam = searchParams.get("search") || searchParams.get("q") || "";
  const brandParam = searchParams.get("brand");
  const categoryParam = searchParams.get("category");
  const bikeParam = searchParams.get("bike") || searchParams.get("model");

  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeBrand, setActiveBrand] = useState("All Brands");
  const [activeBike, setActiveBike] = useState("All Bikes");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setSearchQuery(searchParam);

    if (brandParam) {
      const lower = brandParam.toLowerCase();
      const mapped =
        lower === "honda"
          ? "Honda"
          : lower === "super-power" || lower === "super power"
          ? "Super Power"
          : lower === "yamaha"
          ? "Yamaha"
          : lower === "suzuki"
          ? "Suzuki"
          : lower === "united"
          ? "United"
          : lower === "crown"
          ? "Crown"
          : lower === "super-star" || lower === "super star"
          ? "Super Star"
          : lower === "unique"
          ? "Unique"
          : lower === "servis" || lower === "service"
          ? "Servis"
          : lower === "panther"
          ? "Panther"
          : lower === "diamond-tyres" || lower === "diamond"
          ? "Diamond Tyres"
          : lower === "general-tyre" || lower === "general" || lower === "general-tire"
          ? "General Tyre"
          : lower === "all" || lower === "all brands"
          ? "All Brands"
          : brandParam;
      setActiveBrand(mapped);
    } else {
      setActiveBrand("All Brands");
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
    } else {
      setActiveBike("All Bikes");
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
    } else {
      setActiveCategory("All");
    }

    setCurrentPage(1);
  }, [searchParam, brandParam, categoryParam, bikeParam]);

  const handleSearchSubmit = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (val.trim()) {
      params.set("search", val.trim());
    } else {
      params.delete("search");
      params.delete("q");
    }
    const qs = params.toString();
    router.replace(qs ? `/retail?${qs}` : "/retail");
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (cat && cat !== "All") {
      params.set("category", cat);
    } else {
      params.delete("category");
    }
    const qs = params.toString();
    router.replace(qs ? `/retail?${qs}` : "/retail");
  };

  const handleBrandChange = (brand: string) => {
    setActiveBrand(brand);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (brand && brand !== "All Brands" && brand !== "All") {
      params.set("brand", brand);
    } else {
      params.delete("brand");
    }
    const qs = params.toString();
    router.replace(qs ? `/retail?${qs}` : "/retail");
  };

  const handleBikeChange = (bike: string) => {
    setActiveBike(bike);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (bike && bike !== "All Bikes" && bike !== "All") {
      params.set("bike", bike);
    } else {
      params.delete("bike");
      params.delete("model");
    }
    const qs = params.toString();
    router.replace(qs ? `/retail?${qs}` : "/retail");
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
    setActiveBrand("All Brands");
    setActiveBike("All Bikes");
    setCurrentPage(1);
    router.replace("/retail");
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
