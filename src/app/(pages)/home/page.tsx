import Navbar from "@/components/home/navbar";
import HeroSection from "@/components/home/hero-section";
import CategoriesCircleSection from "@/components/home/categories-circle-section";
import BrandsCircleSection from "@/components/home/brands-circle-section";
import PromoBanners from "@/components/home/promo-banners";
import RetailProducts from "@/components/home/retail-products";
import WholesaleDealerCta from "@/components/home/wholesale-dealer-cta";
import PurchaseCtaSection from "@/components/home/purchase-cta-section";
import BranchesCards from "@/components/home/branches-cards";
import Footer from "@/components/footer";

export default function HomePage() {
    return (
        <>
            <Navbar />
            <main className="-mt-20">
                <HeroSection />
                <CategoriesCircleSection />
                <PromoBanners />
                <BrandsCircleSection />
                <RetailProducts />
                <WholesaleDealerCta />
                <PurchaseCtaSection />
                <BranchesCards />
            </main>
            <Footer />
        </>
    );
}

