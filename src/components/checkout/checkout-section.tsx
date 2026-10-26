"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import CheckoutForm from "./checkout-form";
import CheckoutSummary from "./checkout-summary";

export function CheckoutSection({ className = "" }: { className?: string }) {
  return (
    <section className={cn("w-full bg-white text-neutral-900 py-8 sm:py-12 md:py-16", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="size-4" />
            Back to Cart
          </Link>

          <div className="flex items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2">
              <span className="size-6 rounded-full bg-neutral-950 text-white text-xs font-semibold flex items-center justify-center">
                1
              </span>
              <span className="text-xs sm:text-sm font-semibold text-foreground">
                Information
              </span>
            </div>

            <div className="w-8 sm:w-16 h-px bg-border" />

            <div className="flex items-center gap-2">
              <span className="size-6 rounded-full bg-muted text-muted-foreground text-xs font-semibold flex items-center justify-center border border-border">
                2
              </span>
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                Payment
              </span>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start w-full min-w-0">
          <div className="w-full min-w-0 lg:col-span-7 xl:col-span-8">
            <CheckoutForm />
          </div>

          <div className="w-full min-w-0 lg:col-span-5 xl:col-span-4">
            <CheckoutSummary />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CheckoutSection;
