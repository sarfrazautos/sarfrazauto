import type { Metadata } from "next";
import Navbar from "@/components/home/navbar";
import CheckoutSection from "@/components/checkout/checkout-section";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Checkout | Sarfraz Autos",
  description:
    "Complete your motorcycle spare parts and accessories order with Sarfraz Autos Karachi. Secure checkout with local delivery and nationwide dispatch.",
};

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <CheckoutSection />
      </main>
      <Footer />
    </>
  );
}
