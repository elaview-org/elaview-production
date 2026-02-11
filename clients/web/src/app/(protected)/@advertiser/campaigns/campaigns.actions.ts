"use server";

import api from "@/lib/gql/server";
import {
  graphql,
  type CreateCampaignInput,
  type UpdateCampaignInput,
} from "@/types/gql";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createCampaignSchema } from "./schemas";

export interface CreateCampaignState {
  success: boolean;
  message: string;
  fieldErrors: Record<string, string[]>;
}

export interface UpdateCampaignState {
  success: boolean;
  message: string;
}

export async function createCampaignAction(
  _prevState: CreateCampaignState,
  formData: FormData
): Promise<CreateCampaignState> {
  const rawData = {
    name: formData.get("name")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    goals: formData.get("goals")?.toString() ?? "",
    targetAudience: formData.get("targetAudience")?.toString() ?? "",
    totalBudget: formData.get("totalBudget")?.toString() ?? "",
    startDate: formData.get("startDate")?.toString() ?? "",
    endDate: formData.get("endDate")?.toString() ?? "",
    imageUrl: formData.get("imageUrl")?.toString() ?? "",
  };

  const parsed = createCampaignSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const input: CreateCampaignInput = {
    name: parsed.data.name,
    imageUrl: parsed.data.imageUrl,
    description: parsed.data.description || null,
    goals: parsed.data.goals || null,
    targetAudience: parsed.data.targetAudience || null,
    totalBudget: parsed.data.totalBudget,
    startDate: new Date(parsed.data.startDate).toISOString(),
    endDate: new Date(parsed.data.endDate).toISOString(),
  };

  try {
    const result = await api.mutate({
      mutation: graphql(`
        mutation CreateCampaign($input: CreateCampaignInput!) {
          createCampaign(input: $input) {
            campaign {
              id
            }
            errors {
              ... on Error {
                message
              }
            }
          }
        }
      `),
      variables: { input },
    });

    const payload = result.data?.createCampaign;

    if (payload?.errors?.length) {
      return {
        success: false,
        message: payload.errors[0].message,
        fieldErrors: {},
      };
    }

    if (!payload?.campaign?.id) {
      return {
        success: false,
        message: "Failed to create campaign",
        fieldErrors: {},
      };
    }

    revalidatePath("/campaigns");
    redirect(`/campaigns/${payload.campaign.id}`);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
      fieldErrors: {},
    };
  }
}

export async function updateCampaignAction(
  id: string,
  _prevState: UpdateCampaignState,
  formData: FormData
): Promise<UpdateCampaignState> {
  const input: UpdateCampaignInput = {};

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const goals = formData.get("goals")?.toString();
  const targetAudience = formData.get("targetAudience")?.toString();
  const totalBudget = formData.get("totalBudget")?.toString();
  const startDate = formData.get("startDate")?.toString();
  const endDate = formData.get("endDate")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();

  if (name) input.name = name;
  if (description !== undefined) input.description = description || null;
  if (goals !== undefined) input.goals = goals || null;
  if (targetAudience !== undefined)
    input.targetAudience = targetAudience || null;
  if (totalBudget) input.totalBudget = parseFloat(totalBudget);
  if (startDate) input.startDate = new Date(startDate).toISOString();
  if (endDate) input.endDate = new Date(endDate).toISOString();
  if (imageUrl) input.imageUrl = imageUrl;

  try {
    const result = await api.mutate({
      mutation: graphql(`
        mutation UpdateCampaign($id: ID!, $input: UpdateCampaignInput!) {
          updateCampaign(id: $id, input: $input) {
            campaign {
              id
            }
            errors {
              ... on Error {
                message
              }
            }
          }
        }
      `),
      variables: { id, input },
    });

    const payload = result.data?.updateCampaign;

    if (payload?.errors?.length) {
      return { success: false, message: payload.errors[0].message };
    }

    if (!payload?.campaign?.id) {
      return { success: false, message: "Failed to update campaign" };
    }

    revalidatePath(`/campaigns/${id}`);
    return { success: true, message: "Campaign updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function updateCampaignImageAction(
  id: string,
  imageUrl: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const result = await api.mutate({
      mutation: graphql(`
        mutation UpdateCampaignImage($id: ID!, $input: UpdateCampaignInput!) {
          updateCampaign(id: $id, input: $input) {
            campaign {
              id
              imageUrl
            }
            errors {
              ... on Error {
                message
              }
            }
          }
        }
      `),
      variables: { id, input: { imageUrl } },
    });

    const payload = result.data?.updateCampaign;

    if (payload?.errors?.length) {
      return { success: false, error: payload.errors[0].message };
    }

    revalidatePath(`/campaigns/${id}`);
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function submitCampaignAction(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const result = await api.mutate({
      mutation: graphql(`
        mutation SubmitCampaign($input: SubmitCampaignInput!) {
          submitCampaign(input: $input) {
            campaign {
              id
              status
            }
            errors {
              ... on Error {
                message
              }
            }
          }
        }
      `),
      variables: { input: { id } },
    });

    const payload = result.data?.submitCampaign;

    if (payload?.errors?.length) {
      return { success: false, error: payload.errors[0].message };
    }

    revalidatePath(`/campaigns/${id}`);
    revalidatePath("/campaigns");
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function cancelCampaignAction(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const result = await api.mutate({
      mutation: graphql(`
        mutation CancelCampaign($input: CancelCampaignInput!) {
          cancelCampaign(input: $input) {
            campaign {
              id
              status
            }
            errors {
              ... on Error {
                message
              }
            }
          }
        }
      `),
      variables: { input: { id } },
    });

    const payload = result.data?.cancelCampaign;

    if (payload?.errors?.length) {
      return { success: false, error: payload.errors[0].message };
    }

    revalidatePath(`/campaigns/${id}`);
    revalidatePath("/campaigns");
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function deleteCampaignAction(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const result = await api.mutate({
      mutation: graphql(`
        mutation DeleteCampaign($input: DeleteCampaignInput!) {
          deleteCampaign(input: $input) {
            success
            errors {
              ... on Error {
                message
              }
            }
          }
        }
      `),
      variables: { input: { id } },
    });

    const payload = result.data?.deleteCampaign;

    if (payload?.errors?.length) {
      return { success: false, error: payload.errors[0].message };
    }

    if (!payload?.success) {
      return { success: false, error: "Failed to delete campaign" };
    }

    revalidatePath("/campaigns");
    redirect("/campaigns");
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
