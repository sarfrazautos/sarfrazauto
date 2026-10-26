"use client";

import { Store, Truck, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useCheckoutInfo } from "@/lib/store/checkout-store";

export function CheckoutForm({ className = "" }: { className?: string }) {
  const { info, setInfo, resetInfo } = useCheckoutInfo();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInfo({ [name]: value });
  };

  const hasSavedData = Boolean(
    info.fullName || info.email || info.phone || info.address || info.city
  );

  return (
    <div className={cn("space-y-8", className)}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-foreground">
            Pick Delivery Method
          </Label>
          {hasSavedData && (
            <button
              type="button"
              onClick={resetInfo}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              <RotateCcw className="size-3" />
              Clear saved details
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Button
            type="button"
            variant={info.deliveryMethod === "delivery" ? "default" : "outline"}
            onClick={() => setInfo({ deliveryMethod: "delivery" })}
            className="h-14 rounded-xl flex items-center justify-center gap-2.5 text-sm font-medium cursor-pointer"
          >
            <Truck className="size-4 shrink-0" />
            <span>Delivery</span>
          </Button>

          <Button
            type="button"
            variant={info.deliveryMethod === "pickup" ? "default" : "outline"}
            onClick={() => setInfo({ deliveryMethod: "pickup" })}
            className="h-14 rounded-xl flex items-center justify-center gap-2.5 text-sm font-medium cursor-pointer"
          >
            <Store className="size-4 shrink-0" />
            <span>Pickup</span>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            {info.deliveryMethod === "delivery"
              ? "Shipping Information"
              : "Pickup Contact Information"}
          </h2>
          {hasSavedData && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Check className="size-3" />
              Restored from storage
            </span>
          )}
        </div>

        <div className="space-y-2 mt-5">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            required
            placeholder="Enter your name"
            value={info.fullName}
            onChange={handleChange}
            className="h-11 mt-1 mb-2"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Enter your email"
            value={info.email}
            onChange={handleChange}
            className="h-11 mt-1 mb-2"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="flex rounded-lg border border-input bg-transparent overflow-hidden focus-within:ring-3 focus-within:ring-ring/50 focus-within:border-ring">
            <span className="inline-flex items-center px-3.5 text-xs font-semibold text-muted-foreground bg-muted border-r border-input">
              +92
            </span>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="333 1285556"
              value={info.phone}
              onChange={handleChange}
              className="flex-1 h-11 px-3.5 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {info.deliveryMethod === "delivery" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                type="text"
                required
                placeholder="Street address / house number"
                value={info.address}
                onChange={handleChange}
                className="h-11 mt-1 mb-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                type="text"
                required
                placeholder="City (e.g. Karachi, Lahore, Rawalpindi)"
                value={info.city}
                onChange={handleChange}
                className="h-11 mt-1 mb-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apartment">
                Apartment, Suite, Floor{" "}
                <span className="text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Input
                id="apartment"
                name="apartment"
                type="text"
                placeholder="Optional"
                value={info.apartment}
                onChange={handleChange}
                className="h-11 mt-1 mb-2"
              />
            </div>
          </>
        )}

        {info.deliveryMethod === "pickup" && (
          <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-2 text-xs">
            <span className="font-semibold text-foreground block">Pickup Location</span>
            <p className="text-muted-foreground">
              Shop #23, Taj Mehal Qasim Auto Market, Near Aurangzeb Market, M.A. Jinnah Road, Saddar, Karachi.
            </p>
            <p className="text-muted-foreground">
              Counter timings: Mon - Sat: 9:00 AM - 8:00 PM
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutForm;
