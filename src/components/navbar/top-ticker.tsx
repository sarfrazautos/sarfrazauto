"use client";

import { motion } from "motion/react";
import { Sparkles, Truck, ShieldCheck, PhoneCall } from "lucide-react";

const TICKER_ITEMS = [
  {
    icon: Sparkles,
    text: "ADVANCE PAYMENT OFFER: Get flat free delivery on all online prepaid orders across Pakistan!",
  },
  {
    icon: Truck,
    text: "FAST SHIPPING: 24-hour express dispatch for retail & wholesale consignments via TCS & Bilty!",
  },
  {
    icon: ShieldCheck,
    text: "100% GENUINE OEM: Certified authentic Crown & Japanese-spec motorcycle spare parts guaranteed!",
  },
  {
    icon: PhoneCall,
    text: "EXPERT ASSISTANCE: Call or WhatsApp our parts specialist at +92 321 8273645",
  },
];

export function TopTicker() {
  return (
    <div className="relative w-full bg-red-600 text-white overflow-hidden py-2 text-xs font-semibold tracking-wide border-b border-red-700/50 select-none z-20">
      <div className="flex w-max">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 25,
          }}
          className="flex items-center gap-8 sm:gap-12 shrink-0 whitespace-nowrap pr-8 sm:pr-12"
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="inline-flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-white/90 shrink-0" />
                <span>{item.text}</span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

export default TopTicker;
