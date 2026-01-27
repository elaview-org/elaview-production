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

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
