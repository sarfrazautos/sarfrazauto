import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core"

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  paymentNumber: text("payment_number").notNull(),
  customerName: text("customer_name").notNull(),
  orderNumber: text("order_number"),
  amount: integer("amount").notNull().default(0),
  method: text("method").notNull().default("Bank Transfer"),
  screenshotUrl: text("screenshot_url"),
  status: text("status").notNull().default("Pending"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})
