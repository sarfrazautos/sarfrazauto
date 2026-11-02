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
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Sarfraz Autos",
    url: "https://www.sarfrazautos.com/contact",
    description: "Contact information, branch location, and wholesale inquiries for Sarfraz Autos in Karachi, Pakistan.",
    mainEntity: {
      "@type": "AutoPartsStore",
      name: "Sarfraz Autos",
      telephone: "+92-333-1285556",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Taj Mahal Market, M.A. Jinnah Road",
        addressLocality: "Karachi",
        addressRegion: "Sindh",
        postalCode: "74200",
        addressCountry: "PK",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen bg-white">
        <ContactSection />
        <BranchLocations />
      </main>
      <Footer />
    </>
  );
}
