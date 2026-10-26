import { NextResponse } from "next/server"
import { db, sql } from "@/lib/db"
import { products } from "@/db/schema"

export async function GET() {
  try {
    const rawResult = await sql`SELECT NOW() as current_time, version() as version`
    const productCount = await db.select().from(products)

    return NextResponse.json({
      status: "connected",
      database: "Neon PostgreSQL",
      orm: "Drizzle ORM",
      neonHttp: rawResult[0],
      drizzleQuery: {
        table: "products",
        totalRecords: productCount.length,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    )
  }
}
