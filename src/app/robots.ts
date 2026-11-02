import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/retail", "/wholesale", "/contact", "/product-overview/", "/wholesale-product-overview/"],
        disallow: [
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
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: "https://www.sarfrazautos.com/sitemap.xml",
    host: "https://www.sarfrazautos.com",
  };
}

