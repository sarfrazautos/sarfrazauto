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
  const readableName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${readableName} | Sarfraz Autos`,
    description: `Product details, specifications, and pricing for ${readableName} at Sarfraz Autos Karachi.`,
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
