"use server";

import api from "@/api/gql/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  graphql,
  type UpdateAdvertiserProfileInput,
  type UpdateCurrentUserInput,
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
    companyName: string;
    industry: string;
    website: string;
  };
}

async function getCurrentUser() {
  const { data } = await api.query({
    query: graphql(`
      query GetAdvertiserForSettings {
        me {
          id
          avatar
          advertiserProfile {
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
        mutation UpdateAdvertiserUserProfile($input: UpdateCurrentUserInput!) {
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
  const companyName = formData.get("companyName")?.toString() ?? "";
  const industry = formData.get("industry")?.toString() ?? "";
  const website = formData.get("website")?.toString() ?? "";

  try {
    const user = await getCurrentUser();

    if (!user) {
      redirect("/logout");
    }

    if (!user.advertiserProfile) {
      return {
        success: false,
        message: "Advertiser profile not found",
        data: { companyName, industry, website },
      };
    }

    const { data: mutationData } = await api.mutate({
      mutation: graphql(`
        mutation UpdateAdvertiserBusinessInfo(
          $input: UpdateAdvertiserProfileInput!
        ) {
          updateAdvertiserProfile(input: $input) {
            advertiserProfile {
              id
            }
          }
        }
      `),
      variables: {
        input: {
          companyName: companyName || null,
          industry: industry || null,
          website: website || null,
        } satisfies UpdateAdvertiserProfileInput,
      },
    });

    if (!mutationData?.updateAdvertiserProfile?.advertiserProfile) {
      return {
        success: false,
        message: "Failed to update business information",
        data: { companyName, industry, website },
      };
    }

    revalidatePath("/settings");
    return {
      success: true,
      message: "Business information updated successfully",
      data: { companyName, industry, website },
    };
  } catch (error) {
    console.error("Error updating business info:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
      data: { companyName, industry, website },
    };
  }
}
