import type { Metadata } from "next";
import Navbar from "@/components/home/navbar";
import WishlistSection from "@/components/wishlist/wishlist-section";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "My Wishlist | Sarfraz Autos",
  description:
    "View your saved motorcycle parts and assemblies. Keep track of favorite Crown components and easily add them to your cart.",
};

export default function WishlistPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <WishlistSection />
      </main>
      <Footer />
    </>
  );
}
