"use server";

import api from "@/api/gql/server";
import { Mutation, ProfileType } from "@/types/graphql.generated";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const SWITCH_PROFILE_MUTATION = api.gql`
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
`;

export async function switchProfile(targetProfileType: ProfileType) {
  const { data, error } = await api.mutate<Mutation>({
    mutation: SWITCH_PROFILE_MUTATION,
    variables: {
      input: {
        input: {
          activeProfileType: targetProfileType,
        },
      },
    },
  });

  if (error || data?.updateCurrentUser.errors?.length) {
    return {
      success: false,
      message: error?.message || "Failed to switch profile",
    };
  }

  revalidatePath("/", "layout");
  redirect("/overview");
}