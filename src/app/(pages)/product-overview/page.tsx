import type { Metadata } from "next";
import Navbar from "@/components/home/navbar";
import ProductOverviewSection from "@/components/product-overview/product-overview-section";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Product Overview | Sarfraz Autos",
  description:
    "Product overview and specifications for genuine motorcycle engine parts, cylinder heads, and replacement accessories in Karachi.",
};

export default function ProductOverviewPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <ProductOverviewSection defaultType="retail" />
      </main>
      <Footer />
    </>
  );
}
