"use server";

import {ActionState} from "@/shared/actions/types";

import assert from "node:assert";
import {redirect} from "next/navigation";
import setCookieParser, {Cookie} from "set-cookie-parser";
import {cookies} from "next/headers";
import {revalidatePath} from "next/cache";

export type LoginState = ActionState<{ email: string, password: string }>;

export default async function login(state: LoginState, formData: FormData) {
    assert(formData.has("email") && formData.has("password"));
    const {email, password} = Object.fromEntries(formData);
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/auth/login`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({email, password}),
            credentials: "include",
        });

        if (!res.ok) {
            return {
                ...state,
                success: false,
                message: (await res.json()).error.message,
            };
        }

        const authCookie: Cookie = setCookieParser.parse(res.headers.getSetCookie())
            .find(cookie => cookie.name === "ElaviewAuth")!;
        (await cookies()).set({
            name: authCookie.name,
            value: authCookie.value,
            httpOnly: authCookie.httpOnly,
            path: authCookie.path,
            secure: authCookie.secure,
            expires: authCookie.expires,
            maxAge: authCookie.maxAge,
            domain: authCookie.domain,
            sameSite: authCookie.sameSite as (boolean | "lax" | "strict" | "none" | undefined),
        });
    } catch (error) {
        assert(
            typeof error === "object" &&
            error !== null &&
            "message" in error &&
            typeof error.message === "string"
        );
        return {
            ...state,
            success: false,
            message: error?.message ?? "Internal server error",
        };
    }

    revalidatePath("/login");
    redirect("/overview");
}