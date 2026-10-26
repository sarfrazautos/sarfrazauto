import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core"

export const returns = pgTable("returns", {
  id: serial("id").primaryKey(),
  returnId: text("return_id").notNull(),
  orderId: text("order_id").notNull(),
  client: text("client").notNull(),
  city: text("city"),
  type: text("type").notNull().default("Wholesale"),
  product: text("product").notNull(),
  quantity: integer("quantity").notNull().default(1),
  returnAmount: integer("return_amount").notNull().default(0),
  reason: text("reason"),
  condition: text("condition"),
  status: text("status").notNull().default("Pending Receipt"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})
