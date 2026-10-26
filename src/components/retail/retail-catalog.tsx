"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Eye, Plus, Star, PackageOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getProducts } from "@/lib/api/products";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function RetailCatalog({
  searchQuery = "",
  activeCategory = "All",
  activeBike = "All Brands",
  currentPage = 1,
  onPageChange,
  onClearFilters,
  className = "",
}: {
  searchQuery?: string;
  activeCategory?: string;
  activeBike?: string;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onClearFilters?: () => void;
  className?: string;
}) {
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const brandQuery =
    !activeBike || activeBike === "All Brands" || activeBike === "All"
      ? ""
      : activeBike === "Others"
      ? ""
      : activeBike;

  const categoryQuery =
    !activeCategory || activeCategory === "All" ? "" : activeCategory;

  const { data, isLoading } = useQuery({
    queryKey: [
      "retail-catalog",
      {
        page: currentPage,
        limit: 16,
        search: searchQuery,
        category: categoryQuery,
        brand: brandQuery,
      },
    ],
    queryFn: () =>
      getProducts({
        page: currentPage,
        limit: 16,
        type: "retail",
        search: searchQuery,
        category: categoryQuery,
        brand: brandQuery,
      }),
  });

  const products = data?.products || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = (product: any, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const idStr = String(product.id);
    const mainImg =
      product.images?.[product.mainImageIndex || 0] || product.images?.[0] || "/bike-engine.png";

    addItem({
      productId: product.id,
      type: "retail",
      title: product.name,
      category: product.category,
      price: Number(product.price) || 0,
      image: mainImg,
      specs: product.compatibleBike || "Genuine Replacement",
      inStock: product.stockStatus !== "out_of_stock",
    });

    setAddedItems((prev) => ({ ...prev, [idStr]: true }));
    toast.success(`Added ${product.name} to cart!`, {
      action: {
        label: "View Cart",
        onClick: () => router.push("/cart"),
      },
    });
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [idStr]: false }));
    }, 1800);
  };

  return (
    <section className={cn("w-full bg-white md:pt-6 md:pb-20 pb-16", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 md:gap-y-16 gap-y-10">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="flex flex-col animate-pulse">
                <div className="aspect-square w-full rounded-2xl bg-neutral-100" />
                <div className="mt-3.5 flex flex-col gap-2">
                  <div className="h-3 bg-neutral-100 rounded w-1/3" />
                  <div className="h-4 bg-neutral-100 rounded w-3/4" />
                  <div className="h-4 bg-neutral-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-neutral-200">
            <PackageOpen className="size-10 text-neutral-300 mx-auto mb-2" />
            <h3 className="text-base font-semibold text-neutral-900">
              No spare parts found
            </h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `We couldn't find matching parts for "${searchQuery}". Try another keyword or clear filters.`
                : "No parts match the selected filters. Try choosing another brand or category."}
            </p>
            {onClearFilters && (
              <Button
                type="button"
                variant="outline"
                onClick={onClearFilters}
                className="mt-4 h-9 px-4 text-xs font-medium cursor-pointer"
              >
                Clear all filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 md:gap-y-16 gap-y-10">
            {products.map((product: any) => {
              const isAdded = !!addedItems[String(product.id)];
              const primaryImage =
                Array.isArray(product.images) && product.images.length > 0
                  ? product.images[product.mainImageIndex || 0] || product.images[0]
                  : "/bike-engine.png";

              const productHref = product.slug ? `/product-overview/${product.slug}` : `/product-overview?id=${product.id}`;

              return (
                <div key={product.id} className="group flex flex-col">
                  <Link
                    href={productHref}
                    className="relative aspect-square w-full rounded-2xl bg-[#f4f4f5] overflow-hidden p-6 flex items-center justify-center transition-all duration-300 group-hover:bg-[#ebebee]"
                  >
                    {product.badge && (
                      <span className="absolute top-3.5 left-3.5 text-xs font-semibold px-2.5 py-0.5 rounded-full z-10 bg-red-100 text-red-600">
                        {product.badge}
                      </span>
                    )}
                    <img
                      src={primaryImage}
                      alt={product.name}
                      className="w-full h-full object-contain drop-shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:brightness-75"
                    />

                    <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center pointer-events-none">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-neutral-900 text-xs font-semibold shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <Eye className="size-3.5 text-neutral-700" />
                        <span>Preview</span>
                      </span>
                    </div>
                  </Link>

                  <div className="mt-3.5 flex flex-col gap-1 flex-1">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-neutral-500 font-medium truncate">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1 text-neutral-700 font-semibold shrink-0">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating || "5.0"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 mt-0.5">
                      <Link href={productHref} className="min-w-0 flex-1 group/title">
                        <h3 className="font-medium text-neutral-900 group-hover/title:text-red-600 transition-colors text-sm md:text-base leading-snug line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="font-semibold text-neutral-900 text-sm md:text-base">
                            Rs. {Number(product.price || 0).toLocaleString()}
                          </p>
                          {product.originalPrice && (
                            <span className="text-xs md:text-sm text-red-600 line-through font-normal">
                              Rs. {Number(product.originalPrice).toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5 text-xs">
                          <span className="text-neutral-400 font-medium">Brand:</span>
                          <span className="font-semibold text-neutral-800">
                            {product.brand}
                          </span>
                        </div>
                      </Link>

                      <button
                        type="button"
                        onClick={(e) => handleAdd(product, e)}
                        aria-label={`Add ${product.name} to order`}
                        className={cn(
                          "shrink-0 size-9 rounded-full flex items-center justify-center transition-all shadow-sm cursor-pointer mt-0.5",
                          isAdded
                            ? "bg-green-600 text-white scale-105"
                            : "bg-red-600 hover:bg-red-700 active:scale-95 text-white"
                        )}
                      >
                        {isAdded ? (
                          <Check className="size-4 stroke-[2.5]" />
                        ) : (
                          <Plus className="size-4 stroke-[2.5]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center w-full pt-12 md:pt-16">
            <Pagination>
              <PaginationContent className="bg-white border border-neutral-200 p-1 rounded-full shadow-xs">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1 && onPageChange) onPageChange(currentPage - 1);
                    }}
                    className="rounded-full hover:bg-neutral-100 cursor-pointer text-xs"
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const page = i + 1;
                  const isActive = currentPage === page;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={isActive}
                        onClick={(e) => {
                          e.preventDefault();
                          if (onPageChange) onPageChange(page);
                        }}
                        className={cn(
                          "rounded-full cursor-pointer text-xs size-8",
                          isActive && "bg-neutral-900 text-white hover:bg-neutral-800 hover:text-white"
                        )}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages && onPageChange) onPageChange(currentPage + 1);
                    }}
                    className="rounded-full hover:bg-neutral-100 cursor-pointer text-xs"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </section>
  );
}

export default RetailCatalog;
