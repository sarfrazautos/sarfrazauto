"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WishlistCard, WishlistItem } from "./wishlist-card";
import { WishlistEmpty } from "./wishlist-empty";

const defaultWishlistItems: WishlistItem[] = [
  {
    id: "wl-1",
    name: "Complete 70cc Cylinder Head Assembly",
    price: 8450,
    originalPrice: 11200,
    category: "Engine & Parts",
    bike: "Honda CD70 / China 70cc",
    inStock: true,
    badge: "-25%",
    image: "/bike-engine.png",
  },
  {
    id: "wl-2",
    name: "Heavy Duty Alloy Wheel Rim Hub Assembly",
    price: 4950,
    originalPrice: 5800,
    category: "Wheel & Suspension",
    bike: "Honda CD70 / CG125",
    inStock: true,
    badge: "-15%",
    image: "/wheel-rim.png",
  },
  {
    id: "wl-3",
    name: "Crown Heavy Duty Clutch Plate Set (5 Pcs)",
    price: 3150,
    originalPrice: 3900,
    category: "Clutch & Gears",
    bike: "Honda CG125 Special Edition",
    inStock: true,
    badge: "-20%",
    image: "/wholesale-bulk.png",
  },
  {
    id: "wl-4",
    name: "125cc Piston & Ring Kit (Standard 0.00)",
    price: 4200,
    originalPrice: 4700,
    category: "Engine & Parts",
    bike: "Honda CG125 Euro II",
    inStock: true,
    badge: "-10%",
    image: "/bike-engine.png",
  },
];

export function WishlistSection() {
  const [items, setItems] = useState<WishlistItem[]>(defaultWishlistItems);

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setItems([]);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-500 mb-6">
        <Link href="/" className="hover:text-neutral-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-neutral-900 font-medium">My Wishlist</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 mb-8 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900">
            My Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            {items.length === 0
              ? "No saved items"
              : `You have ${items.length} saved ${items.length === 1 ? "item" : "items"}`}
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="cursor-pointer text-xs h-9 border-neutral-200 text-neutral-600 hover:text-red-600 hover:bg-neutral-50"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Clear Wishlist
            </Button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <WishlistEmpty />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <WishlistCard
              key={item.id}
              item={item}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-12 pt-6 border-t border-neutral-200 flex items-center justify-between">
          <Link href="/retail">
            <Button variant="ghost" size="sm" className="cursor-pointer text-neutral-600">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
export default WishlistSection;
