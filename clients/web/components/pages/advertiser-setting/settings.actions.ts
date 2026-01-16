"use server";

import api from "@/api/gql/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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

export async function updateProfileAction(
  _prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  try {
    // Get current user first
    const { data: currentUserData } = await api.query({
      query: api.gql`
        query GetCurrentUser {
          currentUser {
            id
            email
            name
            phone
            avatar
            createdAt
            lastLoginAt
            role
            activeProfileType
            status
            advertiserProfile {
              id
              companyName
              industry
              website
              onboardingComplete
              createdAt
              userId
            }
          }
        }
      `,
    });

    if (!currentUserData?.currentUser) {
      redirect("/logout");
    }

    const user = currentUserData.currentUser;
    const advertiserProfile = user.advertiserProfile;

    const name = formData.get("name")?.toString() ?? "";
    const email = formData.get("email")?.toString() ?? "";
    const phone = formData.get("phone")?.toString() ?? "";

    // Validate inputs
    if (!name.trim()) {
      return {
        success: false,
        message: "Name is required",
        data: { name, email, phone },
      };
    }

    if (!email.trim() || !email.includes("@")) {
      return {
        success: false,
        message: "Valid email is required",
        data: { name, email, phone },
      };
    }

    // Build the update mutation
    const updatedUser = {
      id: user.id,
      email,
      name,
      phone: phone || null,
      avatar: user.avatar,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      role: user.role,
      activeProfileType: user.activeProfileType,
      status: user.status,
      password: "", // Keep existing password - don't update it
      advertiserProfile: advertiserProfile
        ? {
            id: advertiserProfile.id,
            companyName: advertiserProfile.companyName,
            industry: advertiserProfile.industry,
            website: advertiserProfile.website,
            onboardingComplete: advertiserProfile.onboardingComplete,
            createdAt: advertiserProfile.createdAt,
            userId: advertiserProfile.userId,
            campaigns: [],
            stripeAccountId: null,
            stripeAccountStatus: null,
            stripeAccountDisconnectedAt: null,
            stripeAccountDisconnectedNotifiedAt: null,
            stripeLastAccountHealthCheck: null,
          }
        : undefined,
      spaceOwnerProfile: undefined,
    };

    const { data, errors } = await api.query({
      query: api.gql`
        mutation UpdateCurrentUser($input: UpdateCurrentUserInput!) {
          updateCurrentUser(input: $input) {
            user {
              id
              name
              email
              phone
              avatar
            }
          }
        }
      `,
      variables: {
        input: {
          updatedUser,
        },
      },
    });

    if (errors || !data?.updateCurrentUser?.user) {
      return {
        success: false,
        message: errors?.[0]?.message ?? "Failed to update profile",
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
      data: {
        name: formData.get("name")?.toString() ?? "",
        email: formData.get("email")?.toString() ?? "",
        phone: formData.get("phone")?.toString() ?? "",
      },
    };
  }
}

export async function updateBusinessInfoAction(
  _prevState: UpdateBusinessInfoState,
  formData: FormData
): Promise<UpdateBusinessInfoState> {
  try {
    // Get current user first
    const { data: currentUserData } = await api.query({
      query: api.gql`
        query GetCurrentUser {
          currentUser {
            id
            email
            name
            phone
            avatar
            createdAt
            lastLoginAt
            role
            activeProfileType
            status
            advertiserProfile {
              id
              companyName
              industry
              website
              onboardingComplete
              createdAt
              userId
            }
          }
        }
      `,
    });

    if (!currentUserData?.currentUser) {
      redirect("/logout");
    }

    const user = currentUserData.currentUser;
    const advertiserProfile = user.advertiserProfile;

    if (!advertiserProfile) {
      return {
        success: false,
        message: "Advertiser profile not found",
        data: {
          companyName: "",
          industry: "",
          website: "",
        },
      };
    }

    const companyName = formData.get("companyName")?.toString() ?? "";
    const industry = formData.get("industry")?.toString() ?? "";
    const website = formData.get("website")?.toString() ?? "";

    // Build the update mutation
    const updatedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      role: user.role,
      activeProfileType: user.activeProfileType,
      status: user.status,
      password: "", // Keep existing password
      advertiserProfile: {
        id: advertiserProfile.id,
        companyName: companyName || null,
        industry: industry || null,
        website: website || null,
        onboardingComplete: advertiserProfile.onboardingComplete,
        createdAt: advertiserProfile.createdAt,
        userId: advertiserProfile.userId,
        campaigns: [],
        stripeAccountId: null,
        stripeAccountStatus: null,
        stripeAccountDisconnectedAt: null,
        stripeAccountDisconnectedNotifiedAt: null,
        stripeLastAccountHealthCheck: null,
      },
      spaceOwnerProfile: undefined,
    };

    const { data, errors } = await api.query({
      query: api.gql`
        mutation UpdateCurrentUser($input: UpdateCurrentUserInput!) {
          updateCurrentUser(input: $input) {
            user {
              id
              advertiserProfile {
                companyName
                industry
                website
              }
            }
          }
        }
      `,
      variables: {
        input: {
          updatedUser,
        },
      },
    });

    if (errors || !data?.updateCurrentUser?.user) {
      return {
        success: false,
        message: errors?.[0]?.message ?? "Failed to update business information",
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
      data: {
        companyName: formData.get("companyName")?.toString() ?? "",
        industry: formData.get("industry")?.toString() ?? "",
        website: formData.get("website")?.toString() ?? "",
      },
    };
  }
}
