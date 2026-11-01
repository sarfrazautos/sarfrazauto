"use client"

import { useState, useEffect } from "react"

export interface SpecialOffer {
  id: number
  title: string
  subtitle: string
  tagText: string
  discountPercent: number
  targetCategory: "all" | "retail" | "wholesale"
  startDate: string
  endDate: string
  buttonText: string
  buttonLink: string
  isActive: boolean
}

let cachedOffer: SpecialOffer | null = null
let lastFetchTime = 0
const listeners = new Set<() => void>()

function notifyListeners() {
  listeners.forEach((listener) => listener())
}

export function useActiveOffer() {
  const [offer, setOffer] = useState<SpecialOffer | null>(cachedOffer)
  const [loading, setLoading] = useState(!cachedOffer)

  useEffect(() => {
    const handleUpdate = () => {
      setOffer(cachedOffer)
      setLoading(false)
    }

    listeners.add(handleUpdate)

    const now = Date.now()
    if (!cachedOffer || now - lastFetchTime > 30000) {
      fetch("/api/offers/active")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.offer) {
            cachedOffer = data.offer
          } else {
            cachedOffer = null
          }
          lastFetchTime = Date.now()
          notifyListeners()
        })
        .catch(() => {
          cachedOffer = null
          notifyListeners()
        })
    } else {
      setOffer(cachedOffer)
      setLoading(false)
    }

    return () => {
      listeners.delete(handleUpdate)
    }
  }, [])

  const isApplicable = (type: "retail" | "wholesale" | "all" = "retail") => {
    if (!offer || !offer.isActive) return false
    const now = new Date()
    const end = new Date(offer.endDate)
    const start = new Date(offer.startDate)
    if (now < start || now > end) return false
    if (offer.targetCategory === "all") return true
    return offer.targetCategory === type
  }

  const getDiscountAmount = (amount: number, type: "retail" | "wholesale" = "retail") => {
    if (!isApplicable(type) || amount <= 0) return 0
    return Math.round((amount * (offer?.discountPercent || 0)) / 100)
  }

  return {
    offer,
    loading,
    isApplicable,
    getDiscountAmount,
  }
}

