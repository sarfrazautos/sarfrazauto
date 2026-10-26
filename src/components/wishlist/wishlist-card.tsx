"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, HeartCrack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  bike: string;
  inStock: boolean;
  image: string;
  badge?: string;
}

interface WishlistCardProps {
  item: WishlistItem;
  onRemove: (id: string) => void;
}

export function WishlistCard({ item, onRemove }: WishlistCardProps) {
  return (
    <Card className="overflow-hidden border border-neutral-200 bg-white transition-all hover:border-neutral-300 py-0">
      <div className="relative aspect-square w-full bg-neutral-50 overflow-hidden flex items-center justify-center p-6">
        {item.badge && (
          <Badge className="absolute top-3 left-3 bg-red-600 text-white hover:bg-red-700 font-semibold border-none">
            {item.badge}
          </Badge>
        )}
        <button
          onClick={() => onRemove(item.id)}
          aria-label="Unwishlist"
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer"
        >
          <HeartCrack className="w-4 h-4" />
        </button>
        <Link href="/product-overview" className="w-full h-full flex items-center justify-center">
          <Image
            src={item.image}
            alt={item.name}
            width={240}
            height={240}
            className="object-contain max-h-48 transition-transform duration-300 hover:scale-105"
          />
        </Link>
      </div>

      <CardContent className="p-4 sm:p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              {item.category}
            </span>
            <span className="inline-flex items-center text-xs font-medium text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
              {item.inStock ? "In Stock" : "Backorder"}
            </span>
          </div>

          <Link href="/product-overview" className="group">
            <h3 className="font-semibold text-sm sm:text-base text-neutral-900 line-clamp-2 group-hover:text-red-600 transition-colors">
              {item.name}
            </h3>
          </Link>

          <p className="text-xs text-neutral-500 mt-1 mb-3">
            Fitment: <span className="font-medium text-neutral-700">{item.bike}</span>
          </p>
        </div>

        <div className="pt-3 border-t border-neutral-100 flex flex-col gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-neutral-900">
              Rs. {item.price.toLocaleString()}
            </span>
            {item.originalPrice && (
              <span className="text-xs text-neutral-400 line-through">
                Rs. {item.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/product-overview" className="flex-1">
              <Button className="w-full h-10 cursor-pointer text-xs sm:text-sm font-medium">
                Visit Product
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => onRemove(item.id)}
              className="h-10 px-3 cursor-pointer text-xs text-neutral-600 hover:text-red-600 hover:border-red-200"
            >
              Unwishlist
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
