import storageKey from "@/lib/storage-keys";
import { redirect } from "next/navigation";

export async function redirectIfAuthenticated(url: string) {
  const { cookies } = await import("next/headers");
  if ((await cookies()).get(storageKey.authentication.token)) {
    // delegate cookie-verification responsibility to {url}
    redirect(url);
  }
}

export async function authenticatedRedirect() {
  await redirectIfAuthenticated("/overview");
}
