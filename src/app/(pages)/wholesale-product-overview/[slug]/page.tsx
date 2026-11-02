import type { Metadata } from "next";
import Navbar from "@/components/home/navbar";
import ProductOverviewSection from "@/components/product-overview/product-overview-section";
import Footer from "@/components/footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  let productName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/products/${slug}`, {
      cache: "force-cache",
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.product) {
        productName = data.product.name || productName;
        const brand = data.product.brand || "Crown";
        const category = data.product.category || "Motorcycle Part";
        const price = data.product.price;
        return {
          title: `${productName} Wholesale – ${brand} Bulk Master Carton Pakistan | Sarfraz Autos`,
          description: `Source wholesale ${brand} ${productName} master cartons at factory dealer rates. Genuine ${category} bulk supply for dealers and distributors. COD & bilty dispatch nationwide from Karachi.${price ? ` From Rs. ${Number(price).toLocaleString()} per carton.` : ""}`,
          alternates: {
            canonical: `https://www.sarfrazautos.com/wholesale-product-overview/${slug}`,
          },
          openGraph: {
            title: `${productName} Wholesale | Bulk ${brand} Parts – Sarfraz Autos`,
            description: `Wholesale ${brand} ${productName} master cartons. Factory-direct rates for dealers across Pakistan.`,
            url: `https://www.sarfrazautos.com/wholesale-product-overview/${slug}`,
            images: data.product.images?.[0] ? [{ url: data.product.images[0] }] : undefined,
          },
        };
      }
    }
  } catch {}

  return {
    title: `${productName} Wholesale Master Carton | Sarfraz Autos`,
    description: `Source wholesale ${productName} master cartons at factory dealer rates. Bulk dispatch across Karachi and nationwide from Sarfraz Autos.`,
    alternates: {
      canonical: `https://www.sarfrazautos.com/wholesale-product-overview/${slug}`,
    },
  };
}

export default async function WholesaleProductOverviewDynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <ProductOverviewSection slug={slug} defaultType="wholesale" />
      </main>
      <Footer />
    </>
  );
}
