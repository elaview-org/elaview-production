"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/primitives/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/primitives/field";
import { Input } from "@/components/primitives/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";
import { updateAdvertiserBusinessAction } from "../settings.actions";
import { toast } from "sonner";
import { INDUSTRY_OPTIONS } from "../constants";

type Props = {
  companyName?: string | null;
  industry?: string | null;
  website?: string | null;
};

export default function AdvertiserBusinessForm({
  companyName,
  industry,
  website,
}: Props) {
  const prevSuccessRef = useRef(false);

  const [state, action, pending] = useActionState(
    updateAdvertiserBusinessAction,
    {
      success: false,
      message: "",
      data: {
        companyName: companyName ?? "",
        industry: industry ?? "",
        website: website ?? "",
      },
    }
  );

  useEffect(() => {
    if (state.success && !prevSuccessRef.current) {
      toast.success("Business information updated successfully");
    }
    prevSuccessRef.current = state.success;
  }, [state.success]);

  return (
    <form action={action} className="space-y-6">
      <FieldGroup>
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
            The name of your business or organization.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="industry">Industry</FieldLabel>
          <Select name="industry" defaultValue={state.data.industry}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRY_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldDescription>
            The industry that best describes your business.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="website">Website</FieldLabel>
          <Input
            id="website"
            name="website"
            type="url"
            placeholder="https://www.example.com"
            defaultValue={state.data.website ?? ""}
          />
          <FieldDescription>Your business website URL.</FieldDescription>
        </Field>

        {state.message && !state.success && (
          <Field>
            <p className="text-destructive text-sm" aria-live="polite">
              {state.message}
            </p>
          </Field>
        )}

        <Field>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save Changes"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
