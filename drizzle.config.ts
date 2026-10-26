import { config } from "dotenv"
config({ path: ".env.local" })

import { defineConfig } from "drizzle-kit"

const dbUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL

if (!dbUrl) {
  throw new Error("DATABASE_URL or DATABASE_URL_UNPOOLED is not set")
}

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
})
