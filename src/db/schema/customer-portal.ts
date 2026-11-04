import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core"

export const customerPortalProfiles = pgTable("customer_portal_profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  businessName: text("business_name").notNull().default(""),
  contactPerson: text("contact_person").notNull().default(""),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  shopAddress: text("shop_address").notNull().default(""),
  preferredCity: text("preferred_city").notNull().default(""),
  creditLimit: integer("credit_limit").notNull().default(0),
  discountPercentage: integer("discount_percentage").notNull().default(0),
  totalPurchases: integer("total_purchases").notNull().default(0),
  totalMoneySpent: integer("total_money_spent").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})
