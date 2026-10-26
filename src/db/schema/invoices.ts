import { pgTable, serial, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core"

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  orderNumber: text("order_number").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone"),
  customerCity: text("customer_city"),
  dealerCode: text("dealer_code"),
  itemsSummary: text("items_summary"),
  items: jsonb("items").$type<any[]>().default([]),
  amount: integer("amount").notNull().default(0),
  status: text("status").notNull().default("Pending"),
  issueDate: timestamp("issue_date").defaultNow(),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})
