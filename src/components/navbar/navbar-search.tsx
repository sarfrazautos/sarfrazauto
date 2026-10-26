"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Search, X } from "lucide-react";
import { RiMotorbikeFill } from "react-icons/ri";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const VEHICLES = [
  "Honda CD 70",
  "Honda CG 125",
  "Suzuki GS 150",
  "Yamaha YBR 125",
  "Road Prince 70",
  "Crown 70cc / 125cc",
];

export function NavbarSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/retail?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/retail");
    }
  };

  return (
    <div className="hidden md:flex items-center">
      <form
        onSubmit={handleSearch}
        className="flex items-center h-11 lg:h-12 w-[340px] lg:w-[460px] xl:w-[500px] rounded-full bg-neutral-100 hover:bg-neutral-200/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-red-500/20 border border-neutral-200/90 focus-within:border-neutral-300 p-1 pr-4 transition-all shadow-xs"
      >
        <DropdownMenu>
          <DropdownMenuTrigger
            type="button"
            className="flex items-center gap-2 h-full px-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs lg:text-[13px] font-medium shrink-0 shadow-xs outline-none cursor-pointer transition-colors max-w-[145px] lg:max-w-[170px]"
          >
            <RiMotorbikeFill className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {selectedVehicle || "Add vehicle"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-90" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            sideOffset={8}
            className="w-52 bg-white border border-neutral-200 text-neutral-900 rounded-2xl p-1.5 shadow-xl"
          >
            <div className="px-2.5 py-1.5 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              Select Motorcycle
            </div>
            {VEHICLES.map((vehicle) => (
              <DropdownMenuItem
                key={vehicle}
                onClick={() => setSelectedVehicle(vehicle)}
                className="text-xs text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-xl cursor-pointer px-2.5 py-2"
              >
                {vehicle}
              </DropdownMenuItem>
            ))}
            {selectedVehicle && (
              <>
                <div className="my-1 border-t border-neutral-100" />
                <DropdownMenuItem
                  onClick={() => setSelectedVehicle("")}
                  className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl cursor-pointer px-2.5 py-2 flex items-center justify-between"
                >
                  <span>Clear selection</span>
                  <X className="w-3.5 h-3.5" />
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter the part number or name"
          className="flex-1 min-w-0 bg-transparent text-xs lg:text-sm text-neutral-900 placeholder-neutral-400 outline-none px-3 font-normal"
        />

        <button
          type="submit"
          aria-label="Search"
          className="text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer shrink-0 p-1"
        >
          <Search className="w-4 h-4 lg:w-[18px] lg:h-[18px]" />
        </button>
      </form>
    </div>
  );
}

export default NavbarSearch;
