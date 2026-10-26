"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getProducts } from "@/lib/api/products";
import { useCartStore } from "@/lib/store/cart-store";

export function RelatedRetailProducts({
  currentProductId,
  category,
  className = "",
}: {
  currentProductId?: number | string;
  category?: string;
  className?: string;
}) {
  const router = useRouter();
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const addItem = useCartStore((state) => state.addItem);

  const { data, isLoading } = useQuery({
    queryKey: ["related-products", currentProductId, category],
    queryFn: async () => {
      const res = await getProducts({ limit: 12, category: category || "" });
      const currentIdNum = currentProductId ? Number(currentProductId) : null;
      let items = (res.products || []).filter((p: any) => p.id !== currentIdNum);

      if (items.length < 4) {
        const fallbackRes = await getProducts({ limit: 12 });
        const fallbackItems = (fallbackRes.products || []).filter(
          (p: any) => p.id !== currentIdNum && !items.some((existing: any) => existing.id === p.id)
        );
        items = [...items, ...fallbackItems];
      }

      return items.slice(0, 4);
    },
  });

  const products = data || [];

  const handleAdd = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    const mainImg =
      product.images?.[product.mainImageIndex || 0] ||
      product.images?.[0] ||
      "/bike-engine.png";

    addItem({
      productId: product.id,
      type: "retail",
      title: product.name,
      category: product.category,
      price: Number(product.price) || 0,
      image: mainImg,
      specs: product.compatibleBike || "Standard Fit",
      inStock: product.stockStatus !== "out_of_stock",
    });

    setAddedItems((prev) => ({ ...prev, [String(product.id)]: true }));
    toast.success(`Added ${product.name} to cart`, {
      action: {
        label: "View Cart",
        onClick: () => router.push("/cart"),
      },
    });
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [String(product.id)]: false }));
    }, 1800);
  };

  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <section className={cn("w-full bg-white py-12 md:py-16 border-t border-neutral-100", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950">
            You may also like
          </h2>
          <p className="text-sm text-neutral-500 mt-1.5">
            Recommended replacement parts and compatible components for your engine overhaul.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex flex-col animate-pulse">
                <div className="aspect-square w-full rounded-2xl bg-neutral-100" />
                <div className="mt-3.5 flex flex-col gap-2">
                  <div className="h-4 bg-neutral-100 rounded w-3/4" />
                  <div className="h-4 bg-neutral-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
                      className="w-full h-full object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>

                  <div className="flex items-center justify-between gap-3 mt-3.5">
                    <Link href={productHref} className="min-w-0 flex-1 group/title">
                      <h3 className="font-medium text-neutral-900 group-hover/title:text-red-600 transition-colors text-sm md:text-base leading-snug line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="font-semibold text-neutral-900 text-sm md:text-base mt-0.5">
                        Rs. {Number(product.price || 0).toLocaleString()}
                      </p>
                    </Link>

                    <button
                      type="button"
                      onClick={(e) => handleAdd(product, e)}
                      aria-label={`Add ${product.name} to cart`}
                      className={cn(
                        "shrink-0 size-9 rounded-full flex items-center justify-center transition-all shadow-sm cursor-pointer",
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
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default RelatedRetailProducts;
