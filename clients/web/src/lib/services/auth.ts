import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import storage from "@/lib/core/storage";

export async function redirectIfAuthenticated(url: string) {
  if ((await cookies()).get(storage.authentication.token)) {
    redirect(url);
  }
}

export async function authenticatedRedirect() {
  await redirectIfAuthenticated("/overview");
}
