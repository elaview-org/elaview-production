"use client";

import { useActionState } from "react";
import { Button } from "@/components/primitives/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/primitives/field";
import { Input } from "@/components/primitives/input";
import { updateBusinessInfoAction } from "./settings.actions";
import type { User } from "@/types/gql";
import { toast } from "sonner";

interface BusinessSettingsFormProps {
  user: User;
}

const INDUSTRY_OPTIONS = [
  "Restaurant & Food Service",
  "Fitness & Gym",
  "Beauty & Salon",
  "Real Estate",
  "Retail",
  "Healthcare",
  "Education",
  "Automotive",
  "Home Services",
  "Professional Services",
  "Other",
] as const;

export function BusinessSettingsForm({ user }: BusinessSettingsFormProps) {
  const advertiserProfile = user.advertiserProfile;

  const [state, action, pending] = useActionState(updateBusinessInfoAction, {
    success: false,
    message: "",
    data: {
      companyName: advertiserProfile?.companyName ?? "",
      industry: advertiserProfile?.industry ?? "",
      website: advertiserProfile?.website ?? "",
    },
  });

  if (state.success) {
    toast.success("Business information updated successfully");
  }

  return (
    <form action={action} className="space-y-6">
      <FieldGroup>
        {/* Company Name Field */}
        <Field>
          <FieldLabel htmlFor="companyName">Company Name</FieldLabel>
          <Input
            id="companyName"
            name="companyName"
            type="text"
            placeholder="Acme Inc."
            defaultValue={state.data.companyName}
          />
          <FieldDescription>
            The name of your business or organization. This helps space owners
            understand who they&#39;re working with.
          </FieldDescription>
        </Field>

        {/* Industry Field */}
        <Field>
          <FieldLabel htmlFor="industry">Industry</FieldLabel>
          <select
            id="industry"
            name="industry"
            defaultValue={state.data.industry}
            className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select an industry</option>
            {INDUSTRY_OPTIONS.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
          <FieldDescription>
            Select the industry that best describes your business.
          </FieldDescription>
        </Field>

        {/* Website Field */}
        <Field>
          <FieldLabel htmlFor="website">Website</FieldLabel>
          <Input
            id="website"
            name="website"
            type="url"
            placeholder="https://www.example.com"
            defaultValue={state.data.website ?? ""}
          />
          <FieldDescription>
            Your business website URL. This helps space owners learn more about
            your business.
          </FieldDescription>
        </Field>

        {/* Error/Success Message */}
        {state.message && (
          <Field>
            <p
              className={`text-sm ${
                state.success ? "text-green-600" : "text-destructive"
              }`}
              aria-live="polite"
            >
              {state.message}
            </p>
          </Field>
        )}

        {/* Submit Button */}
        <Field>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save Changes"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
