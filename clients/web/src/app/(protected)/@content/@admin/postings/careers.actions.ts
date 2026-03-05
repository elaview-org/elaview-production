"use server";

// TODO: Implement real GraphQL mutations once the backend implements the Career entity.
// See api/server/careers.ts for the full backend contract.
// For now these actions return stub errors so the UI can be fully built and wired up.

import { revalidatePath } from "next/cache";
import { careerSchema } from "./schemas";

export interface CareerActionState {
  success: boolean;
  message: string;
  fieldErrors: Record<string, string[]>;
}

const initialState: CareerActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

export { initialState as careerActionInitialState };

export async function createCareerAction(
  _prevState: CareerActionState,
  formData: FormData
): Promise<CareerActionState> {
  const rawData = {
    title: formData.get("title")?.toString() ?? "",
    department: formData.get("department")?.toString() ?? "",
    location: formData.get("location")?.toString() ?? "",
    type: formData.get("type")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    requirements: formData.get("requirements")?.toString() ?? "",
    isActive: formData.get("isActive") === "true",
    expiresAt: formData.get("expiresAt")?.toString() || undefined,
  };

  const parsed = careerSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  // TODO: Replace with real GraphQL mutation:
  // const result = await api.mutate({
  //   mutation: graphql(`
  //     mutation CreateCareer($input: CreateCareerInput!) {
  //       createCareer(input: $input) {
  //         career { id }
  //         errors { ... on Error { message } }
  //       }
  //     }
  //   `),
  //   variables: { input: parsed.data },
  // });
  // const payload = result.data?.createCareer;
  // if (payload?.errors?.length) return { success: false, message: payload.errors[0].message, fieldErrors: {} };
  // if (!payload?.career?.id) return { success: false, message: "Failed to create career", fieldErrors: {} };
  // revalidatePath("/careers");
  // redirect(`/careers/${payload.career.id}`);

  return {
    success: false,
    message:
      "Backend not yet implemented. See api/server/careers.ts for the GraphQL contract.",
    fieldErrors: {},
  };
}

export async function updateCareerAction(
  id: string,
  _prevState: CareerActionState,
  formData: FormData
): Promise<CareerActionState> {
  const rawData = {
    title: formData.get("title")?.toString() ?? "",
    department: formData.get("department")?.toString() ?? "",
    location: formData.get("location")?.toString() ?? "",
    type: formData.get("type")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    requirements: formData.get("requirements")?.toString() ?? "",
    isActive: formData.get("isActive") === "true",
    expiresAt: formData.get("expiresAt")?.toString() || undefined,
  };

  const parsed = careerSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  // TODO: Replace with real GraphQL mutation once backend is implemented.
  void id;

  return {
    success: false,
    message:
      "Backend not yet implemented. See api/server/careers.ts for the GraphQL contract.",
    fieldErrors: {},
  };
}

export async function deleteCareerAction(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  // TODO: Replace with real GraphQL mutation once backend is implemented.
  void id;

  return {
    success: false,
    error:
      "Backend not yet implemented. See api/server/careers.ts for the GraphQL contract.",
  };
}

export async function toggleCareerActiveAction(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; error: string | null }> {
  // TODO: Replace with real GraphQL mutation once backend is implemented.
  void id;
  void isActive;

  revalidatePath("/postings");

  return {
    success: false,
    error:
      "Backend not yet implemented. See api/server/careers.ts for the GraphQL contract.",
  };
}
