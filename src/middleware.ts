import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public auth paths through
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow static files, API routes, and Next.js internals through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Check for access token in cookies
  const token = request.cookies.get("access_token")?.value;

  // Redirect unauthenticated users to login
  if (!token && pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If no token, allow non-dashboard paths through (e.g., landing page)
  if (!token) {
    return NextResponse.next();
  }

  // Validate token and check role-based access
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    const role = payload.role as string;
    const isExp = payload.exp * 1000 < Date.now();

    // Token expired - redirect to login
    if (isExp) {
      const loginUrl = new URL("/auth/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based routing - redirect students away from lecturer dashboard
    if (role === "student" && pathname.startsWith("/dashboard/lecturer")) {
      return NextResponse.redirect(new URL("/dashboard/student", request.url));
    }

    // Role-based routing - redirect lecturers away from student dashboard
    if (role === "lecturer" && pathname.startsWith("/dashboard/student")) {
      return NextResponse.redirect(new URL("/dashboard/lecturer", request.url));
    }
  } catch {
    // Invalid token - redirect to login
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};