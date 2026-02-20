"use server";

import { cookies } from "next/headers";
import type { CookieOptions } from "./index";

export async function setCookieValue(key: string, serialized: string, options: CookieOptions) {
  (await cookies()).set(key, serialized, options);
}

export async function removeCookieValue(key: string) {
  (await cookies()).delete(key);
}