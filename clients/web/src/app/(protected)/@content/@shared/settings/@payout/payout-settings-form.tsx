"use client";

import { useTransition } from "react";
import { Button } from "@/components/primitives/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/primitives/field";
import { Badge } from "@/components/primitives/badge";
import { Separator } from "@/components/primitives/separator";
import {
  IconBrandStripe,
  IconCheck,
  IconExternalLink,
  IconAlertCircle,
  IconRefresh,
} from "@tabler/icons-react";
import { toast } from "sonner";
import {
  connectStripeAction,
  disconnectStripeAction,
  refreshStripeStatusAction,
} from "../settings.actions";

type Props = {
  stripeAccountId?: string | null;
  stripeAccountStatus?: string | null;
};

export default function PayoutSettingsForm({
  stripeAccountId,
  stripeAccountStatus,
}: Props) {
  const [connectPending, startConnectTransition] = useTransition();
  const [refreshPending, startRefreshTransition] = useTransition();
  const [disconnectPending, startDisconnectTransition] = useTransition();
  const isConnected = !!stripeAccountId;

  function handleConnect() {
    startConnectTransition(async () => {
      try {
        const result = await connectStripeAction();
        if (result.error) {
          toast.error(result.error);
          return;
        }
        if (result.onboardingUrl) {
          window.location.href = result.onboardingUrl;
          return;
        }
        toast.error("Failed to connect Stripe account");
      } catch {
        toast.error("Failed to connect Stripe account. Please try again.");
      }
    });
  }

  function handleDisconnect() {
    startDisconnectTransition(async () => {
      const result = await disconnectStripeAction();
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Stripe account disconnected");
    });
  }

  function handleRefreshStatus() {
    startRefreshTransition(async () => {
      const result = await refreshStripeStatusAction();
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Stripe account status refreshed");
    });
  }

  const getStatusBadge = () => {
    if (!isConnected) {
      return <Badge variant="secondary">Not Connected</Badge>;
    }
    if (stripeAccountStatus === "complete") {
      return (
        <Badge variant="default" className="gap-1">
          <IconCheck className="size-3" />
          Active
        </Badge>
      );
    }
    if (stripeAccountStatus === "pending") {
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
                  ? `Account ID: ${stripeAccountId?.slice(0, 16)}...`
                  : "Connect your Stripe account to receive payouts"}
              </p>
            </div>
          </div>
        </Field>

        {!isConnected && (
          <Field>
            <Button
              type="button"
              className="gap-2"
              onClick={handleConnect}
              disabled={connectPending}
            >
              <IconBrandStripe className="size-4" />
              {connectPending ? "Connecting..." : "Connect Stripe Account"}
            </Button>
            <FieldDescription>
              You&apos;ll be redirected to Stripe to complete onboarding and
              start receiving payouts.
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
                  asChild
                >
                  <a
                    href="https://dashboard.stripe.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconExternalLink className="size-4" />
                    View Stripe Dashboard
                  </a>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={handleRefreshStatus}
                  disabled={refreshPending}
                >
                  <IconRefresh className="size-4" />
                  {refreshPending ? "Refreshing..." : "Refresh Status"}
                </Button>
                <Button type="button" variant="outline" disabled>
                  Update Bank Account
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleDisconnect}
                  disabled={disconnectPending}
                >
                  {disconnectPending ? "Disconnecting..." : "Disconnect"}
                </Button>
              </div>
              <FieldDescription>
                Bank account updates are managed through the Stripe dashboard.
              </FieldDescription>
            </Field>
          </>
        )}
      </FieldGroup>
    </div>
  );
}
