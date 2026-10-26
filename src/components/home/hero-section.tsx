"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, PhoneCall } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

const SLIDES = [
  {
    tag: "PREMIUM RACING & OEM SPEC",
    line1: "MOTORCYCLE",
    line2: "SPARE PARTS",
    subtext: "GENUINE TUNING & ENGINE ASSEMBLIES",
    primaryText: "SHOP PARTS",
    primaryHref: "/retail",
    secondaryText: "CATALOGUE",
    secondaryHref: "/product-overview",
    image: "/hero-dark-slide-1.jpg",
    alt: "Motorcycle Engine Block, Red Suspension Shocks, Carburetor and Sprocket",
  },
  {
    tag: "PAKISTAN'S #1 COMMUTER BIKES",
    line1: "CD 70 & CG",
    line2: "125 PARTS",
    subtext: "GENUINE ENGINES, FUEL TANKS & CHROME SILENCERS",
    primaryText: "EXPLORE BIKES",
    primaryHref: "/retail",
    secondaryText: "CALL SPECIALIST",
    secondaryHref: "tel:+923218273645",
    image: "/hero-dark-slide-2.jpg",
    alt: "Pakistani Red Honda CD 70 and CG 125 Motorcycles Standing Together",
  },
  {
    tag: "DIRECT IMPORTER & DISTRIBUTOR",
    line1: "WHOLESALE",
    line2: "MASTER CARTONS",
    subtext: "BULK TRADE SUPPLY ACROSS PAKISTAN",
    primaryText: "WHOLESALE PORTAL",
    primaryHref: "/wholesale",
    secondaryText: "BULK INQUIRY",
    secondaryHref: "/contact",
    image: "/hero-dark-slide-3.jpg",
    alt: "Wholesale Master Cartons Overflowing with Motorcycle Parts",
  },
];

export function HeroSection() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative w-full bg-black overflow-hidden pt-20">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={800}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
        }}
        className="w-full"
      >
        {SLIDES.map((slide, idx) => (
          <SwiperSlide key={idx} className="relative w-full">
            <div className="relative w-full min-h-[500px] sm:min-h-[640px] md:min-h-[700px] lg:min-h-[760px] xl:min-h-[800px] flex items-center">
              <div className="absolute inset-0 z-0">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={idx === 0}
                  className="object-cover object-right md:object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent sm:via-black/60 md:via-black/40 lg:via-transparent z-10" />
              </div>

              <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-16 md:py-24">
                <div className="max-w-xl lg:max-w-2xl mx-auto sm:mx-0 text-center sm:text-left flex flex-col items-center sm:items-start">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 text-red-400 font-bold text-[11px] sm:text-xs tracking-widest uppercase mb-4 sm:mb-5 backdrop-blur-md">
                    {slide.tag}
                  </div>

                  <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[92px] xl:text-[104px] font-black uppercase tracking-tighter italic leading-tight md:leading-none text-white drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)] mb-4 sm:mb-6">
                    {slide.line1} <br />
                    <span className="text-red-500">{slide.line2}</span>
                  </h1>

                  <p className="text-xs sm:text-sm md:text-base text-neutral-300 font-semibold tracking-wider uppercase mb-6 sm:mb-8 drop-shadow-md">
                    {slide.subtext}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <Link
                      href={slide.primaryHref}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-wider text-xs sm:text-sm transition-all shadow-lg shadow-red-600/30 hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <span>{slide.primaryText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      href={slide.secondaryHref}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-black/50 hover:bg-white/10 text-white border border-white/20 font-bold uppercase tracking-wider text-xs sm:text-sm transition-all backdrop-blur-md cursor-pointer hover:border-white/40"
                    >
                      {slide.secondaryHref.startsWith("tel:") && (
                        <PhoneCall className="w-4 h-4 text-red-400" />
                      )}
                      <span>{slide.secondaryText}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          aria-label="Previous Slide"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-lg flex items-center justify-center transition-all cursor-pointer backdrop-blur-md hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/60 border border-white/20 shadow-lg backdrop-blur-md">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => swiperRef.current?.slideToLoop(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${activeIndex === i ? "w-6 bg-red-600" : "w-2 bg-white/40 hover:bg-white/60"
                }`}
            />
          ))}
        </div>

        <button
          onClick={() => swiperRef.current?.slideNext()}
          aria-label="Next Slide"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-lg flex items-center justify-center transition-all cursor-pointer backdrop-blur-md hover:scale-105 active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}

export default HeroSection;
