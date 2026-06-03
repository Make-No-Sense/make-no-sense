import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login page itself must never be protected — would cause redirect loop
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const session = request.cookies.get("admin_session")?.value;

  if (session !== "authenticated") {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
