import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { dealerRequests } from "@/db/schema/dealer-requests"
import { customerPortalProfiles } from "@/db/schema/customer-portal"
import { user } from "@/db/schema/auth"
import { auth } from "@/lib/auth"
import { eq, desc } from "drizzle-orm"

export async function GET(req: Request) {
  try {
    let session = null
    try {
      session = await auth.api.getSession({ headers: req.headers })
    } catch {}

    if (!session || !session.user) {
      return NextResponse.json({
        success: true,
        isAuthenticated: false,
        isApproved: false,
        status: "unauthenticated",
        discountPercentage: 0,
      })
    }

    const email = session.user.email.trim().toLowerCase()
    const isAdmin = email === "admin@sarfrazautos.com" || (session.user as any).role === "admin"

    const [profile] = await db
      .select({ discountPercentage: customerPortalProfiles.discountPercentage })
      .from(customerPortalProfiles)
      .where(eq(customerPortalProfiles.email, email))
      .limit(1)

    const [latestReq] = await db
      .select()
      .from(dealerRequests)
      .where(eq(dealerRequests.email, email))
      .orderBy(desc(dealerRequests.createdAt))
      .limit(1)

    const discountPercentage = Number(profile?.discountPercentage ?? latestReq?.discountPercentage ?? 0)

    if (isAdmin) {
      return NextResponse.json({
        success: true,
        isAuthenticated: true,
        isApproved: true,
        status: "Approved",
        role: "admin",
        shopName: "Sarfraz Autos Admin",
        ownerName: session.user.name,
        discountPercentage,
      })
    }

    const [dbUser] = await db
      .select({ role: user.role, shopName: user.shopName })
      .from(user)
      .where(eq(user.email, email))
      .limit(1)

    if (dbUser?.role === "dealer") {
      return NextResponse.json({
        success: true,
        isAuthenticated: true,
        isApproved: true,
        status: "Approved",
        role: "dealer",
        shopName: dbUser.shopName || session.user.name,
        discountPercentage,
      })
    }

    if (latestReq) {
      const isApproved = latestReq.status.toLowerCase() === "approved"
      return NextResponse.json({
        success: true,
        isAuthenticated: true,
        isApproved,
        status: latestReq.status,
        shopName: latestReq.shopName,
        ownerName: latestReq.ownerName,
        submittedAt: latestReq.submittedAt,
        discountPercentage,
      })
    }

    return NextResponse.json({
      success: true,
      isAuthenticated: true,
      isApproved: false,
      status: "None",
      shopName: dbUser?.shopName || null,
      discountPercentage: 0,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch dealer status" },
      { status: 500 }
    )
  }
}
