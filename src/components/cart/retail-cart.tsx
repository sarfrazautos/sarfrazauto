"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  Headphones,
  Info,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  Tag,
  Truck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/store/cart-store";

export function RetailCart({ className = "" }: { className?: string }) {
  const { retailItems, retailCount, updateQuantity, removeItem } = useCart();
  const [couponCode, setCouponCode] = useState("SARFRAZ10");
  const [couponApplied, setCouponApplied] = useState(true);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "SARFRAZ10") {
      setCouponApplied(true);
    }
  };

  const subtotal = retailItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = couponApplied && subtotal > 0 ? Math.min(1000, subtotal) : 0;
  const shipping = subtotal >= 5000 || subtotal === 0 ? 0 : 250;
  const total = Math.max(0, subtotal - discount + shipping);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-950">
            Retail Shopping Bag ({retailCount} items)
          </h2>
          <p className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-emerald-600 mt-2">
            <Check className="size-4 stroke-[2.5]" />
            Free Karachi delivery &amp; nationwide express dispatch
          </p>
        </div>

        <Link
          href="/retail"
          className="inline-flex items-center gap-1 text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
        >
          Continue Shopping
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8 items-start w-full min-w-0">
        <div className="w-full min-w-0 lg:col-span-7 xl:col-span-8 space-y-4">
          {retailItems.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-neutral-200 rounded-2xl p-8">
              <p className="text-neutral-500 text-sm">Your retail shopping cart is empty.</p>
              <Link
                href="/retail"
                className="inline-flex items-center justify-center mt-4 px-5 py-2.5 rounded-lg bg-neutral-950 text-white text-xs font-medium hover:bg-neutral-800 transition-colors"
              >
                Browse Retail Products
              </Link>
            </div>
          ) : (
            retailItems.map((item) => (
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
                        <p className="text-xs text-neutral-500 mt-0.5 truncate">{item.specs}</p>
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
                      <span className="inline-flex items-center gap-1 font-medium text-emerald-600 shrink-0">
                        <span className="size-1.5 rounded-full bg-emerald-600" />
                        In Stock
                      </span>
                      <span className="text-neutral-300">&bull;</span>
                      <span className="text-neutral-500 truncate">{item.arrivalText}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 mt-3 sm:mt-4 pt-1">
                    <div className="flex items-center rounded-lg border border-neutral-200 bg-white">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label="Decrease quantity"
                        className="size-7 sm:size-8 flex items-center justify-center text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50 transition-colors cursor-pointer"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-7 sm:w-8 text-center text-xs font-semibold text-neutral-900">
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

                    <span className="text-sm sm:text-base font-semibold text-neutral-950">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
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
            ))
          )}
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <div className="rounded-2xl border border-neutral-200 bg-[#fafafa] p-6 space-y-5 sticky top-24">
            <h3 className="text-lg font-semibold text-neutral-950">Order Summary</h3>

            <div className="space-y-1.5">
              <span className="text-xs font-medium text-neutral-700">Promo Code</span>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="w-full h-10 pl-8 pr-3 rounded-lg border border-neutral-200 bg-white text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-950"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleApplyCoupon}
                  className="h-10 px-4 text-xs font-medium rounded-lg cursor-pointer bg-white hover:bg-neutral-100 border-neutral-200"
                >
                  Apply
                </Button>
              </div>
              {couponApplied && discount > 0 && (
                <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="size-3" />
                  Code applied (-Rs. {discount.toLocaleString()})
                </p>
              )}
            </div>

            <div className="space-y-3 pt-3 border-t border-neutral-200/80 text-sm">
              <div className="flex items-center justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-950">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-neutral-600">
                <span className="flex items-center gap-1">
                  Shipping
                  <Info className="size-3.5 text-neutral-400" />
                </span>
                <span className="font-semibold text-emerald-600">
                  {shipping === 0 ? "Free" : `Rs. ${shipping}`}
                </span>
              </div>

              {couponApplied && discount > 0 && (
                <div className="flex items-center justify-between text-red-600">
                  <span>Promo discount</span>
                  <span className="font-semibold">-Rs. {discount.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-neutral-200/80 space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="text-base font-semibold text-neutral-950">Total</span>
                <span className="text-2xl font-bold tracking-tight text-neutral-950">
                  Rs. {total.toLocaleString()}
                </span>
              </div>
              {discount > 0 && (
                <p className="text-xs text-right text-emerald-600 font-medium">
                  You save Rs. {discount.toLocaleString()}
                </p>
              )}
            </div>

            <Link href="/checkout" className="block w-full">
              <Button
                type="button"
                disabled={retailItems.length === 0}
                className="w-full h-12 cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="size-4" />
                Proceed To Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-4 gap-4 mt-12 pt-8 border-t border-neutral-200">
        <div className="flex items-center gap-3 text-xs text-neutral-600">
          <Truck className="size-4 text-neutral-500 shrink-0" />
          <span>Free Shipping over Rs. 5,000</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-neutral-600">
          <RotateCcw className="size-4 text-neutral-500 shrink-0" />
          <span>7-Day Fitment Exchange</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-neutral-600">
          <Headphones className="size-4 text-neutral-500 shrink-0" />
          <span>Phone Support: 0333-1285556</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-neutral-600">
          <ShieldCheck className="size-4 text-neutral-500 shrink-0" />
          <span>100% Genuine Spare Parts</span>
        </div>
      </div>
    </div>
  );
}

export default RetailCart;
