import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { customerPortalProfiles } from "@/db/schema/customer-portal"
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

    if (!userId && !email) {
      return NextResponse.json({
        success: true,
        profile: {
          businessName: "",
          contactPerson: "",
          email: "",
          phone: "",
          shopAddress: "",
          preferredCity: "",
          creditLimit: 0,
          discountPercentage: 0,
          totalPurchases: 0,
          totalMoneySpent: 0,
        },
      })
    }

    const conditions = []
    if (userId) conditions.push(eq(customerPortalProfiles.userId, userId))
    if (email) conditions.push(eq(customerPortalProfiles.email, email))

    const [profile] = await db
      .select()
      .from(customerPortalProfiles)
      .where(conditions.length > 1 ? or(...conditions) : conditions[0])
      .limit(1)

    if (profile) {
      return NextResponse.json({ success: true, profile })
    }

    const defaultValues = {
      userId: userId || null,
      businessName: (session?.user as any)?.shopName || session?.user?.name || "",
      contactPerson: session?.user?.name || "",
      email: email || "",
      phone: (session?.user as any)?.phone || "",
      shopAddress: (session?.user as any)?.deliveryAddress || "",
      preferredCity: (session?.user as any)?.city || "",
      creditLimit: 0,
      discountPercentage: 0,
      totalPurchases: 0,
      totalMoneySpent: 0,
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

    if (!userId && !email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Please log in to update your profile" },
        { status: 401 }
      )
    }

    const conditions = []
    if (userId) conditions.push(eq(customerPortalProfiles.userId, userId))
    if (email) conditions.push(eq(customerPortalProfiles.email, email))

    const [existing] = await db
      .select()
      .from(customerPortalProfiles)
      .where(conditions.length > 1 ? or(...conditions) : conditions[0])
      .limit(1)

    const body = await req.json()
    const values = {
      userId: userId || existing?.userId || null,
      businessName: body.businessName?.trim() || existing?.businessName || (session?.user as any)?.shopName || session?.user?.name || "",
      contactPerson: body.contactPerson?.trim() || existing?.contactPerson || session?.user?.name || "",
      email: email || existing?.email || body.email?.trim() || "",
      phone: body.phone?.trim() || existing?.phone || (session?.user as any)?.phone || "",
      shopAddress: body.shopAddress?.trim() || existing?.shopAddress || "",
      preferredCity: body.preferredCity?.trim() || existing?.preferredCity || "",
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
      .values({
        ...values,
        creditLimit: 0,
        discountPercentage: 0,
        totalPurchases: 0,
        totalMoneySpent: 0,
      })
      .returning()

    return NextResponse.json({ success: true, profile: created })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update profile" },
      { status: 500 }
    )
  }
}
