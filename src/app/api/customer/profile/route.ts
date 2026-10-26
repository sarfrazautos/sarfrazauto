import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { customerPortalProfiles } from "@/db/schema/customer-portal"
import { eq, desc } from "drizzle-orm"

export async function GET() {
  try {
    const [profile] = await db
      .select()
      .from(customerPortalProfiles)
      .limit(1)

    if (profile) {
      return NextResponse.json({ success: true, profile })
    }

    const [created] = await db
      .insert(customerPortalProfiles)
      .values({
        businessName: "Tariq Auto Traders",
        contactPerson: "Muhammad Tariq",
        email: "dealer@sarfrazautos.com",
        phone: "+92 300 1234567",
        shopAddress: "Shop #14, Bilal Auto Market, Montgomery Road, Lahore",
        preferredCity: "Lahore",
      })
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
    const body = await req.json()
    const [existing] = await db
      .select()
      .from(customerPortalProfiles)
      .limit(1)

    const values = {
      businessName: body.businessName?.trim() || "Tariq Auto Traders",
      contactPerson: body.contactPerson?.trim() || "Muhammad Tariq",
      email: existing ? existing.email : (body.email?.trim() || "dealer@sarfrazautos.com"),
      phone: existing ? existing.phone : (body.phone?.trim() || "+92 300 1234567"),
      shopAddress: body.shopAddress?.trim() || "",
      preferredCity: body.preferredCity?.trim() || "Lahore",
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
