"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  Gift,
  Headphones,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  Tag,
  Truck,
  X,
  Boxes,
  ShoppingBag,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/store/cart-store";
import { useActiveOffer } from "@/lib/hooks/use-active-offer";
import { useSession } from "@/lib/auth-client";

function CartContent({ className = "" }: { className?: string }) {
  const { data: session } = useSession();
  const isAuthenticated = Boolean(session?.user);
  const {
    items,
    retailCount,
    wholesaleCount,
    retailSubtotal,
    wholesaleSubtotal,
    updateQuantity,
    removeItem,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

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
    if (item.type !== "wholesale") return null;
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

  const totalFreePieces = items.reduce((acc, item) => {
    const scheme = getActiveScheme(item);
    if (scheme && scheme.buyQty > 0 && item.quantity >= scheme.buyQty) {
      const freePerThreshold = scheme.freeQty || 1;
      return acc + Math.floor(item.quantity / scheme.buyQty) * freePerThreshold;
    }
    return acc;
  }, 0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const trimmed = couponCode.trim().toUpperCase();
    if (!trimmed) return;
    if (trimmed === "SARFRAZ10") {
      setCouponApplied(true);
    } else {
      setCouponError("Invalid promo code");
    }
  };

  const { offer, isApplicable } = useActiveOffer();
  const subtotal = retailSubtotal + wholesaleSubtotal;
  const couponDiscount = couponApplied && subtotal > 0 ? Math.min(1000, subtotal) : 0;
  const discountRetail = isApplicable("retail") && offer ? Math.round((retailSubtotal * offer.discountPercent) / 100) : 0;
  const discountWholesale = isApplicable("wholesale") && offer ? Math.round((wholesaleSubtotal * offer.discountPercent) / 100) : 0;
  const offerDiscount = discountRetail + discountWholesale;
  const totalDiscount = couponDiscount + offerDiscount;
  const shipping = subtotal >= 5000 || subtotal === 0 ? 0 : 250;
  const total = Math.max(0, subtotal - totalDiscount + shipping);

  return (
    <section className={cn("w-full bg-white text-neutral-900 py-10 md:py-16", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950">
              Shopping Bag ({items.length} {items.length === 1 ? "item" : "items"})
            </h1>
            <p className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-emerald-600 mt-2">
              <Check className="size-4 stroke-[2.5]" />
              Free Karachi delivery &amp; nationwide express dispatch
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={isAuthenticated ? "/wholesale" : "/retail"}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
            >
              Continue Shopping
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8 items-start w-full min-w-0">
          <div className="w-full min-w-0 lg:col-span-7 xl:col-span-8 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-neutral-200 rounded-2xl p-8">
                <ShoppingBag className="size-10 text-neutral-300 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-neutral-900">
                  Your shopping bag is empty
                </h3>
                <p className="text-neutral-500 text-xs sm:text-sm mt-1 max-w-sm mx-auto">
                  {isAuthenticated
                    ? "You don't have any wholesale products in your cart yet. Explore our wholesale catalog."
                    : "You don't have any products in your cart yet. Explore our retail or wholesale catalogs."}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                  {!isAuthenticated && (
                    <Link
                      href="/retail"
                      className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-neutral-950 text-white text-xs font-medium hover:bg-neutral-800 transition-colors"
                    >
                      Browse Retail Counter
                    </Link>
                  )}
                  <Link
                    href="/wholesale"
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors"
                  >
                    Browse Wholesale Deals
                  </Link>
                </div>
              </div>
            ) : (
              items.map((item) => {
                const scheme = getActiveScheme(item);
                const hasScheme = Boolean(scheme && scheme.buyQty > 0);
                const isEligible = hasScheme && item.quantity >= scheme.buyQty;
                const freePieces = isEligible
                  ? Math.floor(item.quantity / scheme.buyQty) * (scheme.freeQty || 1)
                  : 0;

                const isWholesale = item.type === "wholesale";

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
                              <div className="flex items-center gap-2 flex-wrap">
                                {isWholesale ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200/70">
                                    <Boxes className="size-3 text-red-600" />
                                    Wholesale
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200">
                                    <ShoppingBag className="size-3 text-neutral-500" />
                                    Retail
                                  </span>
                                )}

                                <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-500 uppercase tracking-wide truncate">
                                  {item.category}
                                </span>
                              </div>

                              <h3 className="text-sm sm:text-base font-semibold text-neutral-950 mt-1.5 leading-snug line-clamp-2">
                                {item.title}
                              </h3>

                              {item.specs && (
                                <p className="text-xs text-neutral-500 mt-0.5 truncate">{item.specs}</p>
                              )}

                              {item.packaging && (
                                <p className="text-[11px] text-neutral-400 mt-0.5">{item.packaging}</p>
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
                            <span className="inline-flex items-center gap-1 font-medium text-emerald-600 shrink-0">
                              <span className="size-1.5 rounded-full bg-emerald-600" />
                              In Stock
                            </span>
                            <span className="text-neutral-300">&bull;</span>
                            <span className="text-neutral-500 truncate">{item.arrivalText}</span>
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
                            <span className="w-8 sm:w-10 text-center text-xs font-semibold text-neutral-900">
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
                            {item.quantity > 1 && (
                              <span className="text-[11px] text-neutral-500">
                                Rs. {item.price.toLocaleString()} each
                              </span>
                            )}
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

                    {hasScheme && (
                      <div className="mt-3 pt-3 border-t border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px]">
                            <Gift className="size-3 text-emerald-600" />
                            {scheme.title}
                          </span>
                          {isEligible ? (
                            <span className="text-emerald-700 font-medium text-[11px]">
                              Unlocked +{freePieces} free pieces!
                            </span>
                          ) : (
                            <span className="text-neutral-500 text-[11px]">
                              Add {scheme.buyQty - item.quantity} more to unlock {scheme.freeQty || 1} free
                            </span>
                          )}
                        </div>

                        {isEligible && (
                          <span className="font-semibold text-emerald-700 text-xs">
                            Total receiving: {item.quantity + freePieces} pieces
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
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
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        if (couponError) setCouponError("");
                      }}
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

                {couponApplied && (
                  <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <Check className="size-3.5" />
                    SARFRAZ10 applied (-Rs. {couponDiscount.toLocaleString()})
                  </p>
                )}

                {couponError && (
                  <p className="text-xs text-red-600 font-medium">{couponError}</p>
                )}
              </div>

              <div className="space-y-2.5 pt-2 text-xs border-t border-neutral-200/80">
                <div className="flex items-center justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-neutral-950">Rs. {subtotal.toLocaleString()}</span>
                </div>

                {retailCount > 0 && wholesaleCount > 0 && (
                  <div className="pl-2 space-y-1 text-[11px] text-neutral-500 border-l border-neutral-200">
                    <div className="flex items-center justify-between">
                      <span>Retail Items ({retailCount})</span>
                      <span>Rs. {retailSubtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Wholesale Items ({wholesaleCount})</span>
                      <span>Rs. {wholesaleSubtotal.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600">
                    <span>Promo Discount</span>
                    <span className="font-semibold">-Rs. {couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                {offerDiscount > 0 && offer && (
                  <div className="flex items-center justify-between text-emerald-600">
                    <span>Special Deal ({offer.discountPercent}% OFF)</span>
                    <span className="font-semibold">-Rs. {offerDiscount.toLocaleString()}</span>
                  </div>
                )}

                {totalFreePieces > 0 && (
                  <div className="flex items-center justify-between text-emerald-600">
                    <span>Wholesale Bonus</span>
                    <span className="font-semibold">+{totalFreePieces} Free items</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-neutral-600">
                  <span>Shipping</span>
                  <span className={cn("font-medium", shipping === 0 ? "text-emerald-600" : "text-neutral-950")}>
                    {shipping === 0 ? "Free" : `Rs. ${shipping}`}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200/80 space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-semibold text-neutral-950">Total</span>
                  <span className="text-2xl font-bold tracking-tight text-neutral-950">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
                {totalDiscount > 0 && (
                  <p className="text-xs text-right text-emerald-600 font-medium">
                    You save Rs. {totalDiscount.toLocaleString()}
                  </p>
                )}
              </div>

              <Link href="/checkout" className="block w-full">
                <Button
                  type="button"
                  disabled={items.length === 0}
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
    </section>
  );
}

export function CartSection({ className = "" }: { className?: string }) {
  return (
    <Suspense
      fallback={
        <section className={cn("w-full bg-white text-neutral-900 py-10 md:py-16", className)}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
            <div className="h-8 w-48 bg-neutral-100 rounded-lg mb-8" />
            <div className="h-64 w-full bg-neutral-50 rounded-2xl border border-neutral-100" />
          </div>
        </section>
      }
    >
      <CartContent className={className} />
    </Suspense>
  );
}

export default CartSection;
