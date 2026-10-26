import { DM_Sans, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import LenisScroll from "@/components/lenis";
import QueryProvider from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";

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

export const metadata = {
  title: "Sarfraz Autos | Crown Motorcycle Parts & Wholesale Distributor",
  description: "Official distributor and wholesale supplier of genuine Crown motorcycle spare parts in Karachi, Pakistan. Bulk orders, retail shop, and reliable delivery.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", dmSans.variable)}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <LenisScroll>
            {children}
          </LenisScroll>
        </QueryProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
