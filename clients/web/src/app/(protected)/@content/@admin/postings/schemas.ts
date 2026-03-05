import { z } from "zod";

export const careerSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  department: z.enum(
    [
      "ENGINEERING",
      "DESIGN",
      "MARKETING",
      "SALES",
      "OPERATIONS",
      "CUSTOMER_SUCCESS",
    ],
    { error: "Department is required" }
  ),
  location: z
    .string()
    .min(1, "Location is required")
    .max(100, "Location is too long"),
  type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"], {
    error: "Employment type is required",
  }),
  description: z.string().min(1, "Description is required"),
  requirements: z.string().min(1, "Requirements are required"),
  isActive: z.boolean().default(true),
  expiresAt: z.string().datetime().optional().or(z.literal("")),
});

export type CareerFormData = z.infer<typeof careerSchema>;
