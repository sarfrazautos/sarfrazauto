import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as productsSchema from "@/db/schema/products"
import * as ordersSchema from "@/db/schema/orders"
import * as messagesSchema from "@/db/schema/messages"
import * as authSchema from "@/db/schema/auth"
import * as schemesSchema from "@/db/schema/schemes"
import * as paymentsSchema from "@/db/schema/payments"
import * as dealerRequestsSchema from "@/db/schema/dealer-requests"
import * as returnsSchema from "@/db/schema/returns"
import * as agingReportsSchema from "@/db/schema/aging-reports"
import * as customerPortalSchema from "@/db/schema/customer-portal"
import * as invoicesSchema from "@/db/schema/invoices"

const schema = { ...productsSchema, ...ordersSchema, ...messagesSchema, ...authSchema, ...schemesSchema, ...paymentsSchema, ...dealerRequestsSchema, ...returnsSchema, ...agingReportsSchema, ...customerPortalSchema, ...invoicesSchema }

export const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })
export default db
