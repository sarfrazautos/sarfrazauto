import type { Metadata } from "next";
import Navbar from "@/components/home/navbar";
import PaymentSection from "@/components/payment/payment-section";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Payment | Sarfraz Autos",
  description:
    "Complete payment for your motorcycle spare parts order via Meezan Bank, UBL, EasyPaisa, JazzCash, or Cash on Delivery.",
};

export default function PaymentPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <PaymentSection />
      </main>
      <Footer />
    </>
  );
}
