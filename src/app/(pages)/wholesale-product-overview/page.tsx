import type { Metadata } from "next";
import Navbar from "@/components/home/navbar";
import ProductOverviewSection from "@/components/product-overview/product-overview-section";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Wholesale Product Overview | Sarfraz Autos",
  description:
    "Source wholesale master cartons of motorcycle spare parts at direct factory dealer rates. Bulk freight dispatch from Karachi.",
};

export default function WholesaleProductOverviewPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <ProductOverviewSection defaultType="wholesale" />
      </main>
      <Footer />
    </>
  );
}
