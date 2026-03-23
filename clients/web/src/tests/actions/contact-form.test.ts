/**
 * Tests for the contact form server action.
 * Validates form submission, field validation, and error states.
 */

import { describe, expect, it, mock } from "bun:test";

// Mock server-only before importing the action
mock.module("server-only", () => ({}));

// We have to dynamically import after mocking
const { submitContactForm } = await import(
  "@/app/(public)/contact/contact.actions"
);

function createFormData(fields: Record<string, string>): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }
  return formData;
}

describe("submitContactForm", () => {
  const validFields = {
    name: "John Doe",
    email: "john@example.com",
    subject: "Inquiry about ad spaces",
    message: "I would like to learn more about your platform.",
  };

  const initialState = { success: false, message: "", data: null };

  function omit<T extends Record<string, string>>(
    obj: T,
    ...keys: (keyof T)[]
  ): Record<string, string> {
    return Object.fromEntries(
      Object.entries(obj).filter(([k]) => !keys.includes(k as keyof T))
    );
  }

  it("returns success when all fields are valid", async () => {
    const formData = createFormData(validFields);
    const result = await submitContactForm(initialState, formData);

    expect(result.success).toBe(true);
    expect(result.message).toContain("Thank you");
  });

  it("returns error when name is missing", async () => {
    const formData = createFormData(omit(validFields, "name"));
    const result = await submitContactForm(initialState, formData);

    expect(result.success).toBe(false);
    expect(result.message).toBeTruthy();
  });

  it("returns error when email is missing", async () => {
    const formData = createFormData(omit(validFields, "email"));
    const result = await submitContactForm(initialState, formData);

    expect(result.success).toBe(false);
    expect(result.message).toBeTruthy();
  });

  it("returns error when email is invalid", async () => {
    const formData = createFormData({ ...validFields, email: "not-an-email" });
    const result = await submitContactForm(initialState, formData);

    expect(result.success).toBe(false);
    expect(result.message).toContain("email");
  });

  it("returns error when subject is missing", async () => {
    const formData = createFormData(omit(validFields, "subject"));
    const result = await submitContactForm(initialState, formData);

    expect(result.success).toBe(false);
  });

  it("returns error when message is missing", async () => {
    const formData = createFormData(omit(validFields, "message"));
    const result = await submitContactForm(initialState, formData);

    expect(result.success).toBe(false);
  });

  it("returns null data on success", async () => {
    const formData = createFormData(validFields);
    const result = await submitContactForm(initialState, formData);

    expect(result.success).toBe(true);
    expect(result.data).toBeNull();
  });

  it("preserves submitted data on validation error", async () => {
    const formData = createFormData({ ...validFields, email: "bad" });
    const result = await submitContactForm(initialState, formData);

    expect(result.success).toBe(false);
    expect(result.data).toBeDefined();
    expect(result.data?.name).toBe(validFields.name);
    expect(result.data?.email).toBe("bad");
  });
});
