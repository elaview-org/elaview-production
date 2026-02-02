import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import logger from "@/lib/logger";
import storage from "@/lib/storage";

const AUTH_COOKIE = storage.authentication.token;

const log = logger.child({ module: "proxy" });

export function proxy(request: NextRequest) {
  const start = performance.now();
  const { method } = request;
  const path = request.nextUrl.pathname;

  if (!request.cookies.has(AUTH_COOKIE)) {
    log.debug(
      { method, path, duration: `${Math.round(performance.now() - start)}ms` },
      "redirected (no auth)"
    );
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }

  log.debug(
    { method, path, duration: `${Math.round(performance.now() - start)}ms` },
    "passed"
  );
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
