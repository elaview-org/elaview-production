/**
 * Tests for the career form Zod schema validation.
 * Ensures all fields are validated correctly with proper error messages.
 */

import { describe, expect, it } from "bun:test";
import { careerSchema } from "@/app/(protected)/@content/@admin/postings/schemas";

const validData = {
  title: "Senior Engineer",
  department: "ENGINEERING" as const,
  location: "San Francisco, CA",
  type: "FULL_TIME" as const,
  description: "Build core platform features.",
  requirements: "5+ years TypeScript experience.",
  isActive: true,
};

describe("careerSchema", () => {
  it("accepts valid data", () => {
    const result = careerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("accepts all valid department values", () => {
    const departments = [
      "ENGINEERING",
      "DESIGN",
      "MARKETING",
      "SALES",
      "OPERATIONS",
      "CUSTOMER_SUCCESS",
    ] as const;

    for (const dept of departments) {
      const result = careerSchema.safeParse({ ...validData, department: dept });
      expect(result.success).toBe(true);
    }
  });

  it("accepts all valid type values", () => {
    const types = [
      "FULL_TIME",
      "PART_TIME",
      "CONTRACT",
      "INTERNSHIP",
    ] as const;

    for (const type of types) {
      const result = careerSchema.safeParse({ ...validData, type });
      expect(result.success).toBe(true);
    }
  });

  it("rejects empty title", () => {
    const result = careerSchema.safeParse({ ...validData, title: "" });
    expect(result.success).toBe(false);
  });

  it("rejects title exceeding 100 chars", () => {
    const result = careerSchema.safeParse({
      ...validData,
      title: "A".repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid department", () => {
    const result = careerSchema.safeParse({
      ...validData,
      department: "HR",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty location", () => {
    const result = careerSchema.safeParse({ ...validData, location: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid employment type", () => {
    const result = careerSchema.safeParse({
      ...validData,
      type: "VOLUNTEER",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty description", () => {
    const result = careerSchema.safeParse({ ...validData, description: "" });
    expect(result.success).toBe(false);
  });

  it("rejects empty requirements", () => {
    const result = careerSchema.safeParse({ ...validData, requirements: "" });
    expect(result.success).toBe(false);
  });

  it("defaults isActive to true when omitted", () => {
    const data = { ...validData };
    delete (data as Record<string, unknown>).isActive;
    const result = careerSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isActive).toBe(true);
    }
  });

  it("accepts optional expiresAt as ISO datetime", () => {
    const result = careerSchema.safeParse({
      ...validData,
      expiresAt: "2025-12-31T23:59:59.000Z",
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty string for expiresAt", () => {
    const result = careerSchema.safeParse({
      ...validData,
      expiresAt: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid expiresAt format", () => {
    const result = careerSchema.safeParse({
      ...validData,
      expiresAt: "not-a-date",
    });
    expect(result.success).toBe(false);
  });
});
