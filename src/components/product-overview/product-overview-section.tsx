"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LuCheck,
  LuHeart,
  LuHouse,
  LuRotateCcw,
  LuShare2,
  LuShoppingCart,
  LuStar,
  LuTruck,
} from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getColorHex } from "@/lib/product-colors";
import { getProductById, getProducts } from "@/lib/api/products";
import { useCartStore } from "@/lib/store/cart-store";
import RelatedProducts from "./related-products";

function ProductOverviewContent({
  className = "",
  slug,
  defaultType = "retail",
}: {
  className?: string;
  slug?: string;
  defaultType?: "retail" | "wholesale";
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productIdentifier = slug || searchParams.get("slug") || searchParams.get("id");

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product-detail", productIdentifier, defaultType],
    queryFn: async () => {
      if (productIdentifier) {
        return getProductById(productIdentifier);
      }
      const all = await getProducts({ type: defaultType, limit: 1 });
      return all.products?.[0] || null;
    },
  });

  const isWholesale = (product?.type || defaultType).toLowerCase() === "wholesale";

  const handleAddToCart = () => {
    if (!product) return;
    const currentColor = product.colors?.[selectedColorIndex] || "";
    const mainImg =
      product.images?.[product.mainImageIndex || 0] || product.images?.[0] || "/bike-engine.png";

    addItem({
      productId: product.id,
      type: isWholesale ? "wholesale" : "retail",
      title: product.name,
      category: product.category,
      price: Number(product.price) || 0,
      image: mainImg,
      color: currentColor,
      specs: currentColor || product.compatibleBike || "Standard Fit",
      packaging: isWholesale ? "Sealed Export Master Carton" : undefined,
      inStock: product.stockStatus !== "out_of_stock",
    });

    setIsAdded(true);
    toast.success(
      isWholesale
        ? `Added ${product.name} to wholesale carton order!`
        : `Added ${product.name} to cart!`,
      {
        action: {
          label: "View Cart",
          onClick: () => router.push(isWholesale ? "/cart?tab=wholesale" : "/cart"),
        },
      }
    );
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    if (!isWishlisted) {
      toast.success(
        isWholesale
          ? "Added to wholesale favorites!"
          : "Added to wishlist!"
      );
    } else {
      toast.info(
        isWholesale
          ? "Removed from wholesale favorites"
          : "Removed from wishlist"
      );
    }
  };

  if (isLoading) {
    return (
      <section className={cn("w-full bg-white py-10 md:py-16", className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 animate-pulse">
            <div className="lg:col-span-7 flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex sm:flex-col gap-3">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="size-20 sm:size-22 rounded-2xl bg-neutral-100" />
                ))}
              </div>
              <div className="flex-1 aspect-square sm:min-h-[520px] rounded-3xl bg-neutral-100" />
            </div>
            <div className="lg:col-span-5 flex flex-col space-y-6">
              <div className="h-4 bg-neutral-100 rounded w-1/3" />
              <div className="h-8 bg-neutral-100 rounded w-4/5" />
              <div className="h-6 bg-neutral-100 rounded w-1/4" />
              <div className="h-10 bg-neutral-100 rounded w-1/2" />
              <div className="h-24 bg-neutral-100 rounded w-full" />
              <div className="h-12 bg-neutral-100 rounded w-full" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !product) {
    return (
      <section className={cn("w-full bg-white py-20 text-center", className)}>
        <div className="max-w-md mx-auto px-4">
          <h2 className="text-xl font-bold text-neutral-900">
            {isWholesale ? "Wholesale Product Not Found" : "Product Not Found"}
          </h2>
          <p className="text-sm text-neutral-500 mt-2">
            {isWholesale
              ? "The wholesale master carton you are looking for is either unavailable or has been removed."
              : "The spare part you are looking for is either unavailable or has been removed."}
          </p>
          <Link href={isWholesale ? "/wholesale" : "/retail"}>
            <Button className="mt-6 bg-red-600 hover:bg-red-700 text-white text-xs">
              {isWholesale ? "Back to Wholesale Shop" : "Back to Retail Shop"}
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  const rawImages =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [isWholesale ? "/wholesale-bulk.png" : "/bike-engine.png"];

  const currentMainImage = rawImages[activeImageIndex] || rawImages[0];

  const colors = (
    Array.isArray(product.colors)
      ? product.colors.filter(
          (c: any) =>
            typeof c === "string" &&
            c.trim().length > 0 &&
            c.trim().toLowerCase() !== "standard"
        )
      : []
  ) as string[];

  const hasDiscount =
    product.originalPrice && Number(product.originalPrice) > Number(product.price);

  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const stockStatusText = (product.stockStatus || "instock").toLowerCase();
  const isOutOfStock = stockStatusText === "outofstock" || stockStatusText === "out of stock";
  const isLowStock = stockStatusText === "lowstock" || stockStatusText === "low stock";

  return (
    <>
      <section className={cn("w-full bg-white text-neutral-900 py-10 md:py-16", className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 sm:gap-6">
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0 scrollbar-none">
                {rawImages.map((imgUrl: string, idx: number) => {
                  const isActive = activeImageIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={cn(
                        "size-20 sm:size-22 rounded-2xl p-2.5 bg-[#f5f5f7] border-2 transition-all flex items-center justify-center cursor-pointer shrink-0 overflow-hidden",
                        isActive
                          ? "border-neutral-950 shadow-xs"
                          : "border-transparent hover:border-neutral-300"
                      )}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  );
                })}
              </div>

              <div className="relative flex-1 aspect-square sm:aspect-auto sm:min-h-[580px] rounded-3xl bg-[#f5f5f7] p-8 sm:p-12 flex items-center justify-center overflow-hidden">
                <img
                  src={currentMainImage}
                  alt={product.name}
                  className="w-full h-full max-h-[440px] object-contain drop-shadow-md transition-all duration-300 transform hover:scale-105"
                />
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col space-y-6">
              <nav className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                <Link href="/" className="hover:text-neutral-900 transition-colors">
                  <LuHouse className="size-3.5" />
                </Link>
                <span>&rsaquo;</span>
                <Link
                  href={isWholesale ? "/wholesale" : "/retail"}
                  className="hover:text-neutral-900 transition-colors"
                >
                  {isWholesale ? "Wholesale Counter" : "Retail Counter"}
                </Link>
                <span>&rsaquo;</span>
                <span className="text-neutral-900 font-semibold truncate">
                  {product.category}
                </span>
              </nav>

              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-neutral-950 leading-tight">
                  {product.name}
                </h1>

                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    <LuStar className="size-4 fill-amber-500 stroke-amber-500" />
                    <span className="text-xs font-semibold text-neutral-900 ml-1">
                      {product.rating || "5.0"}
                    </span>
                  </div>

                  <span className="text-xs font-medium text-neutral-400">&bull;</span>

                  <span className="text-xs font-semibold text-neutral-800">
                    Brand: <span className="text-red-600">{product.brand}</span>
                  </span>

                  <span className="text-xs font-medium text-neutral-400">&bull;</span>

                  {isOutOfStock ? (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                      Out of Stock
                    </Badge>
                  ) : isLowStock ? (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                      Low Stock
                    </Badge>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      In Stock
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-baseline gap-3 pt-5 border-t border-neutral-100">
                <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-950">
                  Rs. {Number(product.price || 0).toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-neutral-400 line-through font-normal">
                    Rs. {Number(product.originalPrice).toLocaleString()}
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
                    {discountPercent}% Off
                  </span>
                )}
              </div>

              <p className="text-sm text-neutral-600 leading-relaxed">
                {product.description ||
                  (isWholesale
                    ? `Factory sealed ${product.brand} ${product.name} master carton packaging engineered for wholesale dispatch and bulk motorcycle spare parts workshops.`
                    : `Genuine ${product.brand} ${product.name} designed specifically for motorcycle engine overhaul and long-lasting performance.`)}
              </p>

              {colors.length > 0 && (
                <div className="flex flex-col gap-3 pt-1">
                  <div className="text-sm font-semibold text-neutral-900">
                    Color:{" "}
                    <span className="font-normal text-neutral-600">
                      {colors[selectedColorIndex] || colors[0]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3.5 pt-1.5">
                    {colors.map((colorName: string, idx: number) => {
                      const isSelected = selectedColorIndex === idx;
                      return (
                        <button
                          key={colorName || idx}
                          type="button"
                          aria-label={`Select ${colorName}`}
                          onClick={() => setSelectedColorIndex(idx)}
                          className={cn(
                            "size-7 rounded-full transition-transform cursor-pointer flex items-center justify-center p-0.5",
                            isSelected && "ring-2 ring-neutral-950 ring-offset-2 scale-110"
                          )}
                        >
                          <span
                            className="size-full rounded-full border border-black/10"
                            style={{ backgroundColor: getColorHex(colorName) }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                  <LuCheck className="size-4 text-emerald-600 shrink-0" />
                  <span>
                    Compatible with{" "}
                    {product.compatibleBike &&
                    !product.compatibleBike.toLowerCase().includes("all")
                      ? `${product.compatibleBike} & all bike models`
                      : "all bike models"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                    className={cn(
                      "flex-1 h-11 font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm",
                      isAdded
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    )}
                  >
                    {isAdded ? (
                      <>
                        <LuCheck className="size-4" />
                        <span>
                          {isWholesale ? "Added to Carton Order!" : "Added to Cart!"}
                        </span>
                      </>
                    ) : (
                      <>
                        <LuShoppingCart className="size-4" />
                        <span>
                          {isOutOfStock
                            ? "Out of Stock"
                            : isWholesale
                            ? "Add to Wholesale Cart"
                            : "Add to Cart"}
                        </span>
                      </>
                    )}
                  </Button>

                  <button
                    type="button"
                    onClick={handleToggleWishlist}
                    aria-label="Add to wishlist"
                    className={cn(
                      "size-11 rounded-lg border flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-xs",
                      isWishlisted
                        ? "border-red-200 bg-red-50 text-red-600"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                    )}
                  >
                    <LuHeart className={cn("size-4", isWishlisted && "fill-red-600")} />
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label="Share product"
                    className="size-11 rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-xs"
                  >
                    <LuShare2 className="size-4" />
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-100 space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-neutral-600">
                  <LuTruck className="size-4 text-neutral-500 shrink-0" />
                  <span>
                    {isWholesale
                      ? "Free Bilty dispatch on bulk orders or direct warehouse dock loading"
                      : "Free counter pickup in Saddar or delivery over Rs. 5,000"}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-neutral-600">
                  <LuRotateCcw className="size-4 text-neutral-500 shrink-0" />
                  <span>
                    {isWholesale
                      ? "Direct factory sealed guarantee & 100% genuine wholesale stock"
                      : "Free 7-day fitment exchange & genuine part guarantee"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RelatedProducts
        currentProductId={product.id}
        category={product.category}
        type={isWholesale ? "wholesale" : "retail"}
      />
    </>
  );
}

export function ProductOverviewSection({
  className = "",
  slug,
  defaultType = "retail",
}: {
  className?: string;
  slug?: string;
  defaultType?: "retail" | "wholesale";
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ProductOverviewContent
        className={className}
        slug={slug}
        defaultType={defaultType}
      />
    </Suspense>
  );
}

export default ProductOverviewSection;
