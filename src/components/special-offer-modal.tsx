"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { X, Clock, ArrowRight } from "lucide-react"
import { useActiveOffer } from "@/lib/hooks/use-active-offer"

export function SpecialOfferModal() {
  const pathname = usePathname()
  const { offer, loading } = useActiveOffer()
  const [isOpen, setIsOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  })

  useEffect(() => {
    if (pathname?.startsWith("/admin") || loading || !offer || !offer.isActive) return

    const dismissed = sessionStorage.getItem(`offer_dismissed_${offer.id}`)
    if (dismissed) return

    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 3500)

    return () => clearTimeout(timer)
  }, [pathname, offer, loading])

  useEffect(() => {
    if (!offer?.endDate) return

    const calculateTime = () => {
      const now = new Date().getTime()
      const end = new Date(offer.endDate).getTime()
      const diff = end - now

      if (diff <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" })
        setIsOpen(false)
        return
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24))
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      })
    }

    calculateTime()
    const interval = setInterval(calculateTime, 1000)
    return () => clearInterval(interval)
  }, [offer?.endDate])

  const handleClose = () => {
    setIsOpen(false)
    if (offer) {
      sessionStorage.setItem(`offer_dismissed_${offer.id}`, "true")
    }
  }

  if (pathname?.startsWith("/admin") || !isOpen || !offer || !offer.isActive) return null

  const titleParts = (offer.title || "Special Deal!").split(" ")
  const firstWord = titleParts.slice(0, -1).join(" ") || titleParts[0]
  const lastWord = titleParts.length > 1 ? titleParts[titleParts.length - 1] : ""

  const tagTextUpper = (offer.tagText || `${offer.discountPercent}% OFF`).toUpperCase()
  const tagWords = tagTextUpper.split(" ")
  const tagTop = tagWords[0] || `${offer.discountPercent}%`
  const tagBottom = tagWords.slice(1).join(" ") || "OFF"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-300">
      <div className="relative w-full max-w-[580px] sm:max-w-[620px] aspect-[16/9] min-h-[310px] sm:min-h-[340px] rounded-3xl overflow-hidden shadow-2xl flex items-center bg-[#fdf5f5] border border-red-100">
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: "url('/offer.png')" }}
        />

        <button
          type="button"
          onClick={handleClose}
          aria-label="Close offer"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 size-8 sm:size-9 rounded-full bg-white/95 hover:bg-white text-neutral-800 flex items-center justify-center shadow-md transition-transform hover:scale-110 active:scale-95 cursor-pointer border border-neutral-100"
        >
          <X className="size-4 sm:size-5" />
        </button>

        <div className="relative z-10 w-[20%] sm:w-[40%] h-full flex flex-col items-center justify-center pt-8 sm:pt-10 pl-0 sm:pl-1 select-none">
          <div className="transform -rotate-[8deg] translate-x-2.5 sm:translate-x-3.5 text-center filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]">
            <span className="block text-4xl sm:text-5xl md:text-7xl font-black italic text-white leading-none tracking-tighter">
              {tagTop}
            </span>
            <span className="block text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white leading-tight tracking-wider mt-1">
              {tagBottom}
            </span>
          </div>
        </div>

        <div className="relative z-10 w-[74%] sm:w-[63%] h-full flex flex-col justify-center pl-10 sm:pl-10 pr-5 sm:pr-8 py-5 sm:py-6 select-none">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-[32px] font-black tracking-tight leading-tight text-neutral-950">
              {lastWord ? (
                <>
                  <span>{firstWord} </span>
                  <span className="text-red-600">{lastWord}</span>
                </>
              ) : (
                <span className="text-red-600">{firstWord}</span>
              )}
            </h2>

            {offer.subtitle.includes(`${offer.discountPercent}%`) ? (
              <p className="text-xs sm:text-sm md:text-base font-semibold text-neutral-700 mt-1 line-clamp-2">
                {offer.subtitle.split(`${offer.discountPercent}%`)[0]}
                <span className="font-black text-red-600">
                  {offer.discountPercent}%{offer.subtitle.includes(`${offer.discountPercent}% OFF`) ? " OFF" : ""}
                </span>
                {offer.subtitle.split(offer.subtitle.includes(`${offer.discountPercent}% OFF`) ? `${offer.discountPercent}% OFF` : `${offer.discountPercent}%`)[1] || ""}
              </p>
            ) : (
              <p className="text-xs sm:text-sm md:text-base font-bold text-neutral-900 mt-1 line-clamp-2">
                {offer.subtitle}
              </p>
            )}
          </div>

          <div className="w-full h-px bg-neutral-200/90 my-2.5 sm:my-3" />

          <div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-neutral-900">
              <Clock className="size-3.5 sm:size-4 text-red-600 shrink-0" />
              <span>Offer ends in:</span>
            </div>

            <div className="flex items-center gap-0.5 sm:gap-2 mt-2">
              <div className="flex flex-col items-center justify-center bg-neutral-950 text-white rounded-xl sm:rounded-2xl w-11 sm:w-13 h-13 sm:h-15 shadow-md">
                <span className="text-base sm:text-lg font-black leading-tight">
                  {timeLeft.days}
                </span>
                <span className="text-[8px] sm:text-[9px] text-neutral-400 uppercase font-bold leading-none tracking-wider mt-0.5">
                  Days
                </span>
              </div>

              <span className="font-black text-neutral-800 text-sm sm:text-base">:</span>

              <div className="flex flex-col items-center justify-center bg-neutral-950 text-white rounded-xl sm:rounded-2xl w-11 sm:w-13 h-13 sm:h-15 shadow-md">
                <span className="text-base sm:text-lg font-black leading-tight">
                  {timeLeft.hours}
                </span>
                <span className="text-[8px] sm:text-[9px] text-neutral-400 uppercase font-bold leading-none tracking-wider mt-0.5">
                  Hours
                </span>
              </div>

              <span className="font-black text-neutral-800 text-sm sm:text-base">:</span>

              <div className="flex flex-col items-center justify-center bg-neutral-950 text-white rounded-xl sm:rounded-2xl w-11 sm:w-13 h-13 sm:h-15 shadow-md">
                <span className="text-base sm:text-lg font-black leading-tight">
                  {timeLeft.minutes}
                </span>
                <span className="text-[8px] sm:text-[9px] text-neutral-400 uppercase font-bold leading-none tracking-wider mt-0.5">
                  Min
                </span>
              </div>

              <span className="font-black text-neutral-800 text-sm sm:text-base">:</span>

              <div className="flex flex-col items-center justify-center bg-neutral-950 text-white rounded-xl sm:rounded-2xl w-11 sm:w-13 h-13 sm:h-15 shadow-md">
                <span className="text-base sm:text-lg font-black leading-tight">
                  {timeLeft.seconds}
                </span>
                <span className="text-[8px] sm:text-[9px] text-neutral-400 uppercase font-bold leading-none tracking-wider mt-0.5">
                  Sec
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3.5 sm:mt-4">
            <Link
              href={offer.buttonLink || "/retail"}
              onClick={handleClose}
              className="inline-flex items-center justify-center gap-1.5 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-black shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>{offer.buttonText || "Shop Now"}</span>
              <ArrowRight className="size-3.5 sm:size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpecialOfferModal

