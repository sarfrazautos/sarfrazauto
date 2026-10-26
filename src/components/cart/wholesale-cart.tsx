"use client";

import Link from "next/link";
import {
  Boxes,
  Check,
  ChevronRight,
  FileText,
  Info,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
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

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-950">
            Wholesale Master Cartons ({wholesaleCount} cartons)
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
              <p className="text-neutral-500 text-sm">Your wholesale carton order is empty.</p>
              <Link
                href="/wholesale"
                className="inline-flex items-center justify-center mt-4 px-5 py-2.5 rounded-lg bg-neutral-950 text-white text-xs font-medium hover:bg-neutral-800 transition-colors"
              >
                Browse Wholesale Cartons
              </Link>
            </div>
          ) : (
            wholesaleItems.map((item) => (
              <div
                key={item.id}
                className="relative flex items-start gap-3.5 sm:gap-6 p-3.5 sm:p-5 rounded-2xl border border-neutral-200/80 bg-[#fafafa] hover:border-neutral-300 transition-colors w-full min-w-0 overflow-hidden"
              >
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
                        {item.packaging && (
                          <p className="text-[11px] text-neutral-400 mt-0.5">{item.packaging}</p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove carton"
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
                    <div className="flex items-center rounded-lg border border-neutral-200 bg-white">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label="Decrease carton count"
                        className="size-7 sm:size-8 flex items-center justify-center text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50 transition-colors cursor-pointer"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-9 text-center text-xs font-semibold text-neutral-900">
                        {item.quantity} ctn
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label="Increase carton count"
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
                        Rs. {item.price.toLocaleString()} / carton
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label="Remove carton"
                  className="sm:hidden absolute top-3 right-3 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer p-1"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <div className="rounded-2xl border border-neutral-200 bg-[#fafafa] p-6 space-y-5 sticky top-24">
            <h3 className="text-lg font-semibold text-neutral-950">Wholesale Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-neutral-600">
                <span>Total Master Cartons</span>
                <span className="font-semibold text-neutral-950">{wholesaleCount} Cartons</span>
              </div>

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
