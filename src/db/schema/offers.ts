import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core"

export const specialOffers = pgTable("special_offers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default("Special Deal!"),
  subtitle: text("subtitle").notNull().default("Get 10% OFF on all products"),
  tagText: text("tag_text").notNull().default("10% OFF"),
  discountPercent: integer("discount_percent").notNull().default(10),
  targetCategory: text("target_category").notNull().default("all"),
  startDate: timestamp("start_date").notNull().defaultNow(),
  endDate: timestamp("end_date").notNull(),
  buttonText: text("button_text").notNull().default("Shop Now"),
  buttonLink: text("button_link").notNull().default("/retail"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

