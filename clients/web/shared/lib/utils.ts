import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { redirect } from "next/navigation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function redirectIfAuthenticated(url: string) {
  const { cookies } = await import("next/headers");
  if ((await cookies()).get(process.env.AUTH_COOKIE_NAME!)) {
    // delegate cookie-verification responsibility to {url}
    redirect(url);
  }
}

export async function authenticatedRedirect() {
  await redirectIfAuthenticated("/overview");
}
