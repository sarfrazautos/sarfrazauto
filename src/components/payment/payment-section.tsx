"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Banknote,
  Check,
  ChevronLeft,
  CreditCard,
  ShieldCheck,
  Truck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/store/cart-store";
import { useCheckoutInfo } from "@/lib/store/checkout-store";
import { createOrder } from "@/lib/api/orders";
import { createPayment } from "@/lib/api/payments";
import { uploadProductImage } from "@/lib/api/products";
import BankTransferForm from "./bank-transfer-form";
import PaymentSuccess from "./payment-success";

export function PaymentSection({ className = "" }: { className?: string }) {
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "cod">("bank");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedAmount, setConfirmedAmount] = useState<string>("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [hasProofError, setHasProofError] = useState(false);
  const [orderId] = useState(() => `#SA-${Math.floor(10000 + Math.random() * 90000)}`);

  const { items, retailSubtotal, wholesaleSubtotal, clearCart } = useCart();
  const { info } = useCheckoutInfo();

  const subtotal = retailSubtotal + wholesaleSubtotal;
  const isPickup = info.deliveryMethod === "pickup";
  const shipping = isPickup || subtotal >= 5000 || subtotal === 0 ? 0 : 250;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (items.length === 0) {
      toast.error("Your shopping cart is empty. Please add items to cart first.");
      return;
    }

    if (paymentMethod === "bank" && !proofFile) {
      setHasProofError(true);
      toast.error("Please upload payment transfer screenshot or receipt.");
      if (typeof window !== "undefined") {
        const proofElement = document.getElementById("payment-proof-section");
        if (proofElement) {
          proofElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      return;
    }

    try {
      setIsSubmitting(true);

      let screenshotUrl = "";
      if (paymentMethod === "bank" && proofFile) {
        try {
          screenshotUrl = await uploadProductImage(proofFile);
        } catch {
          screenshotUrl = "";
        }
      }

      const orderItems = items.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.title,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        specs: item.specs || "",
        image: item.image,
        type: item.type,
      }));

      const finalAmount = total;
      const customerName = info.fullName?.trim() || "Customer";
      const notesParts = [
        info.address ? `Address: ${info.address}` : "",
        info.apartment ? `Apartment: ${info.apartment}` : "",
        info.notes ? `Note: ${info.notes}` : "",
        `Method: ${paymentMethod === "bank" ? "Bank Transfer" : "Cash on Delivery"}`,
      ].filter(Boolean);

      await createOrder({
        orderNumber: orderId,
        customerName,
        customerPhone: info.phone?.trim() || null,
        customerCity: info.city?.trim() || null,
        orderType: wholesaleSubtotal > 0 ? "wholesale" : "retail",
        items: orderItems,
        totalAmount: finalAmount,
        status: "pending",
        paymentStatus: paymentMethod === "bank" ? "processing" : "pending",
        notes: notesParts.join(" | "),
      });

      if (paymentMethod === "bank") {
        try {
          const cleanId = orderId.replace(/[^0-9]/g, "") || String(Math.floor(1000 + Math.random() * 9000));
          await createPayment({
            paymentNumber: `PAY-${cleanId}`,
            customerName,
            orderNumber: orderId,
            amount: finalAmount,
            method: "Bank Transfer",
            screenshotUrl: screenshotUrl || null,
            status: "Pending",
          });
        } catch {}
      }

      setConfirmedAmount(`Rs. ${finalAmount.toLocaleString()}`);
      setIsSubmitted(true);
      clearCart();
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className={cn("w-full bg-white text-neutral-900 py-8 sm:py-12 md:py-16", className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PaymentSuccess
            orderId={orderId}
            paymentMethod={paymentMethod}
            amount={confirmedAmount || `Rs. ${total.toLocaleString()}`}
          />
        </div>
      </section>
    );
  }

  return (
    <section className={cn("w-full bg-white text-neutral-900 py-8 sm:py-12 md:py-16", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-8">
          <Link
            href="/checkout"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="size-4" />
            Back to Information
          </Link>

          <div className="flex items-center gap-4 sm:gap-8">
            <Link href="/checkout" className="flex items-center gap-2 group cursor-pointer">
              <span className="size-6 rounded-full bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center">
                <Check className="size-3.5 stroke-[3]" />
              </span>
              <span className="text-xs sm:text-sm font-medium text-muted-foreground group-hover:text-foreground">
                Information
              </span>
            </Link>

            <div className="w-8 sm:w-16 h-px bg-border" />

            <div className="flex items-center gap-2">
              <span className="size-6 rounded-full bg-neutral-950 text-white text-xs font-semibold flex items-center justify-center">
                2
              </span>
              <span className="text-xs sm:text-sm font-semibold text-foreground">
                Payment
              </span>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start w-full min-w-0">
          <div className="w-full min-w-0 lg:col-span-7 xl:col-span-8 space-y-8">
            <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-muted-foreground block">
                  {info.deliveryMethod === "delivery" ? "Shipping to:" : "Pickup by:"}
                </span>
                <span className="font-semibold text-foreground text-sm">
                  {info.fullName || "Valued Customer"} • {info.phone || "No phone entered"}
                </span>
                {info.deliveryMethod === "delivery" && info.address && (
                  <p className="text-muted-foreground mt-0.5">
                    {info.address}, {info.city}
                  </p>
                )}
              </div>
              <Link
                href="/checkout"
                className="text-xs font-semibold text-red-600 hover:underline shrink-0"
              >
                Change
              </Link>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-foreground">Payment Method</h2>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bank")}
                  className={cn(
                    "w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between",
                    paymentMethod === "bank"
                      ? "border-neutral-950 bg-neutral-50/50 shadow-xs"
                      : "border-border hover:border-neutral-300"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="size-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">
                      <CreditCard className="size-5 text-neutral-800" />
                    </span>
                    <div>
                      <span className="text-sm font-semibold text-foreground block">
                        Bank Transfer / Online Transfer
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Meezan Bank, UBL, EasyPaisa, JazzCash
                      </span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "size-5 rounded-full border flex items-center justify-center shrink-0",
                      paymentMethod === "bank"
                        ? "border-neutral-950 bg-neutral-950 text-white"
                        : "border-neutral-300"
                    )}
                  >
                    {paymentMethod === "bank" && <Check className="size-3 stroke-[3]" />}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("cod");
                    setHasProofError(false);
                  }}
                  className={cn(
                    "w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between",
                    paymentMethod === "cod"
                      ? "border-neutral-950 bg-neutral-50/50 shadow-xs"
                      : "border-border hover:border-neutral-300"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="size-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">
                      <Banknote className="size-5 text-neutral-800" />
                    </span>
                    <div>
                      <span className="text-sm font-semibold text-foreground block">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Pay cash directly to rider upon parcel delivery
                      </span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "size-5 rounded-full border flex items-center justify-center shrink-0",
                      paymentMethod === "cod"
                        ? "border-neutral-950 bg-neutral-950 text-white"
                        : "border-neutral-300"
                    )}
                  >
                    {paymentMethod === "cod" && <Check className="size-3 stroke-[3]" />}
                  </span>
                </button>
              </div>
            </div>

            {paymentMethod === "bank" ? (
              <BankTransferForm
                hasError={hasProofError}
                onProofChange={(file) => {
                  setProofFile(file);
                  if (file) {
                    setHasProofError(false);
                  }
                }}
              />
            ) : (
              <div className="p-5 rounded-2xl border border-border bg-muted/20 space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Truck className="size-4 text-emerald-600" />
                  <span>Cash on Delivery Policy</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Please keep exact cash ready upon delivery. Our authorized delivery rider or courier service (TCS / Leopards / Trax) will collect the total amount of Rs. {total.toLocaleString()} at your doorstep upon handing over the parcel.
                </p>
                <div className="p-3 rounded-xl bg-muted/40 border border-border/80 text-[11px] text-muted-foreground">
                  Direct inspection allowed upon package receipt before payment settlement.
                </div>
              </div>
            )}
          </div>

          <div className="w-full min-w-0 lg:col-span-5 xl:col-span-4">
            <Card className="rounded-2xl border-border bg-card p-5 sm:p-6 space-y-6 sticky top-24">
              <CardContent className="p-0 space-y-6">
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
                      {shipping === 0 ? "Free" : `Rs. ${shipping}`}
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
                  disabled={isSubmitting || items.length === 0}
                  onClick={handleSubmit}
                  className="w-full h-12 cursor-pointer flex items-center justify-center gap-2 text-sm font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="size-4" />
                      {paymentMethod === "bank"
                        ? "Submit Payment Proof & Confirm"
                        : "Confirm & Place Order (COD)"}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PaymentSection;
