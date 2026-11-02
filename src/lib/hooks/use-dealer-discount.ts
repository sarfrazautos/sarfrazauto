"use client"

import { useQuery } from "@tanstack/react-query"
import { useSession } from "@/lib/auth-client"

export function useDealerDiscount() {
  const { data: session } = useSession()

  const { data } = useQuery({
    queryKey: ["dealer-status", session?.user?.email],
    queryFn: async () => {
      const res = await fetch("/api/customer/dealer-status")
      if (!res.ok) return null
      return res.json()
    },
    enabled: Boolean(session?.user),
    staleTime: 1000 * 60 * 3,
  })

  const isApproved = Boolean(data?.isApproved)
  const discountPercentage = isApproved ? Number(data?.discountPercentage) || 0 : 0

  const calculateDiscountedPrice = (price: number | string) => {
    const numeric = Number(price) || 0
    if (discountPercentage <= 0) return numeric
    return Math.round(numeric * (1 - discountPercentage / 100))
  }

  const getDiscountAmount = (price: number | string) => {
    const numeric = Number(price) || 0
    if (discountPercentage <= 0) return 0
    return Math.round((numeric * discountPercentage) / 100)
  }

  return {
    isDealer: isApproved,
    discountPercentage,
    shopName: data?.shopName || session?.user?.name || "Dealer",
    calculateDiscountedPrice,
    getDiscountAmount,
  }
}

