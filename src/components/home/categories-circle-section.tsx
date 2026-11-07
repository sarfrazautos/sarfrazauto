"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useSession } from "@/lib/auth-client";

import "swiper/css";

const CATEGORIES = [
  {
    name: "Tyres & Tubes",
    image: "/categories/tyre.jpg",
    slug: "tyres",
  },
  {
    name: "Fuel & Oils",
    image: "/categories/fuel.jpg",
    slug: "fuel",
  },
  {
    name: "Silencers",
    image: "/categories/silencer.jpg",
    slug: "silencer",
  },
  {
    name: "Backlights",
    image: "/categories/backlight.jpg",
    slug: "backlight",
  },
  {
    name: "Fuel Tanks",
    image: "/categories/fuel-tank.jpg",
    slug: "fuel-tank",
  },
  {
    name: "Engine Assemblies",
    image: "/categories/engine.jpg",
    slug: "engine",
  },
  {
    name: "Shock Absorbers",
    image: "/categories/shocks.jpg",
    slug: "shocks",
  },
  {
    name: "Carburetors",
    image: "/categories/carburetor.jpg",
    slug: "carburetor",
  },
  {
    name: "Alloy Rims",
    image: "/categories/alloy-rim.jpg",
    slug: "wheels",
  },
  {
    name: "Headlights",
    image: "/categories/headlight.jpg",
    slug: "headlight",
  },
];

export function CategoriesCircleSection() {
  const { data: session } = useSession();
  const isAuthenticated = Boolean(session?.user);
  const basePath = isAuthenticated ? "/wholesale" : "/retail";

  return (
    <section className="w-full bg-[#fcfbf9] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 uppercase">
            Shop by Category
          </h2>

          <Link
            href={basePath}
            className="group flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-red-600 transition-colors"
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
          {CATEGORIES.map((cat, idx) => (
            <SwiperSlide key={idx}>
              <Link
                href={`${basePath}?category=${cat.slug}`}
                className="group flex flex-col items-center gap-3 cursor-pointer py-1"
              >
                <div className="w-44 h-44 sm:w-28 sm:h-28 md:w-56 md:h-56 rounded-full overflow-hidden relative">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 176px"
                    className="object-cover rounded-full object-center p-2.5 transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <span className="text-xs sm:text-[13px] md:text-sm font-semibold text-neutral-800 group-hover:text-red-600 transition-colors text-center">
                  {cat.name}
                </span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default CategoriesCircleSection;
