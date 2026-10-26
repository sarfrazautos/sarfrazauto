"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, ShoppingBag, UserCheck, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/store/cart-store";
import { useCheckoutInfo } from "@/lib/store/checkout-store";

export function CheckoutSummary({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { items, retailSubtotal, wholesaleSubtotal } = useCart();
  const { info } = useCheckoutInfo();

  const subtotal = retailSubtotal + wholesaleSubtotal;
  const isPickup = info.deliveryMethod === "pickup";
  const shipping = isPickup || subtotal >= 5000 || subtotal === 0 ? 0 : 250;
  const total = subtotal + shipping;

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Your shopping cart is empty.");
      return;
    }

    if (!info.fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!info.email.trim() || !info.email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!info.phone.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }

    if (!isPickup) {
      if (!info.address.trim()) {
        toast.error("Please enter your street delivery address.");
        return;
      }
      if (!info.city.trim()) {
        toast.error("Please enter your delivery city.");
        return;
      }
    }

    setIsAuthDialogOpen(true);
  };

  return (
    <>
      <Card
        className={cn(
          "rounded-2xl border-border bg-card p-5 sm:p-6 space-y-6 sticky top-24",
          className
        )}
      >
        <CardContent className="p-0 space-y-6">
          <div className="flex items-center justify-between pb-1 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Order Items ({items.length})</h3>
            <Link
              href="/cart"
              className="text-xs text-neutral-500 hover:text-foreground font-medium transition-colors"
            >
              Edit Cart
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <ShoppingBag className="size-8 mx-auto text-neutral-400" />
              <p className="text-xs text-muted-foreground">Your cart is currently empty.</p>
              <Link
                href="/retail"
                className="inline-block text-xs font-semibold text-red-600 hover:underline pt-1"
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3.5">
                  <div className="relative size-14 rounded-xl bg-background border border-border p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={item.image || "/bike-engine.png"}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-foreground truncate leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {item.specs} • Qty: {item.quantity}
                    </p>
                  </div>

                  <span className="text-xs sm:text-sm font-semibold text-foreground shrink-0">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}

          <Separator />

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-muted-foreground text-xs sm:text-sm">
              <span>Subtotal</span>
              <span className="font-semibold text-foreground">
                Rs. {subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between text-muted-foreground text-xs sm:text-sm">
              <span>Shipping</span>
              <span className="font-semibold text-emerald-600">
                {shipping === 0 ? (isPickup ? "Pickup (Free)" : "Free") : `Rs. ${shipping}`}
              </span>
            </div>

            <Separator />

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-sm sm:text-base font-semibold text-foreground">Total</span>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Rs. {total.toLocaleString()}
              </span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleContinue}
            disabled={items.length === 0}
            className="w-full h-12 cursor-pointer flex items-center justify-center gap-2 text-sm font-medium"
          >
            <ShieldCheck className="size-4" />
            Continue to Payment
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
        <DialogContent className="sm:max-w-md p-6 rounded-2xl">
          <DialogHeader className="text-left space-y-2.5">
            <div className="size-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
              <UserCheck className="size-6" />
            </div>
            <DialogTitle className="text-lg font-bold text-neutral-950">
              Save Your Purchases &amp; Maintain Order History?
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Create an account or sign in so all your spare parts orders, wholesale billing records, bilty receipts, and invoices are safely maintained and accessible anytime in your customer dashboard.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2.5 pt-4 border-t border-neutral-100">
            <Button
              type="button"
              onClick={() => {
                setIsAuthDialogOpen(false);
                router.push("/login?redirect=/checkout");
              }}
              className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer rounded-xl"
            >
              <UserPlus className="size-4" />
              Create Account / Sign In
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAuthDialogOpen(false);
                router.push("/payment");
              }}
              className="w-full h-11 border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer rounded-xl"
            >
              <ArrowRight className="size-4 text-neutral-500" />
              Skip &amp; Continue as Guest
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CheckoutSummary;
