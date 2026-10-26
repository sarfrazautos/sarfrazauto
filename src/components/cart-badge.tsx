"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/store/cart-store";

type CountBadgeProps = {
  count: number;
  max?: number;
  className?: string;
};

export function CountBadge({ count, max = 99, className }: CountBadgeProps) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: [1.35, 1], opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          className="absolute -top-1 -right-1 pointer-events-none z-10"
        >
          <Badge
            className={cn(
              "flex size-5.5 items-center justify-center rounded-full border-2 border-white bg-red-600 p-0 text-[10px] font-semibold text-white shadow-xs",
              className
            )}
          >
            {count > max ? `${max}+` : count}
          </Badge>
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export interface CartBadgeProps {
  className?: string;
}

export function CartBadge({ className }: CartBadgeProps) {
  const { totalCount } = useCart();

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <Link
        href="/cart"
        aria-label="Shopping Cart"
        className="bg-[#f7f7f7] text-black hover:bg-[#e5e5e5] border border-neutral-200 rounded-full sm:h-12 sm:w-12 h-10 w-10 flex items-center justify-center cursor-pointer shadow-xs transition-colors"
      >
        <ShoppingCart className="size-4 sm:size-5" />
      </Link>
      <CountBadge count={totalCount} />
    </div>
  );
}

export default CartBadge;
