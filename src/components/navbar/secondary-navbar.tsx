"use client";

import Link from "next/link";
import { LayoutGrid, Sparkles } from "lucide-react";

const NAV_ITEMS = [
  { name: "All Categories", href: "/retail", isMain: true },
  { name: "CD 70 Parts", href: "/retail?category=cd70" },
  { name: "CG 125 Parts", href: "/retail?category=cg125" },
  { name: "Engine Assemblies", href: "/retail?category=engine" },
  { name: "Carburetors", href: "/retail?category=carburetor" },
  { name: "Shock Absorbers", href: "/retail?category=shocks" },
  { name: "Silencers & Exhaust", href: "/retail?category=silencer" },
  { name: "Fuel Tanks", href: "/retail?category=fuel-tank" },
  { name: "Alloy Rims & Wheels", href: "/retail?category=wheels" },
  { name: "Headlights & Bulbs", href: "/retail?category=headlight" },
  { name: "Brakes & Cables", href: "/retail?category=brakes" },
  { name: "Wholesale Bulk Orders", href: "/wholesale", isBulk: true },
];

export function SecondaryNavbar() {
  return (
    <nav className="w-full bg-[#f7f7f7] border-b border-neutral-200/80 select-none">
      <div className="max-w-7xl mx-auto px-4 xl:px-16 w-full">
        <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none py-2.5 sm:py-3 text-xs sm:text-[13px] font-medium text-neutral-700">
          {NAV_ITEMS.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="shrink-0 flex items-center gap-1.5 hover:text-red-600 transition-colors whitespace-nowrap cursor-pointer group"
            >
              {item.isMain && (
                <LayoutGrid className="w-3.5 h-3.5 text-red-600 shrink-0" />
              )}
              <span className={item.isMain ? "font-bold text-neutral-900 group-hover:text-red-600" : ""}>
                {item.name}
              </span>
              {item.isBulk && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-600 text-[10px] font-bold text-white uppercase tracking-wider">
                  <Sparkles className="w-2.5 h-2.5" />
                  Wholesale
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default SecondaryNavbar;
