"use client";

import Link from "next/link";
import {
  Boxes,
  Check,
  ChevronRight,
  FileText,
  Gift,
  Info,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/store/cart-store";

export function WholesaleCart({ className = "" }: { className?: string }) {
  const {
    wholesaleItems,
    wholesaleCount,
    wholesaleSubtotal,
    wholesaleTotalWeight,
    updateQuantity,
    removeItem,
  } = useCart();

  const { data: schemesData } = useQuery({
    queryKey: ["active-schemes"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/schemes");
        if (!res.ok) return [];
        const json = await res.json();
        return json.products || [];
      } catch {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const getActiveScheme = (item: any) => {
    if (item.scheme && item.scheme.buyQty > 0) {
      return item.scheme;
    }
    if (schemesData && schemesData.length > 0) {
      const found = schemesData.find(
        (s: any) =>
          s.hasScheme &&
          (String(s.productId) === String(item.productId) ||
            s.name?.toLowerCase().trim() === item.title?.toLowerCase().trim())
      );
      if (found && found.buyQty > 0) {
        return {
          id: found.schemeId,
          buyQty: Number(found.buyQty),
          freeQty: Number(found.freeQty) || 1,
          title: `Buy ${found.buyQty} + ${found.freeQty || 1} Free`,
        };
      }
    }
    return null;
  };

  const totalFreePieces = wholesaleItems.reduce((acc, item) => {
    const scheme = getActiveScheme(item);
    if (scheme && scheme.buyQty > 0 && item.quantity >= scheme.buyQty) {
      const freePerThreshold = scheme.freeQty || 1;
      return acc + Math.floor(item.quantity / scheme.buyQty) * freePerThreshold;
    }
    return acc;
  }, 0);

  const totalSchemeSavings = wholesaleItems.reduce((acc, item) => {
    const scheme = getActiveScheme(item);
    if (scheme && scheme.buyQty > 0 && item.quantity >= scheme.buyQty) {
      const freePerThreshold = scheme.freeQty || 1;
      const freeQty = Math.floor(item.quantity / scheme.buyQty) * freePerThreshold;
      return acc + freeQty * item.price;
    }
    return acc;
  }, 0);

  const totalPiecesReceiving = wholesaleCount + totalFreePieces;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-950">
            Wholesale Order ({wholesaleCount} pieces)
          </h2>
          <p className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-emerald-600 mt-2">
            <Check className="size-4 stroke-[2.5]" />
            Direct distributor bulk rates with Bilty / Freight dispatch across Pakistan
          </p>
        </div>

        <Link
          href="/wholesale"
          className="inline-flex items-center gap-1 text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
        >
          Wholesale Catalog
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8 items-start w-full min-w-0">
        <div className="w-full min-w-0 lg:col-span-7 xl:col-span-8 space-y-4">
          {wholesaleItems.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-neutral-200 rounded-2xl p-8">
              <p className="text-neutral-500 text-sm">Your wholesale cart is empty.</p>
              <Link
                href="/wholesale"
                className="inline-flex items-center justify-center mt-4 px-5 py-2.5 rounded-lg bg-neutral-950 text-white text-xs font-medium hover:bg-neutral-800 transition-colors"
              >
                Browse Wholesale Catalog
              </Link>
            </div>
          ) : (
            wholesaleItems.map((item) => {
              const scheme = getActiveScheme(item);
              const hasScheme = Boolean(scheme && scheme.buyQty > 0);
              const isEligible = hasScheme && item.quantity >= scheme.buyQty;
              const freePieces = isEligible
                ? Math.floor(item.quantity / scheme.buyQty) * (scheme.freeQty || 1)
                : 0;

              const cleanPackaging = item.packaging
                ? item.packaging.replace(/master carton/gi, "Factory Pack").replace(/carton/gi, "Pack")
                : null;

              return (
                <div
                  key={item.id}
                  className="relative flex flex-col p-3.5 sm:p-5 rounded-2xl border border-neutral-200/80 bg-[#fafafa] hover:border-neutral-300 transition-colors w-full min-w-0 overflow-hidden"
                >
                  <div className="flex items-start gap-3.5 sm:gap-6 w-full">
                    <div className="relative size-20 sm:size-28 rounded-xl bg-white border border-neutral-200/60 p-2 flex items-center justify-center shrink-0 overflow-hidden self-start">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 pr-6 sm:pr-0">
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-500 uppercase tracking-wide block truncate">
                              {item.category}
                            </span>
                            <h3 className="text-sm sm:text-base font-semibold text-neutral-950 mt-0.5 leading-snug line-clamp-2">
                              {item.title}
                            </h3>
                            <p className="text-xs text-neutral-600 mt-0.5">{item.specs}</p>
                            {cleanPackaging && (
                              <p className="text-[11px] text-neutral-400 mt-0.5">{cleanPackaging}</p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            aria-label="Remove item"
                            className="hidden sm:flex text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer p-1"
                          >
                            <X className="size-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2 mt-2 text-[11px] sm:text-xs">
                          <span className="inline-flex items-center gap-1 font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                            <span className="size-1.5 rounded-full bg-blue-600 animate-pulse" />
                            Factory Sealed
                          </span>
                          <span className="text-neutral-300">&bull;</span>
                          <span className="text-neutral-500 truncate">Saddar / SITE Dock Dispatch</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 mt-3 sm:mt-4 pt-1">
                        <div className="flex items-center rounded-lg border border-neutral-200 bg-white shadow-2xs">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            aria-label="Decrease quantity"
                            className="size-7 sm:size-8 flex items-center justify-center text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50 transition-colors cursor-pointer"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-10 text-center text-xs font-bold text-neutral-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            aria-label="Increase quantity"
                            className="size-7 sm:size-8 flex items-center justify-center text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50 transition-colors cursor-pointer"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-sm sm:text-base font-semibold text-neutral-950 block">
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </span>
                          <span className="text-[11px] text-neutral-500">
                            Rs. {item.price.toLocaleString()} / piece
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove item"
                      className="sm:hidden absolute top-3 right-3 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer p-1"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  {isEligible && (
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-emerald-200/60 bg-emerald-50/70 -mx-3.5 sm:-mx-5 -mb-3.5 sm:-mb-5 p-3 sm:px-5 text-emerald-900 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="flex size-6 items-center justify-center rounded-md bg-emerald-600 text-white shrink-0">
                          <Gift className="size-3.5" />
                        </span>
                        <div>
                          <span className="font-bold text-emerald-950">
                            Trade Scheme Applied: +{freePieces} FREE Piece{freePieces > 1 ? "s" : ""}
                          </span>
                          <span className="text-emerald-700 text-[11px] block sm:inline sm:ml-1.5">
                            (Buy {scheme.buyQty} + {scheme.freeQty} Free)
                          </span>
                        </div>
                      </div>
                      <span className="font-semibold text-emerald-800 text-[11px] bg-emerald-100/90 px-2 py-0.5 rounded-md border border-emerald-300/60">
                        {item.quantity} Paid + {freePieces} Free = {item.quantity + freePieces} Total Pieces
                      </span>
                    </div>
                  )}

                  {hasScheme && !isEligible && (
                    <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-amber-200/60 bg-amber-50/60 -mx-3.5 sm:-mx-5 -mb-3.5 sm:-mb-5 p-2.5 sm:px-5 text-amber-900 text-xs">
                      <Sparkles className="size-3.5 text-amber-600 shrink-0" />
                      <span>
                        Active Scheme: Add <strong>{scheme.buyQty - item.quantity} more</strong> to unlock <strong>+{scheme.freeQty} FREE piece</strong>!
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <div className="rounded-2xl border border-neutral-200 bg-[#fafafa] p-6 space-y-5 sticky top-24">
            <h3 className="text-lg font-semibold text-neutral-950">Wholesale Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-neutral-600">
                <span>Total Quantity</span>
                <span className="font-semibold text-neutral-950">{wholesaleCount} Pieces</span>
              </div>

              {totalFreePieces > 0 && (
                <div className="flex items-center justify-between text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                  <span className="flex items-center gap-1.5 font-semibold text-xs">
                    <Gift className="size-3.5 text-emerald-600" />
                    Free Scheme Items
                  </span>
                  <span className="font-bold text-xs text-emerald-700">
                    +{totalFreePieces} Pieces FREE
                  </span>
                </div>
              )}

              {totalFreePieces > 0 && (
                <div className="flex items-center justify-between text-neutral-600 text-xs">
                  <span>Total Items You Receive</span>
                  <span className="font-semibold text-neutral-950">
                    {totalPiecesReceiving} Pieces
                  </span>
                </div>
              )}

              {totalSchemeSavings > 0 && (
                <div className="flex items-center justify-between text-emerald-700 text-xs">
                  <span>Trade Scheme Savings</span>
                  <span className="font-semibold">
                    Rs. {totalSchemeSavings.toLocaleString()} Free
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-neutral-600">
                <span>Approx. Gross Weight</span>
                <span className="font-semibold text-neutral-950">~{wholesaleTotalWeight.toFixed(1)} kg</span>
              </div>

              <div className="flex items-center justify-between text-neutral-600">
                <span className="flex items-center gap-1">
                  Bilty / Freight
                  <Info className="size-3.5 text-neutral-400" />
                </span>
                <span className="font-semibold text-emerald-600">Dock Loading Free</span>
              </div>

              <div className="flex items-center justify-between text-neutral-600">
                <span className="flex items-center gap-1">
                  GST / NTN Invoicing
                  <Info className="size-3.5 text-neutral-400" />
                </span>
                <span className="text-neutral-500">Provided</span>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200/80 space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="text-base font-semibold text-neutral-950">Total Est. Bill</span>
                <span className="text-2xl font-bold tracking-tight text-neutral-950">
                  Rs. {wholesaleSubtotal.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Direct wholesale cash-on-bilty or warehouse counter settlement
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <Link href="/checkout" className="block w-full">
                <Button
                  type="button"
                  disabled={wholesaleItems.length === 0}
                  className="w-full h-12 cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="size-4" />
                  Book Wholesale Order
                </Button>
              </Link>

              <a
                href="tel:+923331285556"
                className="w-full h-11 px-4 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-900 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <FileText className="size-4 text-neutral-500" />
                Request Freight / Bilty Quote
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-4 gap-4 mt-12 pt-8 border-t border-neutral-200">
        <div className="flex items-center gap-3 text-xs text-neutral-600">
          <Truck className="size-4 text-neutral-500 shrink-0" />
          <span>Nationwide Bilty &amp; Goods Transport</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-neutral-600">
          <Boxes className="size-4 text-neutral-500 shrink-0" />
          <span>Direct Warehouse Dock Loading</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-neutral-600">
          <PackageCheck className="size-4 text-neutral-500 shrink-0" />
          <span>Official GST &amp; NTN Invoices</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-neutral-600">
          <ShieldCheck className="size-4 text-neutral-500 shrink-0" />
          <span>100% Sealed Genuine Stock</span>
        </div>
      </div>
    </div>
  );
}

export default WholesaleCart;
