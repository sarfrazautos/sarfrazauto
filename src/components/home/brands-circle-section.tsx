"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"

import "swiper/css"

const BRANDS = [
  {
    name: "Honda",
    image: "/brands-logo/honda.png",
    href: "/retail?brand=honda",
  },
  {
    name: "Yamaha",
    image: "/brands-logo/yamaha.png",
    href: "/retail?brand=yamaha",
  },
  {
    name: "Suzuki",
    image: "/brands-logo/suzuki.png",
    href: "/retail?brand=suzuki",
  },
  {
    name: "United",
    image: "/brands-logo/united.png",
    href: "/retail?brand=united",
  },
  {
    name: "Crown",
    image: "/brands-logo/crown.png",
    href: "/retail?brand=crown",
  },
  {
    name: "Super Star",
    image: "/brands-logo/super-star.png",
    href: "/retail?brand=super-star",
  },
  {
    name: "Unique",
    image: "/brands-logo/unique.png",
    href: "/retail?brand=unique",
  },
]

export function BrandsCircleSection() {
  return (
    <section className="w-full sm:pt-20   py-10 sm:py-14 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 uppercase">
            Shop by Brand
          </h2>

          <Link
            href="/retail"
            className="group flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-red-600 transition-colors shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <Swiper
          modules={[Autoplay]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          spaceBetween={24}
          slidesPerView={2}
          breakpoints={{
            480: {
              slidesPerView: 2,
              spaceBetween: 18,
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 28,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 32,
            },
          }}
          className="w-full !py-2"
        >
          {[...BRANDS, ...BRANDS].map((brand, idx) => (
            <SwiperSlide key={idx}>
              <Link
                href={brand.href}
                className="group flex flex-col items-center gap-3 cursor-pointer py-1"
              >
                <div className="w-36 h-36 sm:w-36 sm:h-36 md:w-48 md:h-48 lg:w-52 lg:h-52 rounded-full overflow-hidden relative bg-[#eef2f5] mx-auto">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    sizes="(max-width: 640px) 144px, (max-width: 768px) 192px, 208px"
                    className="object-cover rounded-full object-center transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <span className="text-xs sm:text-[13px] md:text-sm font-semibold text-neutral-800 group-hover:text-red-600 transition-colors text-center">
                  {brand.name}
                </span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default BrandsCircleSection
