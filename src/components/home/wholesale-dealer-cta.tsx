"use client"

import Link from "next/link"
import Image from "next/image"
import { Package, ShieldCheck, ArrowRight, Sparkles, Truck, Store, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"

export function WholesaleDealerCta() {
  const { data: session } = useSession()
  const isAuthenticated = Boolean(session?.user)

  return (
    <section className="w-full py-16 md:py-20 bg-[#fafafa] border-y border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-neutral-950 text-white p-8 sm:p-12 lg:p-16 shadow-lg border border-neutral-800">
          <div className="absolute inset-0 z-0 pointer-events-none select-none">
            <Image
              src="/b2b-banner.jpg"
              alt="Direct Factory Master Carton Supply"
              fill
              className="object-cover object-right"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-transparent" />
          </div>

          <div className="relative z-10 max-w-2xl lg:max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-semibold uppercase tracking-wider mb-5">
              <Store className="size-3.5" />
              <span>B2B Wholesale &amp; Dealer Counter</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight mb-4">
              Direct Factory <span className="text-red-500">Master Carton</span> Supply
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-8 max-w-2xl">
              Are you an auto spare parts shop owner, mechanic workshop, or regional stockist? Register your shop account to unlock exclusive factory dealer rates, automated trade schemes, and direct nationwide freight dispatch.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex flex-col gap-1.5">
                <div className="size-8 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center">
                  <Package className="size-4" />
                </div>
                <h4 className="text-sm font-semibold text-white">Dealer Pricing</h4>
                <p className="text-xs text-neutral-400 leading-normal">
                  Sealed master cartons at wholesale distributor margin.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex flex-col gap-1.5">
                <div className="size-8 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                  <Sparkles className="size-4" />
                </div>
                <h4 className="text-sm font-semibold text-white">Trade Schemes</h4>
                <p className="text-xs text-neutral-400 leading-normal">
                  Automated free cartons on volume bulk dispatch.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex flex-col gap-1.5">
                <div className="size-8 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
                  <Truck className="size-4" />
                </div>
                <h4 className="text-sm font-semibold text-white">Bilty Freight</h4>
                <p className="text-xs text-neutral-400 leading-normal">
                  Reliable dock loading &amp; goods transport nationwide.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3.5">
              {isAuthenticated ? (
                <Link href="/wholesale" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto h-12 px-8 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm cursor-pointer shadow-md gap-2">
                    <Package className="size-4" />
                    <span>Enter Wholesale Catalog</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/signup" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto h-12 px-8 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm cursor-pointer shadow-md gap-2">
                      <Store className="size-4" />
                      <span>Register Dealer Account</span>
                      <ArrowRight className="size-4" />
                    </Button>
                  </Link>

                  <Link href="/login?redirect=/wholesale" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto h-12 px-7 rounded-xl border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium text-sm cursor-pointer gap-2">
                      <LogIn className="size-4" />
                      <span>Dealer Login</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WholesaleDealerCta
