import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core"

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  type: text("type").notNull(),
  category: text("category").notNull(),
  brand: text("brand").notNull(),
  price: integer("price").notNull(),
  originalPrice: integer("original_price"),
  stockStatus: text("stock_status").default("instock"),
  compatibleBike: text("compatible_bike"),
  description: text("description"),
  colors: jsonb("colors").$type<string[]>().default([]),
  images: jsonb("images").$type<string[]>().default([]),
  mainImageIndex: integer("main_image_index").default(0),
  badge: text("badge"),
  isFeatured: boolean("is_featured").default(false),
  rating: text("rating").default("5.0"),
  reviewsCount: integer("reviews_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})
