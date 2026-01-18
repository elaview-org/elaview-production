"use server";

import { ActionState } from "@/actions/types";

import assert from "node:assert";
import { redirect } from "next/navigation";
import setCookieParser, { Cookie } from "set-cookie-parser";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export type SignupState = ActionState<{
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}>;

export default async function signup(
  _prevState: SignupState,
  formData: FormData
) {
  assert(formData.has("name"));
  assert(formData.has("email"));
  assert(formData.has("password"));
  assert(formData.has("confirmPassword"));

  const { name, email, password, confirmPassword } =
    Object.fromEntries(formData);

  if (password !== confirmPassword) {
    return {
      success: false,
      message: "Passwords do not match",
      data: { name, email, password, confirmPassword },
    } as SignupState;
  }

  try {
    const res = await fetch(`${process.env.ELAVIEW_WEB_NEXT_PUBLIC_API_URL!}/auth/signup`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      return {
        success: false,
        message: "Registration failed",
        data: { name, email, password, confirmPassword },
      } as SignupState;
    }

    assert(!!process.env.ELAVIEW_WEB_AUTH_COOKIE_NAME);
    const authCookie: Cookie = setCookieParser
      .parse(res.headers.getSetCookie())
      .find((cookie) => cookie.name === process.env.ELAVIEW_WEB_AUTH_COOKIE_NAME)!;
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
      data: { name, email, password, confirmPassword },
    } as SignupState;
  }

  revalidatePath("/signup");
  redirect("/overview");
}
