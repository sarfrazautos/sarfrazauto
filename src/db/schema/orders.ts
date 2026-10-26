import { pgTable, serial, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core"

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone"),
  customerCity: text("customer_city"),
  orderType: text("order_type").notNull().default("retail"),
  items: jsonb("items").$type<any[]>().default([]),
  totalAmount: integer("total_amount").notNull().default(0),
  status: text("status").notNull().default("pending"),
  paymentStatus: text("payment_status").default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})
