import { MetadataRoute } from "next";

const BASE_URL = "https://www.sarfrazautos.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/retail`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/wholesale`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/signup`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/customer-portal`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/customer-portal/dealer-account`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    const { db } = require("@/lib/db");
    const { products } = require("@/db/schema/products");
    const { isNotNull, ne } = require("drizzle-orm");

    const rows = db
      .select({ slug: products.slug, type: products.type, updatedAt: products.updatedAt })
      .from(products)
      .where(isNotNull(products.slug))
      .all?.() ?? [];

    productRoutes = rows.flatMap((p: { slug: string; type: string; updatedAt: Date | null }) => {
      const routes: MetadataRoute.Sitemap = [];
      const lastMod = p.updatedAt ? new Date(p.updatedAt) : now;

      if (p.type === "retail" || p.type === "both") {
        routes.push({
          url: `${BASE_URL}/product-overview/${p.slug}`,
          lastModified: lastMod,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }

      if (p.type === "wholesale" || p.type === "both") {
        routes.push({
          url: `${BASE_URL}/wholesale-product-overview/${p.slug}`,
          lastModified: lastMod,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }

      return routes;
    });
  } catch {}

  return [...staticRoutes, ...productRoutes];
}

