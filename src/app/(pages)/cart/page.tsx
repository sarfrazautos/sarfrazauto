import type { Metadata } from "next";
import Navbar from "@/components/home/navbar";
import CartSection from "@/components/cart/cart-section";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Shopping Cart | Sarfraz Autos",
  description:
    "Review your motorcycle spare parts and accessories order with Sarfraz Autos. Genuine Crown assemblies with fast Karachi delivery and nationwide dispatch.",
};

export default function CartPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <CartSection />
      </main>
      <Footer />
    </>
  );
}
