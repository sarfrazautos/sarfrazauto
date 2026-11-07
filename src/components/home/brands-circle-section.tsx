"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import { useSession } from "@/lib/auth-client"

import "swiper/css"

const BRANDS = [
  {
    name: "Honda",
    image: "/brands-logo/honda.png",
    slug: "honda",
  },
  {
    name: "Super Power",
    image: "/brands-logo/super-power.png",
    slug: "super-power",
  },
  {
    name: "Crown",
    image: "/brands-logo/crown.png",
    slug: "crown",
  },
  {
    name: "Yamaha",
    image: "/brands-logo/yamaha.png",
    slug: "yamaha",
  },
  {
    name: "Suzuki",
    image: "/brands-logo/suzuki.png",
    slug: "suzuki",
  },
  {
    name: "United",
    image: "/brands-logo/united.png",
    slug: "united",
  },
  {
    name: "Super Star",
    image: "/brands-logo/super-star.png",
    slug: "super-star",
  },
  {
    name: "Unique",
    image: "/brands-logo/unique.png",
    slug: "unique",
  },
  {
    name: "Servis",
    image: "/brands-logo/servis.png",
    slug: "servis",
  },
  {
    name: "Panther",
    image: "/brands-logo/panther.png",
    slug: "panther",
  },
  {
    name: "Diamond Tyres",
    image: "/brands-logo/diamond-tyres.png",
    slug: "diamond-tyres",
  },
  {
    name: "General Tyre",
    image: "/brands-logo/general-tyre.png",
    slug: "general-tyre",
  },
]

export function BrandsCircleSection() {
  const { data: session } = useSession()
  const isAuthenticated = Boolean(session?.user)
  const basePath = isAuthenticated ? "/wholesale" : "/retail"

  return (
    <section className="w-full sm:pt-20 py-10 sm:py-14 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 uppercase">
            Shop by Brand
          </h2>

          <Link
            href={basePath}
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
              slidesPerView: 2.5,
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
          }}
          className="w-full !py-2"
        >
          {BRANDS.map((brand, idx) => (
            <SwiperSlide key={idx}>
              <Link
                href={`${basePath}?brand=${brand.slug}`}
                className="group flex flex-col items-center gap-3 cursor-pointer py-1"
              >
                <div className="w-32 h-32 sm:w-28 sm:h-28 md:w-44 md:h-44 rounded-full overflow-hidden relative">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 176px"
                    className="object-cover rounded-full object-center p-2.5 transition-transform duration-500 group-hover:scale-110"
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
