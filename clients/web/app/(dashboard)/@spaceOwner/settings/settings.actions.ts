"use server";

import api from "@/lib/gql/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  graphql,
  PayoutSchedule,
  type UpdateCurrentUserInput,
  type UpdateSpaceOwnerProfileInput,
} from "@/types/gql";

interface UpdateProfileState {
  success: boolean;
  message: string;
  data: {
    name: string;
    email: string;
    phone: string;
  };
}

interface UpdateBusinessInfoState {
  success: boolean;
  message: string;
  data: {
    businessName: string;
    businessType: string;
    payoutSchedule: PayoutSchedule;
  };
}

async function getCurrentUser() {
  const { data } = await api.query({
    query: graphql(`
      query GetSpaceOwnerForSettings {
        me {
          id
          avatar
          spaceOwnerProfile {
            id
          }
        }
      }
    `),
  });

  return data?.me ?? null;
}

export async function updateProfileAction(
  _prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const name = formData.get("name")?.toString() ?? "";
  const email = formData.get("email")?.toString() ?? "";
  const phone = formData.get("phone")?.toString() ?? "";

  try {
    const user = await getCurrentUser();

    if (!user) {
      redirect("/logout");
    }

    if (!name.trim()) {
      return {
        success: false,
        message: "Name is required",
        data: { name, email, phone },
      };
    }

    const { data: mutationData } = await api.mutate({
      mutation: graphql(`
        mutation UpdateSpaceOwnerProfile($input: UpdateCurrentUserInput!) {
          updateCurrentUser(input: $input) {
            user {
              id
            }
          }
        }
      `),
      variables: {
        input: {
          input: {
            name,
            phone: phone || null,
            avatar: user.avatar || null,
          },
        } satisfies UpdateCurrentUserInput,
      },
    });

    if (!mutationData?.updateCurrentUser?.user) {
      return {
        success: false,
        message: "Failed to update profile",
        data: { name, email, phone },
      };
    }

    revalidatePath("/settings");
    return {
      success: true,
      message: "Profile updated successfully",
      data: { name, email, phone },
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
      data: { name, email, phone },
    };
  }
}

export async function updateBusinessInfoAction(
  _prevState: UpdateBusinessInfoState,
  formData: FormData
): Promise<UpdateBusinessInfoState> {
  const businessName = formData.get("businessName")?.toString() ?? "";
  const businessType = formData.get("businessType")?.toString() ?? "";
  const payoutSchedule =
    (formData.get("payoutSchedule")?.toString() as PayoutSchedule) ??
    PayoutSchedule.Weekly;

  try {
    const user = await getCurrentUser();

    if (!user) {
      redirect("/logout");
    }

    if (!user.spaceOwnerProfile) {
      return {
        success: false,
        message: "Space owner profile not found",
        data: { businessName, businessType, payoutSchedule },
      };
    }

    const { data: mutationData } = await api.mutate({
      mutation: graphql(`
        mutation UpdateSpaceOwnerBusinessInfo(
          $input: UpdateSpaceOwnerProfileInput!
        ) {
          updateSpaceOwnerProfile(input: $input) {
            spaceOwnerProfile {
              id
            }
          }
        }
      `),
      variables: {
        input: {
          businessName: businessName || null,
          businessType: businessType || null,
          payoutSchedule,
        } satisfies UpdateSpaceOwnerProfileInput,
      },
    });

    if (!mutationData?.updateSpaceOwnerProfile?.spaceOwnerProfile) {
      return {
        success: false,
        message: "Failed to update business information",
        data: { businessName, businessType, payoutSchedule },
      };
    }

    revalidatePath("/settings");
    return {
      success: true,
      message: "Business information updated successfully",
      data: { businessName, businessType, payoutSchedule },
    };
  } catch (error) {
    console.error("Error updating business info:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
      data: { businessName, businessType, payoutSchedule },
    };
  }
}
