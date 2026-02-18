"use server";

import api from "@/lib/gql/server";
import {
  graphql,
  type CreateSpaceInput,
  type UpdateSpaceInput,
} from "@/types/gql";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSpaceSchema } from "./schemas";

export interface CreateSpaceState {
  success: boolean;
  message: string;
  fieldErrors: Record<string, string[]>;
}

export interface UpdateSpaceState {
  success: boolean;
  message: string;
}

export async function createSpaceAction(
  _prevState: CreateSpaceState,
  formData: FormData
): Promise<CreateSpaceState> {
  const rawData = {
    images: JSON.parse(formData.get("images")?.toString() ?? "[]"),
    type: formData.get("type")?.toString(),
    title: formData.get("title")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    address: formData.get("address")?.toString() ?? "",
    city: formData.get("city")?.toString() ?? "",
    state: formData.get("state")?.toString() ?? "",
    zipCode: formData.get("zipCode")?.toString() ?? "",
    width: formData.get("width")?.toString() ?? undefined,
    height: formData.get("height")?.toString() ?? undefined,
    pricePerDay: formData.get("pricePerDay")?.toString() ?? "",
    installationFee: formData.get("installationFee")?.toString() ?? undefined,
    minDuration: formData.get("minDuration")?.toString() ?? "1",
    maxDuration: formData.get("maxDuration")?.toString() ?? undefined,
  };

  const parsed = createSpaceSchema.safeParse(rawData);

  if (!parsed.success) {
    console.error(
      "[createSpaceAction] Zod validation failed:",
      JSON.stringify(parsed.error.flatten())
    );
    return {
      success: false,
      message: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const input: CreateSpaceInput = {
    title: parsed.data.title,
    type: parsed.data.type,
    address: parsed.data.address,
    city: parsed.data.city,
    state: parsed.data.state.toUpperCase(),
    zipCode: parsed.data.zipCode || null,
    pricePerDay: parsed.data.pricePerDay,
    minDuration: parsed.data.minDuration,
    description: parsed.data.description || null,
    images: parsed.data.images,
    width: parsed.data.width || null,
    height: parsed.data.height || null,
    installationFee: parsed.data.installationFee || null,
    maxDuration: parsed.data.maxDuration || null,
  };

  let spaceId: string;
  try {
    const result = await api.mutate({
      mutation: graphql(`
        mutation CreateSpace($input: CreateSpaceInput!) {
          createSpace(input: $input) {
            space {
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

    const payload = result.data?.createSpace;

    if (payload?.errors?.length) {
      return {
        success: false,
        message: payload.errors[0].message,
        fieldErrors: {},
      };
    }

    if (!payload?.space?.id) {
      return {
        success: false,
        message: "Failed to create space",
        fieldErrors: {},
      };
    }

    spaceId = payload.space.id;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
      fieldErrors: {},
    };
  }

  revalidatePath("/listings");
  redirect(`/listings/${spaceId}`);
}

export async function updateSpaceAction(
  id: string,
  _prevState: UpdateSpaceState,
  formData: FormData
): Promise<UpdateSpaceState> {
  const input: UpdateSpaceInput = {};

  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const address = formData.get("address")?.toString();
  const city = formData.get("city")?.toString();
  const state = formData.get("state")?.toString();
  const zipCode = formData.get("zipCode")?.toString();
  const pricePerDay = formData.get("pricePerDay")?.toString();
  const installationFee = formData.get("installationFee")?.toString();
  const minDuration = formData.get("minDuration")?.toString();
  const maxDuration = formData.get("maxDuration")?.toString();
  const traffic = formData.get("traffic")?.toString();
  const images = formData.get("images")?.toString();

  if (title) input.title = title;
  if (description !== undefined) input.description = description || null;
  if (address) input.address = address;
  if (city) input.city = city;
  if (state) input.state = state.toUpperCase();
  if (zipCode !== undefined) input.zipCode = zipCode || null;
  if (pricePerDay) input.pricePerDay = parseFloat(pricePerDay);
  if (installationFee)
    input.installationFee = parseFloat(installationFee) || null;
  if (minDuration) input.minDuration = parseInt(minDuration, 10);
  if (maxDuration) input.maxDuration = parseInt(maxDuration, 10) || null;
  if (traffic !== undefined) input.traffic = traffic || null;
  if (images) input.images = JSON.parse(images);

  try {
    const result = await api.mutate({
      mutation: graphql(`
        mutation UpdateSpace($id: ID!, $input: UpdateSpaceInput!) {
          updateSpace(id: $id, input: $input) {
            space {
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

    const payload = result.data?.updateSpace;

    if (payload?.errors?.length) {
      return { success: false, message: payload.errors[0].message };
    }

    if (!payload?.space?.id) {
      return { success: false, message: "Failed to update space" };
    }

    revalidatePath(`/listings/${id}`);
    return { success: true, message: "Space updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function updateSpaceImagesAction(
  id: string,
  images: string[]
): Promise<{ success: boolean; error: string | null }> {
  try {
    const result = await api.mutate({
      mutation: graphql(`
        mutation UpdateSpaceImages($id: ID!, $input: UpdateSpaceInput!) {
          updateSpace(id: $id, input: $input) {
            space {
              id
              images
            }
            errors {
              ... on Error {
                message
              }
            }
          }
        }
      `),
      variables: { id, input: { images } },
    });

    const payload = result.data?.updateSpace;

    if (payload?.errors?.length) {
      return { success: false, error: payload.errors[0].message };
    }

    revalidatePath(`/listings/${id}`);
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function deactivateSpaceAction(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const result = await api.mutate({
      mutation: graphql(`
        mutation DeactivateSpace($input: DeactivateSpaceInput!) {
          deactivateSpace(input: $input) {
            space {
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

    const payload = result.data?.deactivateSpace;

    if (payload?.errors?.length) {
      return { success: false, error: payload.errors[0].message };
    }

    revalidatePath(`/listings/${id}`);
    revalidatePath("/listings");
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function reactivateSpaceAction(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const result = await api.mutate({
      mutation: graphql(`
        mutation ReactivateSpace($input: ReactivateSpaceInput!) {
          reactivateSpace(input: $input) {
            space {
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

    const payload = result.data?.reactivateSpace;

    if (payload?.errors?.length) {
      return { success: false, error: payload.errors[0].message };
    }

    revalidatePath(`/listings/${id}`);
    revalidatePath("/listings");
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function deleteSpaceAction(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const result = await api.mutate({
      mutation: graphql(`
        mutation DeleteSpace($input: DeleteSpaceInput!) {
          deleteSpace(input: $input) {
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

    const payload = result.data?.deleteSpace;

    if (payload?.errors?.length) {
      return { success: false, error: payload.errors[0].message };
    }

    if (!payload?.success) {
      return { success: false, error: "Failed to delete space" };
    }

    revalidatePath("/listings");
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }

  redirect("/listings");
}

export interface BulkActionResult {
  success: boolean;
  successCount: number;
  failedCount: number;
  errors: string[];
}

export async function bulkDeactivateSpacesAction(
  ids: string[]
): Promise<BulkActionResult> {
  const results = await Promise.all(
    ids.map(async (id) => {
      const result = await api.mutate({
        mutation: graphql(`
          mutation BulkDeactivateSpace($input: DeactivateSpaceInput!) {
            deactivateSpace(input: $input) {
              space {
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
        variables: { input: { id } },
      });

      const payload = result.data?.deactivateSpace;
      if (payload?.errors?.length) {
        return { success: false, error: payload.errors[0].message };
      }
      return { success: true, error: null };
    })
  );

  const successCount = results.filter((r) => r.success).length;
  const failedCount = results.filter((r) => !r.success).length;
  const errors = results.filter((r) => r.error).map((r) => r.error as string);

  revalidatePath("/listings");

  return {
    success: failedCount === 0,
    successCount,
    failedCount,
    errors,
  };
}

export async function bulkDeleteSpacesAction(
  ids: string[]
): Promise<BulkActionResult> {
  const results = await Promise.all(
    ids.map(async (id) => {
      const result = await api.mutate({
        mutation: graphql(`
          mutation BulkDeleteSpace($input: DeleteSpaceInput!) {
            deleteSpace(input: $input) {
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

      const payload = result.data?.deleteSpace;
      if (payload?.errors?.length) {
        return { success: false, error: payload.errors[0].message };
      }
      if (!payload?.success) {
        return { success: false, error: "Failed to delete space" };
      }
      return { success: true, error: null };
    })
  );

  const successCount = results.filter((r) => r.success).length;
  const failedCount = results.filter((r) => !r.success).length;
  const errors = results.filter((r) => r.error).map((r) => r.error as string);

  revalidatePath("/listings");

  return {
    success: failedCount === 0,
    successCount,
    failedCount,
    errors,
  };
}
