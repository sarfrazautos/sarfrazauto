import type { Metadata } from "next";
import Navbar from "@/components/home/navbar";
import WholesaleShop from "@/components/wholesale/wholesale-shop";
import { WholesaleStatusBanner } from "@/components/wholesale/wholesale-status-banner";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Wholesale Motorcycle Parts Supplier Pakistan | Bulk Orders | Sarfraz Autos",
  description:
    "Source bulk motorcycle spare parts & master cartons at direct factory dealer rates. Crown parts wholesale distributor in Karachi. Dealer accounts, trade schemes, and nationwide bilty dispatch for Honda, Yamaha, Suzuki parts.",
  keywords: [
    "wholesale motorcycle parts Pakistan",
    "bulk bike parts supplier Karachi",
    "Crown parts wholesale distributor",
    "motorcycle parts dealer Pakistan",
    "master carton bike parts",
    "wholesale Honda CD70 parts",
    "motorcycle parts wholesale Karachi",
    "dealer account motorcycle parts",
  ],
  alternates: {
    canonical: "https://www.sarfrazautos.com/wholesale",
  },
  openGraph: {
    title: "Wholesale Motorcycle Parts – Bulk Dealer Rates | Sarfraz Autos",
    description:
      "Factory-direct wholesale Crown parts. Bulk orders, master cartons, and trade schemes for dealers across Pakistan.",
    url: "https://www.sarfrazautos.com/wholesale",
  },
};

export default function WholesalePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <WholesaleStatusBanner />
        <WholesaleShop />
      </main>
      <Footer />
    </>
  );
}
