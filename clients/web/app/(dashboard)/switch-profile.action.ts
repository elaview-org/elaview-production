"use server";

import api from "@/api/gql/server";
import { graphql, type ProfileType } from "@/types/gql";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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