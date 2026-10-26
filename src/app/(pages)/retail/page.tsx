import type { Metadata } from "next";
import Navbar from "@/components/home/navbar";
import RetailShop from "@/components/retail/retail-shop";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Retail Counter & Online Shop | Sarfraz Autos Karachi",
  description:
    "Buy single genuine motorcycle spare parts, engine components, and overhaul kits for Honda, Suzuki, and Yamaha. Instant pickup in Saddar or delivery across Pakistan.",
};

export default function RetailPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <RetailShop />
      </main>
      <Footer />
    </>
  );
}
