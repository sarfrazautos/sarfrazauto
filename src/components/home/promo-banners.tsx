"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PromoBanners() {
  return (
    <section className="w-full bg-[#fcfbf9] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[250px] sm:min-h-[380px] lg:min-h-[200px] flex items-center p-6 sm:p-10 lg:p-8 shadow-xs group">
            <Image
              src="/banner-retail.jpg"
              alt="Retail Motorcycle Parts & Accessories"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-right sm:object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent sm:from-black/60 sm:via-black/10 sm:to-transparent" />

            <div className="relative z-10 max-w-[280px] sm:max-w-xs md:max-w-sm flex flex-col items-start">
              <span className="text-xs sm:text-sm font-semibold tracking-widest text-red-200 uppercase mb-2 sm:mb-3">
                Retail Collection
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight uppercase mb-2 sm:mb-3 ">
                Effortless Performance
              </h3>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed mb-6   max-w-[18rem]">
                Original OEM parts & genuine accessories for every rider.
              </p>
              <Link
                href="/retail"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white text-neutral-950 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md hover:bg-neutral-100 hover:gap-3 transition-all cursor-pointer active:scale-95"
              >
                <span>Shop Retail</span>
                <ArrowRight className="w-4 h-4 text-neutral-950" />
              </Link>
            </div>
          </div>

          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[250px] sm:min-h-[380px] lg:min-h-[200px] flex items-center p-6 sm:p-10 lg:p-8 shadow-xs group">
            <Image
              src="/banner-wholesale.jpg"
              alt="Wholesale Master Cartons & Dealer Supply"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-right sm:object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent sm:from-black/60 sm:via-black/10 sm:to-transparent" />

            <div className="relative z-10 max-w-[280px] sm:max-w-xs md:max-w-sm flex flex-col items-start">
              <span className="text-xs sm:text-sm font-semibold tracking-widest text-red-200 uppercase mb-2 sm:mb-3">
                Bulk & Wholesale
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight uppercase mb-2 sm:mb-3 ">
                Complete Your Fleet
              </h3>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed mb-6  max-w-[18rem]">
                Direct importer bulk margins & master carton inventory for dealers.
              </p>
              <Link
                href="/wholesale"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white text-neutral-950 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md hover:bg-neutral-100 hover:gap-3 transition-all cursor-pointer active:scale-95"
              >
                <span>Shop Wholesale</span>
                <ArrowRight className="w-4 h-4 text-neutral-950" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PromoBanners;
