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
import { updateSpaceOwnerBusinessAction } from "../settings.actions";
import { PayoutSchedule } from "@/types/gql/graphql";
import { toast } from "sonner";
import { BUSINESS_TYPES, PAYOUT_SCHEDULE_LABELS } from "../constants";

type Props = {
  businessName?: string | null;
  businessType?: string | null;
  payoutSchedule?: PayoutSchedule | null;
};

export default function SpaceOwnerBusinessForm({
  businessName,
  businessType,
  payoutSchedule,
}: Props) {
  const prevSuccessRef = useRef(false);

  const [state, action, pending] = useActionState(
    updateSpaceOwnerBusinessAction,
    {
      success: false,
      message: "",
      data: {
        businessName: businessName ?? "",
        businessType: businessType ?? "",
        payoutSchedule: payoutSchedule ?? PayoutSchedule.Weekly,
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
          <FieldLabel htmlFor="businessName">Business Name</FieldLabel>
          <Input
            id="businessName"
            name="businessName"
            type="text"
            placeholder="Your Business Name"
            defaultValue={state.data.businessName}
          />
          <FieldDescription>
            The name of your business or property.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="businessType">Business Type</FieldLabel>
          <Select name="businessType" defaultValue={state.data.businessType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a business type" />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldDescription>
            The type of business you operate at your space location.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="payoutSchedule">Payout Schedule</FieldLabel>
          <Select
            name="payoutSchedule"
            defaultValue={state.data.payoutSchedule}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select payout frequency" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PAYOUT_SCHEDULE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldDescription>
            How often you want to receive your earnings.
          </FieldDescription>
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
