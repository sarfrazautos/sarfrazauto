import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { customerPortalProfiles } from "@/db/schema/customer-portal"
import { user } from "@/db/schema/auth"
import { auth } from "@/lib/auth"
import { eq, or } from "drizzle-orm"

export async function GET(req: Request) {
  try {
    let session = null
    try {
      session = await auth.api.getSession({ headers: req.headers })
    } catch {}

    const email = session?.user?.email?.trim().toLowerCase()
    const userId = session?.user?.id

    let profile = null

    if (userId || email) {
      const conditions = []
      if (userId) conditions.push(eq(customerPortalProfiles.userId, userId))
      if (email) conditions.push(eq(customerPortalProfiles.email, email))

      const [found] = await db
        .select()
        .from(customerPortalProfiles)
        .where(conditions.length > 1 ? or(...conditions) : conditions[0])
        .limit(1)

      profile = found
    }

    if (!profile) {
      const [first] = await db.select().from(customerPortalProfiles).limit(1)
      profile = first
    }

    if (profile) {
      return NextResponse.json({ success: true, profile })
    }

    const defaultValues = {
      userId: userId || null,
      businessName: (session?.user as any)?.shopName || session?.user?.name || "Tariq Auto Traders",
      contactPerson: session?.user?.name || "Muhammad Tariq",
      email: email || "dealer@sarfrazautos.com",
      phone: (session?.user as any)?.phone || "+92 300 1234567",
      shopAddress: (session?.user as any)?.deliveryAddress || "Shop #14, Bilal Auto Market, Montgomery Road, Lahore",
      preferredCity: (session?.user as any)?.city || "Lahore",
    }

    const [created] = await db
      .insert(customerPortalProfiles)
      .values(defaultValues)
      .returning()

    return NextResponse.json({ success: true, profile: created })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    let session = null
    try {
      session = await auth.api.getSession({ headers: req.headers })
    } catch {}

    const email = session?.user?.email?.trim().toLowerCase()
    const userId = session?.user?.id

    let existing = null
    if (userId || email) {
      const conditions = []
      if (userId) conditions.push(eq(customerPortalProfiles.userId, userId))
      if (email) conditions.push(eq(customerPortalProfiles.email, email))

      const [found] = await db
        .select()
        .from(customerPortalProfiles)
        .where(conditions.length > 1 ? or(...conditions) : conditions[0])
        .limit(1)

      existing = found
    }

    if (!existing) {
      const [first] = await db.select().from(customerPortalProfiles).limit(1)
      existing = first
    }

    const body = await req.json()
    const values = {
      userId: userId || existing?.userId || null,
      businessName: body.businessName?.trim() || existing?.businessName || "Tariq Auto Traders",
      contactPerson: body.contactPerson?.trim() || existing?.contactPerson || "Muhammad Tariq",
      email: existing ? existing.email : (email || body.email?.trim() || "dealer@sarfrazautos.com"),
      phone: body.phone?.trim() || existing?.phone || "+92 300 1234567",
      shopAddress: body.shopAddress?.trim() || existing?.shopAddress || "",
      preferredCity: body.preferredCity?.trim() || existing?.preferredCity || "Lahore",
      updatedAt: new Date(),
    }

    if (existing) {
      const [updated] = await db
        .update(customerPortalProfiles)
        .set(values)
        .where(eq(customerPortalProfiles.id, existing.id))
        .returning()

      return NextResponse.json({ success: true, profile: updated })
    }

    const [created] = await db
      .insert(customerPortalProfiles)
      .values(values)
      .returning()

    return NextResponse.json({ success: true, profile: created })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update profile" },
      { status: 500 }
    )
  }
}
