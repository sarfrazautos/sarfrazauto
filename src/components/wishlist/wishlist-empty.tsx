"use client";

import Link from "next/link";
import { HeartOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WishlistEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-5">
        <HeartOff className="w-8 h-8" />
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">
        Your Wishlist is Empty
      </h3>
      <p className="text-neutral-500 max-w-md text-sm sm:text-base mb-8">
        You haven&apos;t saved any motorcycle parts yet. Explore our genuine Crown retail catalog or wholesale cartons and click the heart icon to save your favorites.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Link href="/retail">
          <Button size="lg" className="h-11 px-8 cursor-pointer w-full sm:w-auto">
            Browse Retail Catalog
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
        <Link href="/wholesale">
          <Button variant="outline" size="lg" className="h-11 px-8 cursor-pointer w-full sm:w-auto">
            Wholesale Cartons
          </Button>
        </Link>
      </div>
    </div>
  );
}
