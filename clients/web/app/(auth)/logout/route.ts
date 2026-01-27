import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import env from "@/lib/env";
import storageKey from "@/lib/storage-keys";

export async function GET() {
  const res = await fetch(`${env.client.apiUrl}/auth/logout`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  if (!res.ok) throw new Error("Logout failed");
  (await cookies()).delete(storageKey.authentication.token);
  redirect("/login");
}
