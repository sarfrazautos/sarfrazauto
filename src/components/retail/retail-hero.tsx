"use client";

import { useState, useEffect } from "react";
import { Search, RotateCcw } from "lucide-react";
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

export const BRANDS = [
  { id: "all", label: "All Brands", value: "All Brands" },
  { id: "crown", label: "Crown", value: "Crown" },
  { id: "honda", label: "Honda", value: "Honda" },
  { id: "yamaha", label: "Yamaha", value: "Yamaha" },
  { id: "suzuki", label: "Suzuki", value: "Suzuki" },
  { id: "united", label: "United", value: "United" },
  { id: "super-power", label: "Super Power", value: "Super Power" },
  { id: "unique", label: "Unique", value: "Unique" },
  { id: "road-prince", label: "Road Prince", value: "Road Prince" },
  { id: "super-star", label: "Super Star", value: "Super Star" },
  { id: "hi-speed", label: "Hi-Speed", value: "Hi-Speed" },
  { id: "habib", label: "Habib", value: "Habib" },
  { id: "others", label: "Others", value: "Others" },
];

export const BIKES = [
  { id: "all", label: "All Bikes", value: "All Bikes" },
  { id: "70cc", label: "70 Bike (CD 70)", value: "70cc" },
  { id: "100cc", label: "100 Bike (CD 100)", value: "100cc" },
  { id: "110cc", label: "110 Bike", value: "110cc" },
  { id: "125cc", label: "125 Bike (CG 125)", value: "125cc" },
  { id: "150cc", label: "150 Bike", value: "150cc" },
  { id: "all-models", label: "Universal / Other", value: "All Models" },
];

const CATEGORIES = ALL_CATEGORIES;

export function RetailHero({
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
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(searchInput.trim());
  };

  const hasActiveFilters = Boolean(
    searchQuery ||
    searchInput ||
    (activeCategory && activeCategory !== "All") ||
    (activeBrand && activeBrand !== "All Brands" && activeBrand !== "All") ||
    (activeBike && activeBike !== "All Bikes" && activeBike !== "All")
  );

  return (
    <section className={cn("w-full bg-white pt-12 md:pt-16 pb-8", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-4xl md:text-5xl font-semibold tracking-tight capitalize text-neutral-950 md:text-start text-center leading-tight">
            Bike parts &amp;{" "}
            <span className="text-red-600">retail counter.</span>
          </h1>

          <p className="text-neutral-500 text-sm sm:text-base mt-3 leading-relaxed md:block hidden">
            <span>
              Genuine single replacement parts &amp; overhaul kits at wholesale rates. Instant Saddar pickup or delivery.
            </span>
          </p>
        </div>

        <div className="mt-8 flex flex-col xl:flex-row gap-3 sm:gap-4 items-stretch xl:items-center justify-between">
          <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-1 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
              <Input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search parts by name (e.g. cylinder, clutch, piston)..."
                className="w-full h-10 pl-10 pr-4 text-sm transition-all bg-white"
              />
            </div>
            <Button
              type="submit"
              className="h-10 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg cursor-pointer shrink-0"
            >
              Search
            </Button>
          </form>

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

export default RetailHero;
