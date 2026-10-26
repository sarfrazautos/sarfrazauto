import type { Metadata } from "next";
import Navbar from "@/components/home/navbar";
import WholesaleShop from "@/components/wholesale/wholesale-shop";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Wholesale & Master Cartons | Sarfraz Autos Karachi",
  description:
    "Source bulk motorcycle spare parts, engine blocks, cylinder heads, and master cartons at direct dealer rates. Wholesale dispatch across Karachi and nationwide.",
};

export default function WholesalePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <WholesaleShop />
      </main>
      <Footer />
    </>
  );
}
