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

const BIKES = [
  { id: "all", name: "All Brands" },
  { id: "crown", name: "Crown" },
  { id: "honda", name: "Honda" },
  { id: "yamaha", name: "Yamaha" },
  { id: "suzuki", name: "Suzuki" },
  { id: "united", name: "United" },
  { id: "super-power", name: "Super Power" },
  { id: "unique", name: "Unique" },
  { id: "road-prince", name: "Road Prince" },
  { id: "super-star", name: "Super Star" },
  { id: "hi-speed", name: "Hi-Speed" },
  { id: "habib", name: "Habib" },
  { id: "others", name: "Others" },
];

const CATEGORIES = [
  "All",
  "Cylinders & Heads",
  "Engine Blocks",
  "Crankshafts",
  "Clutch Plates",
  "Carburetors",
  "Others",
];

export function RetailHero({
  searchQuery,
  onSearchSubmit,
  activeCategory,
  onCategoryChange,
  activeBike = "All Brands",
  onBikeChange,
  onClearFilters,
  className = "",
}: {
  searchQuery: string;
  onSearchSubmit: (val: string) => void;
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
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
    (activeBike && activeBike !== "All Brands" && activeBike !== "All")
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

        <div className="mt-8 flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch lg:items-center justify-between">
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

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Select value={activeCategory} onValueChange={(val) => onCategoryChange(val as string)}>
              <SelectTrigger className="w-full sm:w-[190px] h-10">
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
              <SelectTrigger className="w-full sm:w-[190px] h-10">
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Motorcycle Brands</SelectLabel>
                  {BIKES.map((bike) => (
                    <SelectItem key={bike.id} value={bike.name}>
                      {bike.name}
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
