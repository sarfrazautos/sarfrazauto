import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function requireAdminSession() {
  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })

  if (!session || !session.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "Unauthorized: Authentication required" },
        { status: 401 }
      ),
    }
  }

  const role = (session.user as any).role || "customer"
  const isAdmin = session.user.email === "admin@sarfrazautos.com" || role === "admin"
  if (!isAdmin) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "Forbidden: Administrative privileges required" },
        { status: 403 }
      ),
    }
  }

  return { authorized: true, user: session.user, session: session.session }
}

export async function requireCustomerSession() {
  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })

  if (!session || !session.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "Unauthorized: Authentication required" },
        { status: 401 }
      ),
    }
  }

  return { authorized: true, user: session.user, session: session.session }
}
