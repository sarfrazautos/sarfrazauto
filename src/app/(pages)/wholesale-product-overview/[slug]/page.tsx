import type { Metadata } from "next";
import Navbar from "@/components/home/navbar";
import ProductOverviewSection from "@/components/product-overview/product-overview-section";
import Footer from "@/components/footer";

async function fetchProduct(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/products/${slug}`, {
      cache: "force-cache",
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.product) return data.product;
    }
  } catch {}
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  const productName = product?.name || slug
    .split("-")
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const brand = product?.brand || "Crown";
  const category = product?.category || "Motorcycle Part";
  const price = product?.price;

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
      images: product?.images?.[0] ? [{ url: product.images[0] }] : [{ url: "/og-banner.png" }],
    },
  };
}

export default async function WholesaleProductOverviewDynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  const productName = product?.name || slug
    .split("-")
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `https://www.sarfrazautos.com/wholesale-product-overview/${slug}#product`,
        name: `${productName} (Wholesale Master Carton)`,
        image: product?.images?.length ? product.images : ["https://www.sarfrazautos.com/og-banner.png"],
        description: product?.description || `Wholesale ${productName} master cartons at direct dealer rates from Sarfraz Autos Karachi.`,
        sku: `SA-WS-${slug}`,
        brand: {
          "@type": "Brand",
          name: product?.brand || "Crown",
        },
        offers: {
          "@type": "Offer",
          url: `https://www.sarfrazautos.com/wholesale-product-overview/${slug}`,
          priceCurrency: "PKR",
          price: String(product?.price || 0),
          availability: product?.stockStatus === "out_of_stock" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: {
            "@type": "Organization",
            name: "Sarfraz Autos",
          },
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: String(product?.rating || "5.0"),
          reviewCount: String(product?.reviewsCount || "10"),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.sarfrazautos.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Wholesale Cartons",
            item: "https://www.sarfrazautos.com/wholesale",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: productName,
            item: `https://www.sarfrazautos.com/wholesale-product-overview/${slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen bg-white">
        <ProductOverviewSection slug={slug} defaultType="wholesale" />
      </main>
      <Footer />
    </>
  );
}
