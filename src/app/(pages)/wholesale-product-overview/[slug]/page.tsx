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
    title: `${readableName} (Wholesale Master Carton) | Sarfraz Autos`,
    description: `Source wholesale master cartons for ${readableName} at factory dealer rates. Bulk dispatch across Karachi and nationwide.`,
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
