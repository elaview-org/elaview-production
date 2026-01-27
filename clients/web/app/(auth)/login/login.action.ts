"use server";

import { ActionState } from "@/types/actions";
import env from "@/lib/env";
import storageKey from "@/lib/storage-keys";

import assert from "node:assert";
import { redirect } from "next/navigation";
import setCookieParser, { Cookie } from "set-cookie-parser";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export type LoginState = ActionState<{ email: string; password: string }>;

export default async function login(
  _prevState: LoginState,
  formData: FormData
) {
  assert(formData.has("email"));
  assert(formData.has("password"));
  const { email, password } = Object.fromEntries(formData);
  try {
    const res = await fetch(`${env.client.apiUrl}/auth/login`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      return {
        success: false,
        message: "Authentication failed",
        data: { email, password },
      } as LoginState;
    }

    const authCookie: Cookie = setCookieParser
      .parse(res.headers.getSetCookie())
      .find((cookie) => cookie.name === storageKey.authentication.token)!;
    (await cookies()).set({
      name: authCookie.name,
      value: authCookie.value,
      httpOnly: authCookie.httpOnly,
      path: authCookie.path,
      secure: authCookie.secure,
      expires: authCookie.expires,
      maxAge: authCookie.maxAge,
      domain: authCookie.domain,
      sameSite: authCookie.sameSite as
        | boolean
        | "lax"
        | "strict"
        | "none"
        | undefined,
    });
  } catch (error) {
    assert(
      typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
    );
    return {
      success: false,
      message: error?.message ?? "Internal server error",
      data: { email, password },
    } as LoginState;
  }

  revalidatePath("/login");
  redirect("/overview");
}
