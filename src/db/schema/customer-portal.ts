import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core"

export const customerPortalProfiles = pgTable("customer_portal_profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  businessName: text("business_name").notNull().default("Tariq Auto Traders"),
  contactPerson: text("contact_person").notNull().default("Muhammad Tariq"),
  email: text("email").notNull().default("dealer@sarfrazautos.com"),
  phone: text("phone").notNull().default("+92 300 1234567"),
  shopAddress: text("shop_address").notNull().default("Shop #14, Bilal Auto Market, Montgomery Road, Lahore"),
  preferredCity: text("preferred_city").notNull().default("Lahore"),
  creditLimit: integer("credit_limit").notNull().default(1500000),
  totalPurchases: integer("total_purchases").notNull().default(0),
  totalMoneySpent: integer("total_money_spent").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})
