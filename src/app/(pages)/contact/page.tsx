import type { Metadata } from "next";
import Navbar from "@/components/home/navbar";
import ContactSection from "@/components/contact/contact-section";
import BranchLocations from "@/components/contact/branch-locations";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Contact Sarfraz Autos | Motorcycle Parts Shop Karachi – WhatsApp & Phone",
  description:
    "Contact Sarfraz Autos for motorcycle spare parts, bulk wholesale orders, and dealer inquiries. Visit our shop in Taj Mahal Market Karachi or call/WhatsApp +92-333-1285556.",
  alternates: {
    canonical: "https://www.sarfrazautos.com/contact",
  },
  openGraph: {
    title: "Contact Sarfraz Autos | Karachi Motorcycle Parts",
    description:
      "Get in touch with Sarfraz Autos for wholesale & retail motorcycle spare parts. WhatsApp, phone & in-store at Karachi.",
    url: "https://www.sarfrazautos.com/contact",
  },
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
