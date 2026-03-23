"use server";

import { ActionState } from "@/types/actions";

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ContactState = ActionState<ContactFormData | null>;

export async function submitContactForm(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = formData.get("name")?.toString()?.trim() ?? "";
  const email = formData.get("email")?.toString()?.trim() ?? "";
  const subject = formData.get("subject")?.toString()?.trim() ?? "";
  const message = formData.get("message")?.toString()?.trim() ?? "";

  if (!name || !email || !subject || !message) {
    return {
      success: false,
      message: "All fields are required.",
      data: { name, email, subject, message },
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: "Please enter a valid email address.",
      data: { name, email, subject, message },
    };
  }

  try {
    // TODO: Integrate with backend notification/email service when available.
    // For now, log the submission server-side and return success.
    console.info("[Contact Form]", { name, email, subject, message });

    return {
      success: true,
      message:
        "Thank you for reaching out! We'll get back to you within 1 business day.",
      data: null,
    };
  } catch {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
      data: { name, email, subject, message },
    };
  }
}
