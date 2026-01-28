"use client";

import { Button } from "@/components/primitives/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/primitives/field";
import { Badge } from "@/components/primitives/badge";
import { Separator } from "@/components/primitives/separator";
import type { SpaceOwnerSettingsQuery } from "@/types/gql/graphql";
import {
  IconBrandStripe,
  IconCheck,
  IconExternalLink,
  IconAlertCircle,
} from "@tabler/icons-react";

type Props = {
  user: NonNullable<SpaceOwnerSettingsQuery["me"]>;
};

export default function PayoutSettingsForm({ user }: Props) {
  const profile = user.spaceOwnerProfile;
  const isConnected = !!profile?.stripeAccountId;
  const accountStatus = profile?.stripeAccountStatus;

  const getStatusBadge = () => {
    if (!isConnected) {
      return <Badge variant="secondary">Not Connected</Badge>;
    }
    if (accountStatus === "complete") {
      return (
        <Badge variant="default" className="gap-1">
          <IconCheck className="size-3" />
          Active
        </Badge>
      );
    }
    if (accountStatus === "pending") {
      return (
        <Badge variant="secondary" className="gap-1">
          <IconAlertCircle className="size-3" />
          Pending Verification
        </Badge>
      );
    }
    return (
      <Badge variant="destructive" className="gap-1">
        <IconAlertCircle className="size-3" />
        Action Required
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel>Stripe Connect Status</FieldLabel>
          <div className="flex items-center gap-3 rounded-md border p-4">
            <div className="bg-muted flex size-10 items-center justify-center rounded-full">
              <IconBrandStripe className="size-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">Stripe Connect</span>
                {getStatusBadge()}
              </div>
              <p className="text-muted-foreground text-sm">
                {isConnected
                  ? `Account ID: ${profile?.stripeAccountId?.slice(0, 16)}...`
                  : "Connect your Stripe account to receive payouts"}
              </p>
            </div>
          </div>
        </Field>

        {!isConnected && (
          <Field>
            <Button type="button" className="gap-2" disabled>
              <IconBrandStripe className="size-4" />
              Connect Stripe Account
            </Button>
            <FieldDescription>
              Stripe Connect integration coming soon. You&apos;ll be able to
              receive payouts directly to your bank account.
            </FieldDescription>
          </Field>
        )}

        {isConnected && (
          <>
            <Separator />

            <Field>
              <FieldLabel>Bank Account</FieldLabel>
              <div className="space-y-3 rounded-md border p-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">
                    Account Type
                  </span>
                  <span className="text-sm font-medium">Checking</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">
                    Account Number
                  </span>
                  <span className="text-sm font-medium">••••••1234</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">
                    Routing Number
                  </span>
                  <span className="text-sm font-medium">••••••5678</span>
                </div>
              </div>
              <FieldDescription>
                Your bank account information is securely stored by Stripe.
              </FieldDescription>
            </Field>

            <Field>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  disabled
                >
                  <IconExternalLink className="size-4" />
                  View Stripe Dashboard
                </Button>
                <Button type="button" variant="outline" disabled>
                  Update Bank Account
                </Button>
                <Button type="button" variant="ghost" disabled>
                  Disconnect
                </Button>
              </div>
              <FieldDescription>
                Stripe dashboard and account management coming soon.
              </FieldDescription>
            </Field>
          </>
        )}
      </FieldGroup>
    </div>
  );
}
