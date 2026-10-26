"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { NotchedCard } from "./notched-card";
import { cn } from "@/lib/utils";

export interface CategoryBannersProps {
  className?: string;
}

export function CategoryBanners({ className = "" }: CategoryBannersProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.15 });

  return (
    <section
      ref={containerRef}
      className={cn(
        "w-full bg-background overflow-hidden pt-12 pb-4 md:pt-20 md:pb-14",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 w-full">
        <div className="max-w-2xl mb-8 md:mb-14">
          <div className="overflow-hidden pb-1 sm:pb-2">
            <motion.h2
              initial={{ y: "120%" }}
              animate={isInView ? { y: "0%" } : { y: "120%" }}
              transition={{
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-3xl md:text-5xl font-medium tracking-tight text-foreground mb-4 leading-tight inline-block"
            >
              Single Parts or Bulk Orders{" "}
              <span className="text-red-600">Built for Every Buyer</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease: "easeOut",
            }}
            className="text-base text-muted-foreground leading-relaxed"
          >
            Whether you need a single replacement component for your motorcycle
            or high-volume master cartons for your retail shop, Sarfraz Autos
            delivers certified OEM quality with instant dispatch across Pakistan.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={
              isInView
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 40, scale: 0.97 }
            }
            transition={{
              duration: 0.8,
              delay: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <NotchedCard
              image="/branch-saddar.jpg"
              imageAlt="Retail Motorcycle Spare Parts"
              description="Explore genuine Crown replacement parts and accessories ready for fast over-the-counter pickup and nationwide courier delivery."
              buttonLabel="Get Started"
              href="/retail"
              variant="white"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={
              isInView
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 40, scale: 0.97 }
            }
            transition={{
              duration: 0.8,
              delay: 0.38,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <NotchedCard
              image="/branch-godam.jpg"
              imageAlt="Wholesale Motorcycle Parts Supply"
              description="Access factory-sealed master cartons with guaranteed bulk trade margins and priority bilty terminal dispatch across Pakistan."
              buttonLabel="Get Started"
              href="/wholesale"
              variant="red"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default CategoryBanners;
