"use server";

import api from "@/api/server";
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

  try {
    const input = {
      ...parsed.data,
      expiresAt: parsed.data.expiresAt || undefined,
    };

    await api.careers.create(input);

    revalidatePath("/postings");
    revalidatePath("/careers");

    return {
      success: true,
      message: "Career created successfully.",
      fieldErrors: {},
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create career",
      fieldErrors: {},
    };
  }
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

  try {
    const input = {
      ...parsed.data,
      expiresAt: parsed.data.expiresAt || undefined,
    };

    await api.careers.update(id, input);

    revalidatePath("/postings");
    revalidatePath("/careers");
    revalidatePath(`/careers/${id}`);

    return {
      success: true,
      message: "Career updated successfully.",
      fieldErrors: {},
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update career",
      fieldErrors: {},
    };
  }
}

export async function deleteCareerAction(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    await api.careers.delete(id);

    revalidatePath("/postings");
    revalidatePath("/careers");

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete career",
    };
  }
}

export async function toggleCareerActiveAction(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; error: string | null }> {
  try {
    await api.careers.update(id, { isActive });

    revalidatePath("/postings");
    revalidatePath("/careers");
    revalidatePath(`/careers/${id}`);

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update status",
    };
  }
}
