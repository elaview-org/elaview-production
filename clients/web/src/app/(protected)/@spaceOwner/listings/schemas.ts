import { z } from "zod";
import { SpaceType } from "@/types/gql";

export const photosStepSchema = z.object({
  images: z
    .array(z.string().url())
    .min(1, "At least one photo is required")
    .max(5, "Maximum 5 photos allowed"),
});

export const detailsStepSchema = z.object({
  type: z.nativeEnum(SpaceType, { message: "Space type is required" }),
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(500, "Description is too long").optional(),
});

export const locationStepSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().length(2, "State must be 2 characters"),
  zipCode: z.string().optional(),
});

export const pricingStepSchema = z.object({
  width: z.coerce.number().positive("Width must be positive").optional(),
  height: z.coerce.number().positive("Height must be positive").optional(),
  pricePerDay: z.coerce.number().min(1, "Daily rate must be at least $1"),
  installationFee: z.coerce
    .number()
    .nonnegative("Installation fee cannot be negative")
    .optional(),
  minDuration: z.coerce.number().int().min(1, "Minimum 1 day").default(1),
  maxDuration: z.coerce.number().int().positive().optional(),
});

export const createSpaceSchema = photosStepSchema
  .merge(detailsStepSchema)
  .merge(locationStepSchema)
  .merge(pricingStepSchema);

export type CreateSpaceFormData = z.infer<typeof createSpaceSchema>;
