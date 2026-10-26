import type { Metadata } from "next";
import Navbar from "@/components/home/navbar";
import ContactSection from "@/components/contact/contact-section";
import BranchLocations from "@/components/contact/branch-locations";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Contact Us | Sarfraz Autos Karachi",
  description:
    "Get in touch with Sarfraz Autos for motorcycle spare parts inquiries, wholesale bulk orders, and retailer supply across Karachi.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <ContactSection />
        <BranchLocations />
      </main>
      <Footer />
    </>
  );
}
