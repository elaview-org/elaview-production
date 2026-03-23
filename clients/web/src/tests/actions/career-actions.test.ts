/**
 * Tests for career admin server actions (create, update, delete, toggle).
 * Mocks the API layer and validates form processing, validation, and error handling.
 */

import { describe, expect, it, mock, beforeEach } from "bun:test";

// Track calls to mocked API
let mockCreate: ReturnType<typeof mock>;
let mockUpdate: ReturnType<typeof mock>;
let mockDelete: ReturnType<typeof mock>;

// Mock server-only
mock.module("server-only", () => ({}));

// Mock next/cache
mock.module("next/cache", () => ({
  revalidatePath: () => {},
  revalidateTag: () => {},
}));

// Reset mocks before each API setup
beforeEach(() => {
  mockCreate = mock(() => Promise.resolve({ id: "new-career-id" }));
  mockUpdate = mock(() => Promise.resolve({ id: "career-1" }));
  mockDelete = mock(() => Promise.resolve());
});

// Mock the API module
mock.module("@/api/server", () => ({
  default: {
    careers: {
      get create() {
        return mockCreate;
      },
      get update() {
        return mockUpdate;
      },
      get delete() {
        return mockDelete;
      },
    },
  },
}));

const {
  createCareerAction,
  updateCareerAction,
  deleteCareerAction,
  toggleCareerActiveAction,
  careerActionInitialState,
} = await import(
  "@/app/(protected)/@content/@admin/postings/careers.actions"
);

function createFormData(fields: Record<string, string>): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }
  return formData;
}

const validCareerFields = {
  title: "Senior Engineer",
  department: "ENGINEERING",
  location: "San Francisco, CA",
  type: "FULL_TIME",
  description: "Build and maintain core platform features.",
  requirements: "5+ years experience with TypeScript and React.",
  isActive: "true",
};

describe("createCareerAction", () => {
  it("creates a career with valid data", async () => {
    const formData = createFormData(validCareerFields);
    const result = await createCareerAction(careerActionInitialState, formData);

    expect(result.success).toBe(true);
    expect(result.message).toContain("created");
    expect(Object.keys(result.fieldErrors)).toHaveLength(0);
  });

  it("returns field errors when title is missing", async () => {
    const formData = createFormData({ ...validCareerFields, title: "" });
    const result = await createCareerAction(careerActionInitialState, formData);

    expect(result.success).toBe(false);
    expect(result.fieldErrors.title).toBeDefined();
  });

  it("returns field errors with invalid department", async () => {
    const formData = createFormData({
      ...validCareerFields,
      department: "INVALID",
    });
    const result = await createCareerAction(careerActionInitialState, formData);

    expect(result.success).toBe(false);
    expect(result.fieldErrors.department).toBeDefined();
  });

  it("returns field errors with invalid employment type", async () => {
    const formData = createFormData({
      ...validCareerFields,
      type: "VOLUNTEER",
    });
    const result = await createCareerAction(careerActionInitialState, formData);

    expect(result.success).toBe(false);
    expect(result.fieldErrors.type).toBeDefined();
  });

  it("returns field errors when description is missing", async () => {
    const formData = createFormData({
      ...validCareerFields,
      description: "",
    });
    const result = await createCareerAction(careerActionInitialState, formData);

    expect(result.success).toBe(false);
    expect(result.fieldErrors.description).toBeDefined();
  });

  it("returns field errors when requirements are missing", async () => {
    const formData = createFormData({
      ...validCareerFields,
      requirements: "",
    });
    const result = await createCareerAction(careerActionInitialState, formData);

    expect(result.success).toBe(false);
    expect(result.fieldErrors.requirements).toBeDefined();
  });

  it("handles API failure gracefully", async () => {
    mockCreate = mock(() => Promise.reject(new Error("Network error")));
    mock.module("@/api/server", () => ({
      default: {
        careers: {
          get create() {
            return mockCreate;
          },
          get update() {
            return mockUpdate;
          },
          get delete() {
            return mockDelete;
          },
        },
      },
    }));

    const formData = createFormData(validCareerFields);
    const result = await createCareerAction(careerActionInitialState, formData);

    expect(result.success).toBe(false);
    expect(result.message).toContain("Network error");
  });
});

describe("updateCareerAction", () => {
  it("updates a career with valid data", async () => {
    const formData = createFormData(validCareerFields);
    const result = await updateCareerAction(
      "career-1",
      careerActionInitialState,
      formData
    );

    expect(result.success).toBe(true);
    expect(result.message).toContain("updated");
  });

  it("returns validation errors on invalid data", async () => {
    const formData = createFormData({ ...validCareerFields, title: "" });
    const result = await updateCareerAction(
      "career-1",
      careerActionInitialState,
      formData
    );

    expect(result.success).toBe(false);
    expect(result.fieldErrors.title).toBeDefined();
  });
});

describe("deleteCareerAction", () => {
  it("deletes a career successfully", async () => {
    const result = await deleteCareerAction("career-1");

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
  });

  it("returns error on API failure", async () => {
    mockDelete = mock(() => Promise.reject(new Error("Not found")));
    mock.module("@/api/server", () => ({
      default: {
        careers: {
          get create() {
            return mockCreate;
          },
          get update() {
            return mockUpdate;
          },
          get delete() {
            return mockDelete;
          },
        },
      },
    }));

    const result = await deleteCareerAction("nonexistent");

    expect(result.success).toBe(false);
    expect(result.error).toContain("Not found");
  });
});

describe("toggleCareerActiveAction", () => {
  it("toggles career active status", async () => {
    const result = await toggleCareerActiveAction("career-1", false);

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
  });

  it("returns error on API failure", async () => {
    mockUpdate = mock(() => Promise.reject(new Error("Forbidden")));
    mock.module("@/api/server", () => ({
      default: {
        careers: {
          get create() {
            return mockCreate;
          },
          get update() {
            return mockUpdate;
          },
          get delete() {
            return mockDelete;
          },
        },
      },
    }));

    const result = await toggleCareerActiveAction("career-1", true);

    expect(result.success).toBe(false);
    expect(result.error).toContain("Forbidden");
  });
});
