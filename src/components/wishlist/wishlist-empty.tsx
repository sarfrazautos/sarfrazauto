"use client";

import Link from "next/link";
import { HeartOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

export function WishlistEmpty() {
  const { data: session } = useSession();
  const isAuthenticated = Boolean(session?.user);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-5">
        <HeartOff className="w-8 h-8" />
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">
        Your Wishlist is Empty
      </h3>
      <p className="text-neutral-500 max-w-md text-sm sm:text-base mb-8">
        {isAuthenticated
          ? "You haven't saved any wholesale carton parts yet. Explore our wholesale catalog and save your favorites."
          : "You haven't saved any motorcycle parts yet. Explore our genuine Crown retail catalog or wholesale cartons and click the heart icon to save your favorites."}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {!isAuthenticated && (
          <Link href="/retail">
            <Button size="lg" className="h-11 px-8 cursor-pointer w-full sm:w-auto">
              Browse Retail Catalog
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        )}
        <Link href="/wholesale">
          <Button
            variant={isAuthenticated ? "default" : "outline"}
            size="lg"
            className="h-11 px-8 cursor-pointer w-full sm:w-auto"
          >
            Wholesale Cartons
            {isAuthenticated && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default WishlistEmpty;
