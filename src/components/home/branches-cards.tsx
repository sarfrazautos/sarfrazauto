"use client";

import { useState } from "react";
import { ArrowUpRight, Building2, MapPin, RotateCcw, Store, Warehouse } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BranchCardItem {
  id: string;
  name: string;
  tagline: string;
  address: string;
  phone: string;
  timing: string;
  mapQuery: string;
  icon: typeof Store;
  theme: "red" | "light";
}

const branches: BranchCardItem[] = [
  {
    id: "saddar",
    name: "Saddar Head Office",
    tagline: "Retail counter & instant pickup.",
    address: "Shop #23, Taj Mehal Qasim Auto Market, Saddar, Karachi",
    phone: "+92 300 1234567",
    timing: "Mon - Sat: 9:00 AM - 8:00 PM",
    mapQuery: "Taj+Mehal+Qasim+Auto+Market+Saddar+Karachi",
    icon: Store,
    theme: "red",
  },
  {
    id: "tibet",
    name: "Tibet Centre Plaza",
    tagline: "Wholesale desk & retailer supply.",
    address: "Shop #12, Tibet Centre, M.A. Jinnah Road, Karachi",
    phone: "+92 300 7654321",
    timing: "Mon - Sat: 9:30 AM - 7:30 PM",
    mapQuery: "Tibet+Centre+M.A.+Jinnah+Road+Karachi",
    icon: Building2,
    theme: "light",
  },
  {
    id: "site",
    name: "SITE Logistics Hub",
    tagline: "Bulk warehousing & fleet dispatch.",
    address: "Plot 45-B, SITE Industrial Area, Karachi",
    phone: "+92 333 1285556",
    timing: "Mon - Sat: 8:30 AM - 6:30 PM",
    mapQuery: "SITE+Industrial+Area+Karachi",
    icon: Warehouse,
    theme: "light",
  },
];

export function BranchesCards({
  title = "Visit our branches across Karachi",
  className = "",
}: {
  title?: string;
  className?: string;
}) {
  const [flippedId, setFlippedId] = useState<string | null>(null);

  const toggleFlip = (id: string, e?: React.MouseEvent) => {
    if (e && (e.target as HTMLElement).closest("a, iframe, button")) return;
    setFlippedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="branches" className={cn("w-full bg-white text-neutral-900 py-16 md:py-24", className)}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 w-full">
        <div className="max-w-2xl mb-10 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-neutral-900 leading-tight">
            {title}
          </h2>
          <p className="text-neutral-500 text-sm md:text-base mt-3">
            Visit our distribution hubs or central wholesale warehouses. Hover on desktop or tap on mobile to reveal the location map.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {branches.map((branch) => {
            const Icon = branch.icon;
            const isRed = branch.theme === "red";
            const isFlipped = flippedId === branch.id;

            return (
              <div
                key={branch.id}
                onClick={(e) => toggleFlip(branch.id, e)}
                className="group h-[480px] [perspective:1000px] cursor-pointer select-none"
              >
                <div
                  className={cn(
                    "relative h-full w-full rounded-3xl transition-transform duration-700 [transform-style:preserve-3d] shadow-xs md:group-hover:[transform:rotateY(180deg)]",
                    isFlipped && "[transform:rotateY(180deg)]"
                  )}
                >
                  <div
                    className={cn(
                      "absolute inset-0 h-full w-full rounded-3xl p-8 flex flex-col justify-between [backface-visibility:hidden] transition-colors",
                      isRed
                        ? "bg-red-600 text-white shadow-md"
                        : "bg-[#f5f5f7] text-neutral-900 border border-neutral-200/70"
                    )}
                  >
                    <div>
                      <div
                        className={cn(
                          "size-14 rounded-full flex items-center justify-center mb-8 shadow-xs",
                          isRed
                            ? "bg-white text-red-600"
                            : "bg-red-600 text-white"
                        )}
                      >
                        <Icon className="size-6 stroke-[2]" />
                      </div>

                      <h3
                        className={cn(
                          "text-2xl md:text-3xl font-semibold tracking-tight leading-snug",
                          isRed ? "text-white" : "text-neutral-900"
                        )}
                      >
                        {branch.name}, {branch.tagline}
                      </h3>
                      <p
                        className={cn(
                          "text-sm mt-3 leading-relaxed",
                          isRed ? "text-red-100" : "text-neutral-600"
                        )}
                      >
                        {branch.address}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-current/15">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "size-8 rounded-full flex items-center justify-center",
                            isRed
                              ? "bg-white/20 text-white"
                              : "bg-black/5 text-black"
                          )}
                        >
                          <ArrowUpRight className="size-4" />
                        </div>
                        <span className="text-xs font-semibold tracking-wide uppercase">
                          <span className="md:hidden">Click to View Map</span>
                          <span className="hidden md:inline">Hover to View Map</span>
                        </span>
                      </div>
                      <span
                        className={cn(
                          "text-xs font-medium px-2.5 py-1 rounded-full",
                          isRed
                            ? "bg-white/20 text-white"
                            : "text-red-600 bg-red-100/70"
                        )}
                      >
                        Karachi
                      </span>
                    </div>
                  </div>

                  <div className="absolute inset-0 h-full w-full rounded-3xl overflow-hidden [transform:rotateY(180deg)] [backface-visibility:hidden] bg-neutral-950 border border-neutral-800 flex flex-col justify-between p-5 text-white">
                    <button
                      type="button"
                      aria-label="Back to details"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlippedId(null);
                      }}
                      className="md:hidden absolute top-4 right-4 z-20 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/80 hover:bg-black text-white text-xs font-medium border border-white/20 backdrop-blur-md cursor-pointer transition-colors shadow-sm"
                    >
                      <RotateCcw className="size-3" />
                      Back
                    </button>

                    <div className="relative w-full h-[270px] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800">
                      <iframe
                        title={`${branch.name} Location Map`}
                        src={`https://maps.google.com/maps?q=${branch.mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        className="w-full h-full border-0 pointer-events-auto"
                        loading="lazy"
                      />
                    </div>

                    <div className="mt-3 flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-red-500 uppercase tracking-wide">
                        <MapPin className="size-3.5" />
                        {branch.name}
                      </div>
                      <p className="text-xs text-zinc-300 leading-snug line-clamp-2">
                        {branch.address}
                      </p>
                      <p className="text-xs text-zinc-400">
                        Phone: {branch.phone} &bull; {branch.timing}
                      </p>

                      <a
                        href={`https://maps.google.com/?q=${branch.mapQuery}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold tracking-wide transition-colors"
                      >
                        Open In Google Maps
                        <ArrowUpRight className="size-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default BranchesCards;
