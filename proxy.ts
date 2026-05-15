import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PROTECTED = ["/dashboard", "/transactions", "/categories", "/savings", "/settings"]
const AUTH_ROUTES = ["/auth/signin", "/auth/register"]

// Optimistic check: verifies JWT cookie presence without DB call (edge-compatible).
// Full auth validation happens in server components and actions via auth().
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const sessionCookie =
    request.cookies.get("authjs.session-token") ??
    request.cookies.get("__Secure-authjs.session-token")

  const isAuthenticated = Boolean(sessionCookie)
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p))
  const isAuthRoute = AUTH_ROUTES.some((p) => pathname.startsWith(p))

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
}
