"use client";

import Link from "next/link";
import { LayoutGrid, Sparkles } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export function SecondaryNavbar() {
  const { data: session } = useSession();
  const isAuthenticated = Boolean(session?.user);
  const basePath = isAuthenticated ? "/wholesale" : "/retail";

  const categories = [
    { name: "All Categories", href: basePath, isMain: true },
    { name: "CD 70 Parts", href: `${basePath}?category=cd70` },
    { name: "CG 125 Parts", href: `${basePath}?category=cg125` },
    { name: "Engine Assemblies", href: `${basePath}?category=engine` },
    { name: "Carburetors", href: `${basePath}?category=carburetor` },
    { name: "Shock Absorbers", href: `${basePath}?category=shocks` },
    { name: "Silencers & Exhaust", href: `${basePath}?category=silencer` },
    { name: "Fuel Tanks", href: `${basePath}?category=fuel-tank` },
    { name: "Fuel & Oils", href: `${basePath}?category=fuel` },
    { name: "Alloy Rims & Wheels", href: `${basePath}?category=wheels` },
    { name: "Tyres & Tubes", href: `${basePath}?category=tyres` },
    { name: "Headlights & Bulbs", href: `${basePath}?category=headlight` },
    { name: "Brakes & Cables", href: `${basePath}?category=brakes` },
  ];

  const navItems = isAuthenticated
    ? [
        ...categories,
        {
          name: "Wholesale Dealer Orders",
          href: "/customer-portal",
          isBulk: true,
        },
      ]
    : [
        ...categories,
        {
          name: "Wholesale (Dealers Only)",
          href: "/signup",
          isBulk: true,
        },
      ];

  return (
    <nav className="w-full bg-[#f7f7f7] border-b border-neutral-200/80 select-none">
      <div className="max-w-7xl mx-auto px-4 xl:px-16 w-full">
        <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none py-2.5 sm:py-3 text-xs sm:text-[13px] font-medium text-neutral-700">
          {navItems.map((item: any, idx: number) => (
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
