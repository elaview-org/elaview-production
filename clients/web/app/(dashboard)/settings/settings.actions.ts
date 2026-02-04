"use server";

import api from "@/lib/gql/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { logout } from "@/lib/auth.actions";
import {
  graphql,
  PayoutSchedule,
  type UpdateCurrentUserInput,
  type UpdateSpaceOwnerProfileInput,
  type UpdateAdvertiserProfileInput,
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

interface UpdateSpaceOwnerBusinessState {
  success: boolean;
  message: string;
  data: {
    businessName: string;
    businessType: string;
    payoutSchedule: PayoutSchedule;
  };
}

interface UpdateAdvertiserBusinessState {
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
      query GetCurrentUserForSettings {
        me {
          id
          avatar
          spaceOwnerProfile {
            id
          }
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
      return logout();
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
        mutation UpdateUserProfile($input: UpdateCurrentUserInput!) {
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

    revalidateTag("dashboard-user", { expire: 0 });
    revalidatePath("/settings");
    return {
      success: true,
      message: "Profile updated successfully",
      data: { name, email, phone },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
      data: { name, email, phone },
    };
  }
}

export async function updateSpaceOwnerBusinessAction(
  _prevState: UpdateSpaceOwnerBusinessState,
  formData: FormData
): Promise<UpdateSpaceOwnerBusinessState> {
  const businessName = formData.get("businessName")?.toString() ?? "";
  const businessType = formData.get("businessType")?.toString() ?? "";
  const payoutSchedule =
    (formData.get("payoutSchedule")?.toString() as PayoutSchedule) ??
    PayoutSchedule.Weekly;

  try {
    const user = await getCurrentUser();

    if (!user) {
      return logout();
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

    revalidateTag("dashboard-user", { expire: 0 });
    revalidatePath("/settings");
    return {
      success: true,
      message: "Business information updated successfully",
      data: { businessName, businessType, payoutSchedule },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
      data: { businessName, businessType, payoutSchedule },
    };
  }
}

export async function updateAdvertiserBusinessAction(
  _prevState: UpdateAdvertiserBusinessState,
  formData: FormData
): Promise<UpdateAdvertiserBusinessState> {
  const companyName = formData.get("companyName")?.toString() ?? "";
  const industry = formData.get("industry")?.toString() ?? "";
  const website = formData.get("website")?.toString() ?? "";

  try {
    const user = await getCurrentUser();

    if (!user) {
      return logout();
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

    revalidateTag("dashboard-user", { expire: 0 });
    revalidatePath("/settings");
    return {
      success: true,
      message: "Business information updated successfully",
      data: { companyName, industry, website },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
      data: { companyName, industry, website },
    };
  }
}
