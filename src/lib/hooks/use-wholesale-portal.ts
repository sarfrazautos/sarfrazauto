"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getCustomerDashboard,
  getCustomerBulkOrders,
  getCustomerOrders,
  invalidateWholesalePortalCache,
} from "@/lib/api/wholesale-portal"

export function useWholesaleDashboard() {
  return useQuery({
    queryKey: ["customer-dashboard-stats"],
    queryFn: () => getCustomerDashboard(),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  })
}

export function useWholesaleBulkOrders() {
  return useQuery({
    queryKey: ["customer-bulk-orders-stats"],
    queryFn: () => getCustomerBulkOrders(),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  })
}

export function useWholesaleOrders(params: {
  page?: number
  limit?: number
  search?: string
  status?: string
}) {
  return useQuery({
    queryKey: [
      "customer-orders",
      {
        page: params.page || 1,
        limit: params.limit || 20,
        search: params.search || "",
        status: params.status || "",
      },
    ],
    queryFn: () => getCustomerOrders(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  })
}

export function useInvalidateWholesalePortal() {
  const queryClient = useQueryClient()
  return () => {
    invalidateWholesalePortalCache()
    queryClient.invalidateQueries({ queryKey: ["customer-dashboard-stats"] })
    queryClient.invalidateQueries({ queryKey: ["customer-bulk-orders-stats"] })
    queryClient.invalidateQueries({ queryKey: ["customer-orders"] })
    queryClient.invalidateQueries({ queryKey: ["customer-dedicated-orders"] })
  }
}

