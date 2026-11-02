import { DM_Sans, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import LenisScroll from "@/components/lenis";
import QueryProvider from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { FloatingWhatsAppButton } from "@/components/whatsapp-floating-button";
import { AiVoiceAssistant } from "@/components/ai-voice-assistant";
import { GoogleTranslateProvider } from "@/components/google-translate-provider";
import { SpecialOfferModal } from "@/components/special-offer-modal";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://www.sarfrazautos.com";

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Sarfraz Autos | Genuine Crown Motorcycle Spare Parts – Karachi, Pakistan",
    template: "%s | Sarfraz Autos",
  },
  description:
    "Buy genuine Crown motorcycle spare parts online in Pakistan. Official wholesale distributor of Honda CD70, CG125, Yamaha YBR, Suzuki GS150 engine parts, overhaul kits & accessories. Cash on delivery across Karachi, Lahore, Islamabad & nationwide.",
  keywords: [
    "motorcycle spare parts online Pakistan",
    "Crown motorcycle parts Pakistan",
    "bike spare parts Karachi",
    "Honda CD70 spare parts",
    "Honda CG125 parts Pakistan",
    "Yamaha YBR 125 spare parts",
    "Suzuki GS150 parts online",
    "genuine motorcycle parts wholesale",
    "motorcycle parts cash on delivery Pakistan",
    "wholesale bike parts Karachi",
    "engine overhaul kit Pakistan",
    "motorcycle accessories online Pakistan",
    "Crown parts distributor Pakistan",
    "bike parts online shopping Pakistan",
    "motorcycle spare parts Lahore",
    "motorcycle spare parts Islamabad",
    "bulk motorcycle parts supplier Pakistan",
  ],
  authors: [{ name: "Sarfraz Autos", url: BASE_URL }],
  creator: "Sarfraz Autos",
  publisher: "Sarfraz Autos",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: BASE_URL,
    siteName: "Sarfraz Autos",
    title: "Sarfraz Autos | Genuine Crown Motorcycle Spare Parts – Pakistan",
    description:
      "Official wholesale & retail supplier of genuine Crown motorcycle spare parts. Honda, Yamaha, Suzuki parts with cash on delivery across Pakistan.",
    images: [
      {
        url: "/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Sarfraz Autos – Crown Motorcycle Spare Parts Pakistan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sarfraz Autos | Crown Motorcycle Parts Pakistan",
    description:
      "Genuine Crown motorcycle spare parts wholesale & retail. Honda CD70, CG125, Yamaha YBR, Suzuki parts online. COD across Pakistan.",
    images: ["/og-banner.png"],
    creator: "@sarfrazautos",
  },
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
  verification: {
    google: "",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.sarfrazautos.com/#organization",
        name: "Sarfraz Autos",
        url: "https://www.sarfrazautos.com",
        logo: {
          "@type": "ImageObject",
          url: "https://www.sarfrazautos.com/icon.png",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+92-333-1285556",
            contactType: "customer service",
            areaServed: "PK",
            availableLanguage: ["Urdu", "English"],
          },
        ],
        address: {
          "@type": "PostalAddress",
          streetAddress: "Taj Mahal Market, M.A. Jinnah Road",
          addressLocality: "Karachi",
          addressRegion: "Sindh",
          postalCode: "74200",
          addressCountry: "PK",
        },
        sameAs: [
          "https://www.facebook.com/sarfrazautos",
          "https://wa.me/923331285556",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://www.sarfrazautos.com/#website",
        url: "https://www.sarfrazautos.com",
        name: "Sarfraz Autos",
        publisher: { "@id": "https://www.sarfrazautos.com/#organization" },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://www.sarfrazautos.com/retail?search={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "AutoPartsStore",
        "@id": "https://www.sarfrazautos.com/#store",
        name: "Sarfraz Autos",
        description:
          "Official wholesale and retail distributor of genuine Crown motorcycle spare parts in Karachi, Pakistan.",
        url: "https://www.sarfrazautos.com",
        telephone: "+92-333-1285556",
        priceRange: "Rs. 50 – Rs. 50,000",
        currenciesAccepted: "PKR",
        paymentAccepted: "Cash, Bank Transfer, EasyPaisa, JazzCash",
        openingHours: "Mo-Sa 09:00-19:00",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Taj Mahal Market, M.A. Jinnah Road",
          addressLocality: "Karachi",
          addressRegion: "Sindh",
          postalCode: "74200",
          addressCountry: "PK",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 24.8607,
          longitude: 67.0011,
        },
        hasMap: "https://maps.google.com/?q=Taj+Mahal+Market+Karachi",
        servesCuisine: undefined,
        image: "https://www.sarfrazautos.com/og-banner.png",
      },
    ],
  };

  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", dmSans.variable)}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <LenisScroll>
            {children}
          </LenisScroll>
        </QueryProvider>
        <FloatingWhatsAppButton />
        <AiVoiceAssistant />
        <SpecialOfferModal />
        <GoogleTranslateProvider />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
