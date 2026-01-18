"use server";

import api from "@/api/gql/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type {
  UpdateCurrentUserInput,
  UpdateCurrentUserPayload,
  UpdateAdvertiserProfileInput,
  UpdateAdvertiserProfilePayload,
  User,
} from "@/types/graphql.generated";

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

type GetCurrentUserQuery = {
  currentUser: {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    avatar: string | null;
    createdAt: string;
    lastLoginAt: string | null;
    role: string;
    activeProfileType: string;
    status: string;
    advertiserProfile?: {
      id: string;
      companyName: string;
      industry: string;
      website: string | null;
      onboardingComplete: boolean;
      createdAt: string;
      userId: string;
    } | null;
  };
};

export async function updateProfileAction(
  _prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  try {
    const { data: currentUserData } = await api.query<GetCurrentUserQuery>({
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

    // Build the update mutation - UpdateUserInput only supports name, phone, and avatar
    // Note: email cannot be updated through this mutation
    const { data } = await api.query<{
      updateCurrentUser: UpdateCurrentUserPayload;
    }>({
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
          input: {
            name,
            phone: phone || null,
            avatar: user.avatar || null,
          },
        } satisfies UpdateCurrentUserInput,
      },
    });

    if (!data?.updateCurrentUser?.user) {
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
    const { data: currentUserData } = await api.query<User>({
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

    if (!currentUserData) {
      redirect("/logout");
    }

    const user = currentUserData;
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

    // Use the dedicated updateAdvertiserProfile mutation
    const { data } = await api.query<{
      updateAdvertiserProfile: UpdateAdvertiserProfilePayload;
    }>({
      query: api.gql`
        mutation UpdateAdvertiserProfile($input: UpdateAdvertiserProfileInput!) {
          updateAdvertiserProfile(input: $input) {
            advertiserProfile {
              companyName
              industry
              website
            }
          }
        }
      `,
      variables: {
        input: {
          companyName: companyName || null,
          industry: industry || null,
          website: website || null,
        } satisfies UpdateAdvertiserProfileInput,
      },
    });

    if (!data?.updateAdvertiserProfile?.advertiserProfile) {
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
      data: {
        companyName: formData.get("companyName")?.toString() ?? "",
        industry: formData.get("industry")?.toString() ?? "",
        website: formData.get("website")?.toString() ?? "",
      },
    };
  }
}
