import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Temporarily disable middleware to allow setup
  // Will be re-enabled once Supabase is properly configured

  console.log("Middleware: Allowing access to", req.nextUrl.pathname)
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
