import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const method = request.method.toUpperCase()

  const sessionToken =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token")

  const isAuthenticated = Boolean(sessionToken?.value)

  const isPublicApiPost =
    (pathname === "/api/orders" && method === "POST") ||
    (pathname === "/api/payments" && method === "POST") ||
    (pathname === "/api/messages" && method === "POST") ||
    (pathname === "/api/dealer-requests" && method === "POST")

  const isCustomerApi =
    pathname.startsWith("/api/customer") && pathname !== "/api/customer/logout"
  const isAdminApi =
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/api/aging-reports") ||
    pathname.startsWith("/api/returns") ||
    (pathname.startsWith("/api/orders") && !isPublicApiPost) ||
    (pathname.startsWith("/api/payments") && !isPublicApiPost) ||
    (pathname.startsWith("/api/dealer-requests") && !isPublicApiPost) ||
    (pathname.startsWith("/api/messages") && !isPublicApiPost)

  if (isCustomerApi || isAdminApi) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Access token missing" },
        { status: 401 }
      )
    }

    try {
      const session = await auth.api.getSession({ headers: request.headers })
      if (!session || !session.user) {
        return NextResponse.json(
          { success: false, error: "Unauthorized: Invalid session" },
          { status: 401 }
        )
      }

      if (isAdminApi) {
        const role = (session.user as any).role || "customer"
        const isAdmin = session.user.email === "admin@sarfrazautos.com" || role === "admin"
        if (!isAdmin) {
          return NextResponse.json(
            { success: false, error: "Forbidden: Administrative access required" },
            { status: 403 }
          )
        }
      }
    } catch {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Session verification failed" },
        { status: 401 }
      )
    }
  }

  const isAdminLoginPage = pathname === "/admin/login"
  const isCustomerLoginPage = pathname === "/login"
  const isCustomerPortal = pathname === "/customer-portal" || pathname.startsWith("/customer-portal/")
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/")

  if (isAdminRoute) {
    if (!isAuthenticated && !isAdminLoginPage) {
      const loginUrl = new URL("/admin/login", request.url)
      return NextResponse.redirect(loginUrl)
    }

    if (isAuthenticated) {
      try {
        const session = await auth.api.getSession({ headers: request.headers })
        const role = (session?.user as any)?.role || "customer"
        const isAdmin = session?.user?.email === "admin@sarfrazautos.com" || role === "admin"

        if (!isAdmin && !isAdminLoginPage) {
          const loginUrl = new URL("/admin/login?error=unauthorized", request.url)
          return NextResponse.redirect(loginUrl)
        }

        if (isAdmin && (isAdminLoginPage || pathname === "/admin")) {
          const dashboardUrl = new URL("/admin/dashboard", request.url)
          return NextResponse.redirect(dashboardUrl)
        }
      } catch {
        if (!isAdminLoginPage) {
          const loginUrl = new URL("/admin/login", request.url)
          return NextResponse.redirect(loginUrl)
        }
      }
    }
  }

  if (isCustomerPortal && !isAuthenticated) {
    const loginUrl = new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url)
    return NextResponse.redirect(loginUrl)
  }

  if (isCustomerLoginPage && isAuthenticated) {
    const redirectParam = request.nextUrl.searchParams.get("redirect") || "/customer-portal"
    const targetUrl = new URL(redirectParam, request.url)
    return NextResponse.redirect(targetUrl)
  }

  const response = NextResponse.next()
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  return response
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/customer-portal",
    "/customer-portal/:path*",
    "/login",
    "/api/admin/:path*",
    "/api/customer/:path*",
    "/api/orders/:path*",
    "/api/payments/:path*",
    "/api/dealer-requests/:path*",
    "/api/aging-reports/:path*",
    "/api/returns/:path*",
    "/api/messages/:path*",
  ],
}

export default proxy
