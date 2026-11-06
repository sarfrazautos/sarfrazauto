"use client";

import { useState, useEffect } from "react";
import { Search, RotateCcw, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_CATEGORIES } from "@/lib/category-mapper";
import { BRANDS, BIKES } from "@/components/retail/retail-hero";

const CATEGORIES = ALL_CATEGORIES;

export function WholesaleHero({
  searchQuery,
  onSearchSubmit,
  activeCategory,
  onCategoryChange,
  activeBrand = "All Brands",
  onBrandChange,
  activeBike = "All Bikes",
  onBikeChange,
  onClearFilters,
  className = "",
}: {
  searchQuery: string;
  onSearchSubmit: (val: string) => void;
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  activeBrand?: string;
  onBrandChange?: (brand: string) => void;
  activeBike?: string;
  onBikeChange?: (bike: string) => void;
  onClearFilters?: () => void;
  className?: string;
}) {
  const [searchInput, setSearchInput] = useState(searchQuery || "");
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    setSearchInput(searchQuery || "");
  }, [searchQuery]);

  useEffect(() => {
    if (searchInput === (searchQuery || "")) {
      setIsDebouncing(false);
      return;
    }

    setIsDebouncing(true);
    const timer = setTimeout(() => {
      onSearchSubmit(searchInput.trim());
      setIsDebouncing(false);
    }, 750);

    return () => clearTimeout(timer);
  }, [searchInput, searchQuery, onSearchSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearchSubmit(searchInput.trim());
      setIsDebouncing(false);
    }
  };

  const hasActiveFilters = Boolean(
    searchQuery ||
    searchInput ||
    (activeCategory && activeCategory !== "All") ||
    (activeBrand && activeBrand !== "All Brands" && activeBrand !== "All") ||
    (activeBike && activeBike !== "All Bikes" && activeBike !== "All")
  );

  return (
    <section className={cn("w-full bg-white pt-4 sm:pt-6 md:pt-8 pb-8", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-4xl md:text-5xl font-semibold tracking-tight capitalize text-neutral-950 md:text-start text-center leading-tight">
            Wholesale bulk &amp;{" "}
            <span className="text-red-600">dealer supply.</span>
          </h1>

          <p className="text-neutral-500 text-sm sm:text-base mt-3 leading-relaxed md:block hidden">
            <span>
              Direct importer rates for registered workshop owners and regional parts retailers.
            </span>
          </p>
        </div>

        <div className="mt-8 flex flex-col xl:flex-row gap-3 sm:gap-4 items-stretch xl:items-center justify-between">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none" />
            <Input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search bulk parts (e.g. cylinder, clutch, piston)..."
              className="w-full h-10 pl-10 pr-10 text-sm transition-all bg-white"
            />
            {isDebouncing ? (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <Loader2 className="size-4 animate-spin text-neutral-400" />
              </div>
            ) : searchInput ? (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  onSearchSubmit("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 rounded-full cursor-pointer transition-colors"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-stretch sm:items-center gap-2.5 sm:gap-3">
            <Select value={activeCategory} onValueChange={(val) => onCategoryChange(val as string)}>
              <SelectTrigger className="w-full sm:w-[170px] h-10">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={activeBike} onValueChange={(val) => onBikeChange?.(val as string)}>
              <SelectTrigger className="w-full sm:w-[165px] h-10">
                <SelectValue placeholder="Select Bike" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Bike Models</SelectLabel>
                  {BIKES.map((bike) => (
                    <SelectItem key={bike.id} value={bike.value}>
                      {bike.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={activeBrand} onValueChange={(val) => onBrandChange?.(val as string)}>
              <SelectTrigger className="w-full sm:w-[150px] h-10">
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Brands</SelectLabel>
                  {BRANDS.map((brand) => (
                    <SelectItem key={brand.id} value={brand.value}>
                      {brand.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {hasActiveFilters && onClearFilters && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchInput("");
                  onClearFilters();
                }}
                className="h-10 px-3 text-xs text-neutral-600 hover:text-neutral-900 border-neutral-300 gap-1.5 cursor-pointer shrink-0"
              >
                <RotateCcw className="size-3.5" />
                <span>Clear Filters</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WholesaleHero;
