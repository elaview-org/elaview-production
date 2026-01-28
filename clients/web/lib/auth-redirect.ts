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

// todo:
async function authRedirect({
  on,
  authenticated,
  unauthenticated,
}: {
  on: "authenticated" | "unauthenticated";
  authenticated?: () => Promise<boolean>;
  unauthenticated?: () => Promise<boolean>;
}) {
  if (on === "authenticated") {
    const check =
      authenticated ??
      (async () =>
        !!(await (await import("next/headers")).cookies()).get(
          storageKey.authentication.token
        ));
  }
}
