import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core"

export const schemes = pgTable("schemes", {
  id: serial("id").primaryKey(),
  productId: text("product_id").notNull(),
  productName: text("product_name").notNull(),
  category: text("category"),
  brand: text("brand"),
  cartonPrice: integer("carton_price").default(0),
  buyQty: integer("buy_qty").notNull().default(10),
  freeQty: integer("free_qty").notNull().default(1),
  status: text("status").notNull().default("Active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})
