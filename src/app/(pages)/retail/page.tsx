import type { Metadata } from "next";
import Navbar from "@/components/home/navbar";
import RetailShop from "@/components/retail/retail-shop";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Buy Motorcycle Spare Parts Online in Pakistan | Sarfraz Autos",
  description:
    "Shop genuine Crown motorcycle spare parts online. Honda CD70, CG125, Yamaha YBR 125, Suzuki GS150 engine parts, clutch plates, shock absorbers & accessories. Instant pickup in Karachi or cash on delivery nationwide.",
  keywords: [
    "buy motorcycle spare parts online Pakistan",
    "Honda CD70 spare parts online",
    "CG125 engine parts Pakistan",
    "Yamaha YBR parts online Pakistan",
    "motorcycle parts cash on delivery",
    "Crown parts online store",
  ],
  alternates: {
    canonical: "https://www.sarfrazautos.com/retail",
  },
  openGraph: {
    title: "Buy Genuine Motorcycle Parts Online | Sarfraz Autos",
    description:
      "Honda CD70, CG125, Yamaha YBR, Suzuki GS150 spare parts. Cash on delivery across Pakistan.",
    url: "https://www.sarfrazautos.com/retail",
  },
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
