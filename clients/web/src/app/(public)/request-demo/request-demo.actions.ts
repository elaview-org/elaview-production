"use server";

import { ActionState } from "@/types/actions";

type DemoRequestData = {
  name: string;
  company: string;
  email: string;
  phone: string;
  role: string;
  message: string;
};

type DemoRequestState = ActionState<DemoRequestData | null>;

export async function submitDemoRequest(
  _prevState: DemoRequestState,
  formData: FormData
): Promise<DemoRequestState> {
  const name = formData.get("name")?.toString()?.trim() ?? "";
  const company = formData.get("company")?.toString()?.trim() ?? "";
  const email = formData.get("email")?.toString()?.trim() ?? "";
  const phone = formData.get("phone")?.toString()?.trim() ?? "";
  const role = formData.get("role")?.toString()?.trim() ?? "";
  const message = formData.get("message")?.toString()?.trim() ?? "";

  if (!name || !email || !role) {
    return {
      success: false,
      message: "Name, email, and role are required.",
      data: { name, company, email, phone, role, message },
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: "Please enter a valid work email address.",
      data: { name, company, email, phone, role, message },
    };
  }

  try {
    // TODO: Integrate with backend notification/email/CRM service when available.
    // For now, log the submission server-side and return success.
    console.info("[Demo Request]", {
      name,
      company,
      email,
      phone,
      role,
      message,
    });

    return {
      success: true,
      message:
        "Demo request received! We'll reach out within 1 business day to schedule your session.",
      data: null,
    };
  } catch {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
      data: { name, company, email, phone, role, message },
    };
  }
}
