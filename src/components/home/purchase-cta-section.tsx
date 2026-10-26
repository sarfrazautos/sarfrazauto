import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { ArrowRight, Package, PhoneCall } from "lucide-react";

export default function PurchaseCtaSection() {
  return (
    <section
      className={cn(
        "w-full bg-black text-white relative",
        "flex items-center justify-center py-24 md:py-32 overflow-hidden"
      )}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center"
      >
        <source src="/forklift-warehouse.mp4" type="video/mp4" />
        <source src="https://videos.pexels.com/video-files/4477603/4477603-hd_1280_720_30fps.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 max-w-3xl flex flex-col items-center justify-center text-center px-4">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-red-600/90 text-white backdrop-blur-md mb-4 border border-red-500/30 uppercase tracking-wider shadow-sm">
          Direct Counter &amp; Bulk Distribution
        </span>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 leading-tight drop-shadow-md">
          Contact Us for Purchasing &amp; Supply
        </h2>
        <p className="text-sm md:text-base lg:text-lg text-zinc-200 max-w-xl mb-8 leading-relaxed drop-shadow-sm">
          Need urgent counter pick-up for a single bike part, or looking to
          register your shop for wholesale master crate shipments? Our team is
          ready to assist you.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/wholesale"
            className={cn(
              buttonVariants({ size: "lg" }),
              "w-full sm:w-auto rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium px-8 h-12 text-sm md:text-base shadow-lg transition-transform hover:scale-105"
            )}
          >
            <Package className="mr-2 size-5" />
            Wholesale Orders
            <ArrowRight className="ml-2 size-4" />
          </Link>
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ size: "lg" }),
              "w-full sm:w-auto rounded-lg bg-white hover:bg-neutral-100 text-neutral-900 font-medium px-8 h-12 text-sm md:text-base shadow-lg transition-transform hover:scale-105"
            )}
          >
            <PhoneCall className="mr-2 size-4" />
            Retail Counter
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}