import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core"

export const wholesaleStatuses = pgTable("wholesale_statuses", {
  id: serial("id").primaryKey(),
  type: text("type").notNull().default("text"),
  title: text("title").notNull(),
  content: text("content"),
  imageUrl: text("image_url"),
  startTime: timestamp("start_time").notNull().defaultNow(),
  endTime: timestamp("end_time").notNull(),
  status: text("status").notNull().default("Active"),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

