import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const dealerRequests = pgTable("dealer_requests", {
  id: serial("id").primaryKey(),
  requestId: text("request_id").notNull(),
  shopName: text("shop_name").notNull(),
  ownerName: text("owner_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  city: text("city").notNull(),
  address: text("address"),
  cnic: text("cnic"),
  ntn: text("ntn"),
  status: text("status").notNull().default("Pending"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})
