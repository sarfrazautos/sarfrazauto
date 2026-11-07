import type { Metadata } from "next";
import Navbar from "@/components/home/navbar";
import HeroSection from "@/components/home/hero-section";
import CategoriesCircleSection from "@/components/home/categories-circle-section";
import BrandsCircleSection from "@/components/home/brands-circle-section";
import PromoBanners from "@/components/home/promo-banners";
import HomeProductsSection from "@/components/home/home-products-section";
import WholesaleDealerCta from "@/components/home/wholesale-dealer-cta";
import PurchaseCtaSection from "@/components/home/purchase-cta-section";
import BranchesCards from "@/components/home/branches-cards";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Sarfraz Autos | Genuine Crown Motorcycle Spare Parts – Karachi, Pakistan",
  description:
    "Buy genuine Crown motorcycle spare parts online in Pakistan. Official wholesale & retail distributor of Honda CD70, CG125, Yamaha YBR, Suzuki GS150 engine parts & accessories. Cash on delivery across Pakistan.",
  alternates: {
    canonical: "https://www.sarfrazautos.com",
  },
  openGraph: {
    title: "Sarfraz Autos | Crown Motorcycle Spare Parts – Pakistan",
    description:
      "Official wholesale distributor of Crown motorcycle parts. Honda, Yamaha, Suzuki spare parts with COD delivery across Pakistan.",
    url: "https://www.sarfrazautos.com",
    images: [{ url: "/og-banner.png", width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="-mt-20">
        <HeroSection />
        <CategoriesCircleSection />
        <PromoBanners />
        <BrandsCircleSection />
        <HomeProductsSection />
        <WholesaleDealerCta />
        <PurchaseCtaSection />
        <BranchesCards />
      </main>
      <Footer />
    </>
  );
}
