import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { dealerRequests } from "@/db/schema/dealer-requests"
import { user } from "@/db/schema/auth"
import { customerPortalProfiles } from "@/db/schema/customer-portal"
import { eq, or } from "drizzle-orm"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const numId = parseInt(id, 10)

    const condition = !isNaN(numId)
      ? or(eq(dealerRequests.id, numId), eq(dealerRequests.requestId, id))
      : eq(dealerRequests.requestId, id)

    const [item] = await db.select().from(dealerRequests).where(condition)

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Dealer request not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, request: item })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch dealer request" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const numId = parseInt(id, 10)

    const condition = !isNaN(numId)
      ? or(eq(dealerRequests.id, numId), eq(dealerRequests.requestId, id))
      : eq(dealerRequests.requestId, id)

    const body = await req.json()
    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    }

    if (body.status !== undefined) updateData.status = body.status
    if (body.shopName !== undefined) updateData.shopName = body.shopName
    if (body.ownerName !== undefined) updateData.ownerName = body.ownerName
    if (body.email !== undefined) updateData.email = body.email
    if (body.phone !== undefined) updateData.phone = body.phone
    if (body.city !== undefined) updateData.city = body.city
    if (body.address !== undefined) updateData.address = body.address
    if (body.cnic !== undefined) updateData.cnic = body.cnic
    if (body.ntn !== undefined) updateData.ntn = body.ntn
    if (body.notes !== undefined) updateData.notes = body.notes

    const [updated] = await db
      .update(dealerRequests)
      .set(updateData)
      .where(condition)
      .returning()

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Dealer request not found" },
        { status: 404 }
      )
    }

    if (body.status) {
      const lowerStatus = body.status.toLowerCase()
      const cleanEmail = updated.email.trim().toLowerCase()

      if (lowerStatus === "approved") {
        try {
          const [matchedUser] = await db
            .update(user)
            .set({
              role: "dealer",
              shopName: updated.shopName,
              phone: updated.phone,
              city: updated.city,
              deliveryAddress: updated.address || null,
              updatedAt: new Date(),
            })
            .where(eq(user.email, cleanEmail))
            .returning()

          const [matchedProfile] = await db
            .select()
            .from(customerPortalProfiles)
            .where(eq(customerPortalProfiles.email, cleanEmail))
            .limit(1)

          if (matchedProfile) {
            await db
              .update(customerPortalProfiles)
              .set({
                userId: matchedUser?.id || matchedProfile.userId,
                businessName: updated.shopName,
                contactPerson: updated.ownerName,
                phone: updated.phone,
                preferredCity: updated.city,
                shopAddress: updated.address || matchedProfile.shopAddress,
                updatedAt: new Date(),
              })
              .where(eq(customerPortalProfiles.id, matchedProfile.id))
          } else {
            await db.insert(customerPortalProfiles).values({
              userId: matchedUser?.id || null,
              businessName: updated.shopName,
              contactPerson: updated.ownerName,
              email: cleanEmail,
              phone: updated.phone,
              preferredCity: updated.city,
              shopAddress: updated.address || `${updated.city}, Pakistan`,
            })
          }
        } catch {}
      } else if (lowerStatus === "rejected") {
        try {
          await db
            .update(user)
            .set({ role: "rejected_dealer", updatedAt: new Date() })
            .where(eq(user.email, cleanEmail))
        } catch {}
      }
    }

    return NextResponse.json({ success: true, request: updated })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update dealer request" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  return PUT(req, props)
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const numId = parseInt(id, 10)

    const condition = !isNaN(numId)
      ? or(eq(dealerRequests.id, numId), eq(dealerRequests.requestId, id))
      : eq(dealerRequests.requestId, id)

    const [deleted] = await db.delete(dealerRequests).where(condition).returning()

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Dealer request not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, request: deleted })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete dealer request" },
      { status: 500 }
    )
  }
}
