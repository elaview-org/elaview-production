/**
 * Tests for the demo request form server action.
 * Validates form submission, field validation, and error states.
 */

import { describe, expect, it, mock } from "bun:test";

// Mock server-only before importing the action
mock.module("server-only", () => ({}));

const { submitDemoRequest } = await import(
  "@/app/(public)/request-demo/request-demo.actions"
);

function createFormData(fields: Record<string, string>): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }
  return formData;
}

describe("submitDemoRequest", () => {
  const validFields = {
    name: "Jane Smith",
    email: "jane@company.com",
    role: "advertiser",
    company: "Acme Corp",
    phone: "+1234567890",
    message: "We want to try Elaview",
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

  it("returns success when all required fields are valid", async () => {
    const formData = createFormData(validFields);
    const result = await submitDemoRequest(initialState, formData);

    expect(result.success).toBe(true);
    expect(result.message).toContain("received");
  });

  it("returns success without optional fields", async () => {
    const formData = createFormData(omit(validFields, "company", "phone", "message"));
    const result = await submitDemoRequest(initialState, formData);

    expect(result.success).toBe(true);
  });

  it("returns error when name is missing", async () => {
    const formData = createFormData(omit(validFields, "name"));
    const result = await submitDemoRequest(initialState, formData);

    expect(result.success).toBe(false);
  });

  it("returns error when email is missing", async () => {
    const formData = createFormData(omit(validFields, "email"));
    const result = await submitDemoRequest(initialState, formData);

    expect(result.success).toBe(false);
  });

  it("returns error when email is invalid", async () => {
    const formData = createFormData({
      ...validFields,
      email: "bad-email",
    });
    const result = await submitDemoRequest(initialState, formData);

    expect(result.success).toBe(false);
    expect(result.message).toContain("email");
  });

  it("returns error when role is missing", async () => {
    const formData = createFormData(omit(validFields, "role"));
    const result = await submitDemoRequest(initialState, formData);

    expect(result.success).toBe(false);
  });

  it("returns null data on success", async () => {
    const formData = createFormData(validFields);
    const result = await submitDemoRequest(initialState, formData);

    expect(result.success).toBe(true);
    expect(result.data).toBeNull();
  });

  it("preserves submitted data on validation error", async () => {
    const formData = createFormData({ ...validFields, email: "bad" });
    const result = await submitDemoRequest(initialState, formData);

    expect(result.success).toBe(false);
    expect(result.data).toBeDefined();
    expect(result.data?.name).toBe(validFields.name);
    expect(result.data?.email).toBe("bad");
    expect(result.data?.role).toBe(validFields.role);
  });
});
