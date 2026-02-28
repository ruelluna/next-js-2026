import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const AUTH_MODE = process.env.NEXT_PUBLIC_AUTH_MODE === "token" ? "token" : "cookie";
const PUBLIC_PATHS = ["/login", "/register", "/"];
const PROTECTED_PATHS = ["/dashboard"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

function isProtectedPath(pathname: string): boolean {
  if (PROTECTED_PATHS.length === 0) return false;
  return PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

async function isAuthenticated(cookieHeader: string | null): Promise<boolean> {
  if (!cookieHeader) return false;
  try {
    const res = await fetch(`${API_URL}/api/v1/user`, {
      headers: {
        Accept: "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieHeader = request.headers.get("cookie");

  if (AUTH_MODE === "token") {
    return NextResponse.next();
  }

  if (isPublicPath(pathname)) {
    if (pathname === "/login" || pathname === "/register") {
      const authenticated = await isAuthenticated(cookieHeader);
      if (authenticated) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
    return NextResponse.next();
  }

  if (isProtectedPath(pathname)) {
    const authenticated = await isAuthenticated(cookieHeader);
    if (!authenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
