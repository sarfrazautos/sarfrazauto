"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Store, LogIn, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import WholesaleHero from "./wholesale-hero";
import WholesaleCatalog from "./wholesale-catalog";

function WholesaleShopContent() {
  const { data: session, isPending } = useSession();
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
      const lower = categoryParam.toLowerCase();
      const mappedCat =
        lower === "fuel" || lower === "fuel-and-oils" || lower === "fuel-oil"
          ? "Fuel & Oils"
          : lower === "tyre" || lower === "tyres" || lower === "tire" || lower === "tires"
          ? "Tyres & Tubes"
          : categoryParam;
      setActiveCategory(mappedCat);
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

  if (!isPending && !session?.user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 sm:py-32 text-center">
        <div className="size-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-6 border border-red-100 shadow-xs">
          <Store className="size-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mb-3">
          Wholesale Dealer Access Required
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-md mx-auto mb-8">
          Master carton catalogs, bulk dispatch pricing, and trade schemes are exclusive to registered dealership partners.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/signup?redirect=/wholesale" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto h-11 px-8 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-sm cursor-pointer shadow-xs gap-2">
              <Store className="size-4" />
              <span>Register Dealer Account</span>
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href="/login?redirect=/wholesale" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto h-11 px-7 rounded-xl border-neutral-300 text-neutral-800 hover:bg-neutral-50 text-sm cursor-pointer gap-2">
              <LogIn className="size-4" />
              <span>Dealer Login</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
