import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core"

export const agingReports = pgTable("aging_reports", {
  id: serial("id").primaryKey(),
  dealerCode: text("dealer_code").notNull(),
  dealerName: text("dealer_name").notNull(),
  city: text("city").notNull(),
  creditLimit: integer("credit_limit").notNull().default(0),
  totalDue: integer("total_due").notNull().default(0),
  days0_30: integer("days_0_30").notNull().default(0),
  days31_60: integer("days_31_60").notNull().default(0),
  days61_90: integer("days_61_90").notNull().default(0),
  days90Plus: integer("days_90_plus").notNull().default(0),
  lastPayment: text("last_payment"),
  status: text("status").notNull().default("Healthy"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})
