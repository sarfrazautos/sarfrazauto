"use client"

import { useSession } from "@/lib/auth-client"

export function useIsWholesaler() {
  const { data: session, isPending } = useSession()
  const user = session?.user as any
  const isWholesaler = Boolean(user)

  return {
    isWholesaler,
    isPending,
    user,
    session,
  }
}

