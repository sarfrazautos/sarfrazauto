"use client";

import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { SearchCombobox } from "@/components/search/search-combobox";

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
  const hasActiveFilters = Boolean(
    searchQuery ||
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
          <SearchCombobox
            searchQuery={searchQuery}
            onSearchSubmit={onSearchSubmit}
            placeholder="Search bulk parts (e.g. cylinder, clutch, piston)..."
            type="wholesale"
          />

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
                onClick={onClearFilters}
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
