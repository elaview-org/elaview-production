"use server";

import api from "@/lib/gql/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { logout } from "@/lib/services/auth.actions";
import {
  graphql,
  type NotificationType,
  PayoutSchedule,
  type UpdateAdvertiserProfileInput,
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

export async function updateNotificationPreferenceAction(
  notificationType: NotificationType,
  channel: "inAppEnabled" | "emailEnabled" | "pushEnabled",
  enabled: boolean
): Promise<{ success: boolean; message: string }> {
  try {
    const { data: mutationData } = await api.mutate({
      mutation: graphql(`
        mutation UpdateNotificationPreference(
          $input: UpdateNotificationPreferenceInput!
        ) {
          updateNotificationPreference(input: $input) {
            preference {
              id
              notificationType
              inAppEnabled
              emailEnabled
              pushEnabled
            }
          }
        }
      `),
      variables: {
        input: {
          notificationType,
          [channel]: enabled,
        },
      },
    });

    if (!mutationData?.updateNotificationPreference?.preference) {
      return { success: false, message: "Failed to update preference" };
    }

    revalidatePath("/settings");
    return { success: true, message: "Preference updated" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function connectStripeAction(): Promise<{
  onboardingUrl: string | null;
  error: string | null;
}> {
  try {
    const { data: mutationData } = await api.mutate({
      mutation: graphql(`
        mutation ConnectStripeAccount {
          connectStripeAccount {
            accountId
            onboardingUrl
            errors {
              ... on Error {
                message
              }
            }
          }
        }
      `),
    });

    const result = mutationData?.connectStripeAccount;

    if (result?.errors?.length) {
      return { onboardingUrl: null, error: result.errors[0].message };
    }

    if (!result?.onboardingUrl) {
      return { onboardingUrl: null, error: "No onboarding URL returned" };
    }

    return { onboardingUrl: result.onboardingUrl, error: null };
  } catch (error) {
    return {
      onboardingUrl: null,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function disconnectStripeAction(): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const { data: mutationData } = await api.mutate({
      mutation: graphql(`
        mutation DisconnectStripeAccount {
          disconnectStripeAccount {
            profile {
              id
              stripeAccountId
              stripeAccountStatus
            }
            errors {
              ... on Error {
                message
              }
            }
          }
        }
      `),
    });

    const result = mutationData?.disconnectStripeAccount;

    if (result?.errors?.length) {
      return { success: false, error: result.errors[0].message };
    }

    revalidateTag("dashboard-user", { expire: 0 });
    revalidatePath("/settings");
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function refreshStripeStatusAction(): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const { data: mutationData } = await api.mutate({
      mutation: graphql(`
        mutation RefreshStripeAccountStatus {
          refreshStripeAccountStatus {
            profile {
              id
              stripeAccountStatus
            }
            errors {
              ... on Error {
                message
              }
            }
          }
        }
      `),
    });

    const result = mutationData?.refreshStripeAccountStatus;

    if (result?.errors?.length) {
      return { success: false, error: result.errors[0].message };
    }

    revalidateTag("dashboard-user", { expire: 0 });
    revalidatePath("/settings");
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function deleteAccountAction(password: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const { data: mutationData } = await api.mutate({
      mutation: graphql(`
        mutation DeleteMyAccount($input: DeleteMyAccountInput!) {
          deleteMyAccount(input: $input) {
            success
            errors {
              ... on Error {
                message
              }
            }
          }
        }
      `),
      variables: {
        input: { password },
      },
    });

    const result = mutationData?.deleteMyAccount;

    if (result?.errors?.length) {
      return { success: false, error: result.errors[0].message };
    }

    if (!result?.success) {
      return { success: false, error: "Failed to delete account" };
    }

    return logout();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function updateAvatarAction(
  avatarUrl: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return logout();
    }

    const { data: mutationData } = await api.mutate({
      mutation: graphql(`
        mutation UpdateUserAvatar($input: UpdateCurrentUserInput!) {
          updateCurrentUser(input: $input) {
            user {
              id
              avatar
            }
          }
        }
      `),
      variables: {
        input: {
          input: {
            avatar: avatarUrl,
          },
        } satisfies UpdateCurrentUserInput,
      },
    });

    if (!mutationData?.updateCurrentUser?.user) {
      return { success: false, error: "Failed to update avatar" };
    }

    revalidateTag("dashboard-user", { expire: 0 });
    revalidatePath("/settings");
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function changePasswordAction(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { data: mutationData } = await api.mutate({
      mutation: graphql(`
        mutation ChangePassword($input: ChangePasswordInput!) {
          changePassword(input: $input) {
            success
            errors {
              ... on Error {
                message
              }
            }
          }
        }
      `),
      variables: {
        input: { currentPassword, newPassword },
      },
    });

    const result = mutationData?.changePassword;

    if (result?.errors?.length) {
      return { success: false, error: result.errors[0].message };
    }

    if (!result?.success) {
      return { success: false, error: "Failed to change password" };
    }

    revalidatePath("/settings");
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
