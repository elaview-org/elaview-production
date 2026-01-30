"use server";

import { revalidatePath } from "next/cache";
import api from "@/lib/gql/server";
import env from "@/lib/env";
import storage from "@/lib/storage";
import { graphql, type ProfileType } from "@/types/gql";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout(): Promise<never> {
  "use server";

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
  "use server";

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
