"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { BsInstagram, BsTiktok } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";

export interface FooterProps {
  className?: string;
}

export function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={cn("relative bg-[#07090e] text-zinc-300 overflow-hidden pt-16 md:pt-24 pb-8 border-t border-zinc-900", className)}>
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/footer.png"
          alt=""
          className="w-full h-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07090e]/90 via-[#07090e]/80 to-[#07090e]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 pb-12 md:pb-16">
          <div className="max-w-md flex flex-col justify-between gap-8">
            <div>
              <Link href="/" className="inline-flex items-center gap-2.5">
                <span className="text-2xl font-medium tracking-tight text-white">
                  Sarfraz Autos
                </span>
              </Link>
              <p className="  text-zinc-300 mt-3 max-w-sm leading-relaxed">
                Pakistan&apos;s leading distributor of genuine 70cc, 125cc, and 150cc motorcycle spare parts, engine assemblies, and bulk wholesale master cartons.
              </p>
            </div>

            <div className="flex items-center gap-5 text-zinc-400">
              <Link
                href="#"
                aria-label="Instagram"
                className="text-2xl hover:text-white transition-colors"
              >
                <BsInstagram />
              </Link>
              <Link
                href="#"
                aria-label="Facebook"
                className="text-2xl hover:text-white transition-colors"
              >
                <FaFacebook />
              </Link>
              <Link
                href="#"
                aria-label="TikTok"
                className="text-2xl hover:text-white transition-colors"
              >
                <BsTiktok />
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-12 sm:gap-20 md:gap-28">
            <div>
              <h3 className="font-semibold text-lg text-white tracking-wider uppercase mb-4">
                Platform
              </h3>
              <ul className="space-y-3 ">
                <li>
                  <Link href="/" className="text-zinc-300 hover:text-white transition-colors">
                    About us
                  </Link>
                </li>
                <li>
                  <Link href="/retail" className="text-zinc-300 hover:text-white transition-colors">
                    Retail Shop
                  </Link>
                </li>
                <li>
                  <Link href="/wholesale" className="text-zinc-300 hover:text-white transition-colors">
                    Wholesale
                  </Link>
                </li>
                <li>
                  <Link href="/wishlist" className="text-zinc-300 hover:text-white transition-colors">
                    My Wishlist
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-zinc-300 hover:text-white transition-colors">
                    Contact us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-white tracking-wider uppercase mb-4">
                Contact Information
              </h3>
              <ul className="space-y-3 ">
                <li>
                  <a href="tel:+923331285556" className="text-zinc-300 hover:text-white transition-colors">
                    +92 333 1285556
                  </a>
                </li>
                <li>
                  <a href="mailto:info@Sarfrazauto.com" className="text-zinc-300 hover:text-white transition-colors">
                    info@Sarfrazauto.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800/80 pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs md:text-sm text-zinc-400">
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-zinc-200 transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-zinc-200 transition-colors">
              Privacy Policy
            </Link>
          </div>
          <p className="text-zinc-400">
            &copy; 2026 Sarfraz Autos. All rights reserved.
          </p>
        </div>

        <div className="w-full overflow-hidden select-none pointer-events-none mt-4 md:mt-8">
          <p className="text-[9vw] font-black tracking-tighter text-white/[0.05] text-center leading-none uppercase whitespace-nowrap">
            SARFRAZ AUTOS
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
