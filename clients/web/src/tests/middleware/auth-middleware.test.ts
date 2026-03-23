/**
 * Tests for the Next.js middleware that protects routes.
 * Validates that unauthenticated users are rewritten to /not-found
 * and authenticated users pass through.
 */

import { describe, expect, it, mock } from "bun:test";
import type { NextRequest } from "next/server";

// The auth cookie name
const AUTH_COOKIE_NAME = "elaview.authentication.token";

// Mock storage module
mock.module("@/lib/core/storage", () => ({
  default: {
    authentication: {
      token: AUTH_COOKIE_NAME,
    },
  },
}));

// Create helpers to simulate NextRequest / NextResponse
function createMockRequest(
  url: string,
  cookies: Record<string, string> = {}
): NextRequest {
  const cookieStore = new Map(Object.entries(cookies));
  return {
    url,
    cookies: {
      has: (name: string) => cookieStore.has(name),
      get: (name: string) => {
        const val = cookieStore.get(name);
        return val ? { name, value: val } : undefined;
      },
    },
  } as unknown as NextRequest;
}

// Import after mocking
const { middleware } = await import("@/middleware");

// Mock NextResponse
mock.module("next/server", () => ({
  NextResponse: {
    next: () => ({ type: "next" }),
    rewrite: (url: URL) => ({ type: "rewrite", url: url.toString() }),
  },
}));

describe("middleware", () => {
  it("rewrites to /not-found when auth cookie is missing", () => {
    const request = createMockRequest("http://localhost:3000/overview");
    const result = middleware(request) as unknown as Record<string, string>;

    expect(result).toBeDefined();
    expect(result.type).toBe("rewrite");
    expect(result.url).toContain("/not-found");
  });

  it("allows request through when auth cookie exists", () => {
    const request = createMockRequest("http://localhost:3000/overview", {
      [AUTH_COOKIE_NAME]: "some-jwt-token",
    });
    const result = middleware(request) as unknown as Record<string, string>;

    expect(result).toBeDefined();
    expect(result.type).toBe("next");
  });

  it("blocks /bookings/* without auth cookie", () => {
    const request = createMockRequest(
      "http://localhost:3000/bookings/123"
    );
    const result = middleware(request) as unknown as Record<string, string>;

    expect(result.type).toBe("rewrite");
  });

  it("blocks /settings without auth cookie", () => {
    const request = createMockRequest("http://localhost:3000/settings");
    const result = middleware(request) as unknown as Record<string, string>;

    expect(result.type).toBe("rewrite");
  });
});
