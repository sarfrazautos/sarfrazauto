import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const disallowed = [
    "/admin/",
    "/api/",
    "/payment",
    "/checkout",
    "/cart",
    "/customer-portal/orders",
    "/customer-portal/order-history",
    "/customer-portal/payment-history",
    "/customer-portal/commercial-invoices",
    "/customer-portal/bulk-orders",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/retail", "/wholesale", "/contact", "/product-overview/", "/wholesale-product-overview/"],
        disallow: disallowed,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "Applebot"],
        allow: ["/", "/retail", "/wholesale", "/contact", "/product-overview/", "/wholesale-product-overview/", "/llms.txt"],
        disallow: disallowed,
      },
    ],
    sitemap: "https://www.sarfrazautos.com/sitemap.xml",
    host: "https://www.sarfrazautos.com",
  };
}
