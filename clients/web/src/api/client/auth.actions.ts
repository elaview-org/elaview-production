"use server";

import { ActionState } from "@/types/actions";
import env from "@/lib/core/env";
import storage from "@/lib/core/storage";
import assert from "node:assert";
import { redirect } from "next/navigation";
import setCookieParser, { Cookie } from "set-cookie-parser";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { graphql, type ProfileType } from "@/types/gql";
import api from "@/api/server";

type LoginState = ActionState<{ email: string; password: string }>;

export async function login(_prevState: LoginState, formData: FormData) {
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
      .find((cookie) => cookie.name === storage.authentication.token)!;
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

export async function logout(): Promise<never> {
  try {
    await fetch(`${env.client.apiUrl}/auth/logout`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
  } catch {}

  (await cookies()).delete(storage.authentication.token);
  redirect("/login");
}

export async function switchProfile(targetProfileType: ProfileType) {
  const result = await api.mutate({
    mutation: graphql(`
      mutation SwitchProfile($input: UpdateCurrentUserInput!) {
        updateCurrentUser(input: $input) {
          user {
            id
            activeProfileType
          }
          errors {
            ... on Error {
              message
            }
          }
        }
      }
    `),
    variables: {
      input: {
        input: {
          activeProfileType: targetProfileType,
        },
      },
    },
  });

  if (result.error || result.data?.updateCurrentUser.errors?.length) {
    return {
      success: false,
      message: result.error?.message || "Failed to switch profile",
    };
  }

  revalidatePath("/", "layout");
  redirect("/overview");
}

type SignupState = ActionState<{
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}>;

export async function signup(_prevState: SignupState, formData: FormData) {
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
    const res = await fetch(`${env.client.apiUrl}/auth/signup`, {
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

    const authCookie: Cookie = setCookieParser
      .parse(res.headers.getSetCookie())
      .find((cookie) => cookie.name === storage.authentication.token)!;
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
