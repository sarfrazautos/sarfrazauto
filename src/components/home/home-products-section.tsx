"use client";

import { useSession } from "@/lib/auth-client";
import { RetailProducts } from "@/components/home/retail-products";
import { WholesaleProducts } from "@/components/home/wholesale-products";

export function HomeProductsSection() {
  const { data: session } = useSession();
  const isWholesaler = Boolean(session?.user);

  if (isWholesaler) {
    return <WholesaleProducts title="Wholesale Master Cartons & Dealer Supply" />;
  }

  return <RetailProducts />;
}

export default HomeProductsSection;

