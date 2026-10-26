import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("better-auth.session_token")
    cookieStore.delete("__Secure-better-auth.session_token")

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to log out" },
      { status: 500 }
    )
  }
}
