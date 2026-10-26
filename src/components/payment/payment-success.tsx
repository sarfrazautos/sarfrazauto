"use client";

import Link from "next/link";
import { CheckCircle2, ChevronRight, MessageSquare, Package, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface PaymentSuccessProps {
  orderId?: string;
  paymentMethod?: "cod" | "bank";
  amount?: string;
  className?: string;
}

export function PaymentSuccess({
  orderId = "#SA-98241",
  paymentMethod = "bank",
  amount = "Rs. 16,550",
  className = "",
}: PaymentSuccessProps) {
  const isBank = paymentMethod === "bank";
  const whatsappMessage = encodeURIComponent(
    `Hello Sarfraz Autos! I have placed order ${orderId} for ${amount}. Please confirm dispatch.`
  );

  return (
    <div className={cn("max-w-2xl mx-auto py-8 sm:py-12 space-y-8", className)}>
      <div className="text-center space-y-3">
        <div className="size-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200">
          <CheckCircle2 className="size-9 stroke-[2.2]" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          {isBank ? "Thank You for Your Payment!" : "Order Confirmed!"}
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          {isBank
            ? "Your payment screenshot has been submitted and is under verification by our Karachi warehouse desk."
            : "Your Cash on Delivery order is confirmed and will be dispatched directly to your doorstep."}
        </p>
      </div>

      <Card className="rounded-2xl border-border bg-card">
        <CardContent className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border text-xs sm:text-sm">
            <span className="text-muted-foreground">Order Reference ID</span>
            <span className="font-bold text-foreground tracking-wide">{orderId}</span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">Payment Method</span>
            <span className="font-semibold text-foreground">
              {isBank ? "Direct Bank Transfer / Proof Uploaded" : "Cash on Delivery (COD)"}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">Order Total</span>
            <span className="font-bold text-foreground text-base">{amount}</span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">Status</span>
            <span className="font-semibold text-emerald-600 inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
              {isBank ? "Proof Verification Pending" : "Dispatched to Packing Desk"}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <a
          href={`https://wa.me/923331285556?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-12 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm flex items-center justify-center gap-2 text-wrap cursor-pointer shadow-xs transition-colors"
        >
          <MessageSquare className="size-4" />
          <span>Confirm Receipt on WhatsApp (0333-1285556)</span>
        </a>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <Link href="/retail" className="block w-full">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 cursor-pointer flex items-center justify-center gap-2 text-xs font-medium"
            >
              <Package className="size-3.5" />
              <span>Continue Shopping</span>
              <ChevronRight className="size-3.5" />
            </Button>
          </Link>

          <a
            href="tel:+923331285556"
            className="w-full h-11 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <PhoneCall className="size-3.5 text-muted-foreground" />
            <span>Call Customer Support</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
