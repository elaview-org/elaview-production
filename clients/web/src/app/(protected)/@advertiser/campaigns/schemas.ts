import { z } from "zod";

export const detailsStepSchema = z.object({
  name: z
    .string()
    .min(1, "Campaign name is required")
    .max(100, "Name is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  goals: z.string().optional(),
  targetAudience: z.string().optional(),
});

export const scheduleStepSchema = z
  .object({
    totalBudget: z.coerce.number().min(100, "Minimum budget is $100"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export const mediaStepSchema = z.object({
  imageUrl: z.string().url("A valid image URL is required"),
});

export const createCampaignSchema = detailsStepSchema
  .merge(
    z.object({
      totalBudget: z.coerce.number().min(100, "Minimum budget is $100"),
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().min(1, "End date is required"),
      imageUrl: z.string().url("A valid image URL is required"),
    })
  )
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type CreateCampaignFormData = z.infer<typeof createCampaignSchema>;
