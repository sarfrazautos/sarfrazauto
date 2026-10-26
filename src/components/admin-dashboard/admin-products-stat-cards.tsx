"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { getProducts } from "@/lib/api/products"

export function AdminProductsStatCards({
  totalCount,
  retailCount,
  wholesaleCount,
}: {
  totalCount?: number
  retailCount?: number
  wholesaleCount?: number
}) {
  const { data } = useQuery({
    queryKey: ["products-stats"],
    queryFn: () => getProducts({ limit: 1 }),
    enabled: totalCount === undefined,
  })

  const total = totalCount !== undefined ? totalCount : (data?.stats?.total ?? 0)
  const retail = retailCount !== undefined ? retailCount : (data?.stats?.retail ?? 0)
  const wholesale = wholesaleCount !== undefined ? wholesaleCount : (data?.stats?.wholesale ?? 0)

  const cards = [
    {
      title: "Total Products",
      subtitle: "All products uploaded to store",
      value: total,
      imageSrc: "/hero-parts-boxes.png",
      imageAlt: "Total Products",
      imageClass: "bottom-0 right-0 max-h-24 sm:max-h-28",
    },
    {
      title: "Retail Products",
      subtitle: "Products for retail customers",
      value: retail,
      imageSrc: "/bikes.png",
      imageAlt: "Retail Products",
      imageClass: "bottom-0 right-1 max-h-20 sm:max-h-24",
    },
    {
      title: "Wholesale Products",
      subtitle: "Products for wholesale dealers",
      value: wholesale,
      imageSrc: "/wholesale-bulk.png",
      imageAlt: "Wholesale Products",
      imageClass: "bottom-0 right-0 max-h-24 sm:max-h-28",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 px-4 lg:px-6">
      {cards.map((card, index) => (
        <Card
          key={index}
          className="relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-2xs hover:border-neutral-300 transition-colors"
        >
          <CardContent className="flex flex-col justify-between min-h-[148px]">
            <div className="relative z-10 pr-28">
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
                {card.title}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                {card.subtitle}
              </p>
            </div>

            <div className="relative z-10 mt-4 sm:mt-5">
              <p className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 tabular-nums">
                {card.value}
              </p>
            </div>

            <img
              src={card.imageSrc}
              alt={card.imageAlt}
              className={`absolute object-contain pointer-events-none select-none drop-shadow-sm ${card.imageClass}`}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default AdminProductsStatCards
