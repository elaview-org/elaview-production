import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import assert from "node:assert";

export async function GET() {
  assert(!!process.env.AUTH_COOKIE_NAME);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/auth/logout`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  assert(res.ok); // may fail if user fakes a cookie
  (await cookies()).delete(process.env.AUTH_COOKIE_NAME!);
  redirect("/login");
}
