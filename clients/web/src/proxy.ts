import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import storage from "@/lib/core/storage";

const AUTH_COOKIE = storage.authentication.token;

export function proxy(request: NextRequest) {
  if (!request.cookies.has(AUTH_COOKIE)) {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/overview",
    "/profile",
    "/settings",
    "/notifications",
    "/messages/:path*",
    "/analytics",
    "/bookings/:path*",
    "/campaigns/:path*",
    "/discover/:path*",
    "/spending",
    "/listings/:path*",
    "/earnings",
    "/calendar",
    "/spaces/:path*",
  ],
};
