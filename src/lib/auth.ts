import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/lib/db"
import * as schema from "@/db/schema"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  baseURL:
    process.env.BETTER_AUTH_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : undefined),
  trustedOrigins: [
    "http://localhost:3000",
    "https://sarfrazauto.vercel.app",
    "https://*.vercel.app",
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      : []),
    ...(process.env.NEXT_PUBLIC_APP_URL ? [process.env.NEXT_PUBLIC_APP_URL] : []),
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
  ],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
      },
      phone: {
        type: "string",
        required: false,
      },
      city: {
        type: "string",
        required: false,
      },
      shopName: {
        type: "string",
        required: false,
      },
      deliveryAddress: {
        type: "string",
        required: false,
      },
    },
  },
})
