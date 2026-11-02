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
          title: `${productName} – ${brand} ${category} Price Pakistan | Sarfraz Autos`,
          description: `Buy genuine ${brand} ${productName} online in Pakistan. Original ${category} for Honda, Yamaha, Suzuki motorcycles. Best price${price ? ` from Rs. ${Number(price).toLocaleString()}` : ""}. Cash on delivery nationwide.`,
          alternates: {
            canonical: `https://www.sarfrazautos.com/product-overview/${slug}`,
          },
          openGraph: {
            title: `${productName} | ${brand} Genuine Part – Sarfraz Autos`,
            description: `Original ${brand} ${productName}. Best price in Pakistan with cash on delivery.`,
            url: `https://www.sarfrazautos.com/product-overview/${slug}`,
            images: data.product.images?.[0] ? [{ url: data.product.images[0] }] : undefined,
          },
        };
      }
    }
  } catch {}

  return {
    title: `${productName} – Genuine Motorcycle Part Price Pakistan | Sarfraz Autos`,
    description: `Buy genuine ${productName} motorcycle spare part online in Pakistan at Sarfraz Autos. Best price with cash on delivery.`,
    alternates: {
      canonical: `https://www.sarfrazautos.com/product-overview/${slug}`,
    },
  };
}

export default async function ProductOverviewDynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <ProductOverviewSection slug={slug} defaultType="retail" />
      </main>
      <Footer />
    </>
  );
}
