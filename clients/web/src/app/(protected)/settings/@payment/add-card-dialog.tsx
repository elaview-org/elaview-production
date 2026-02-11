"use client";

import { useState, useTransition } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/primitives/dialog";
import { Button } from "@/components/primitives/button";
import { toast } from "sonner";
import env from "@/lib/core/env";
import {
  createSetupIntentAction,
  confirmSetupIntentAction,
} from "../settings.actions";

const stripePromise = loadStripe(env.client.stripePublishableKey);

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AddCardDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogDescription>
            Add a card to use for booking payments
          </DialogDescription>
        </DialogHeader>
        <Elements stripe={stripePromise}>
          <CardForm onSuccess={() => onOpenChange(false)} />
        </Elements>
      </DialogContent>
    </Dialog>
  );
}

function CardForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setError(null);
    startTransition(async () => {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError("Card element not found");
        return;
      }

      const setupResult = await createSetupIntentAction();
      if (setupResult.error) {
        setError(setupResult.error);
        return;
      }

      if (!setupResult.clientSecret || !setupResult.setupIntentId) {
        setError("Failed to create setup intent");
        return;
      }

      const { error: stripeError } = await stripe.confirmCardSetup(
        setupResult.clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message ?? "Failed to add card");
        return;
      }

      const confirmResult = await confirmSetupIntentAction(
        setupResult.setupIntentId
      );
      if (confirmResult.error) {
        setError(confirmResult.error);
        return;
      }

      toast.success("Payment method added");
      onSuccess();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-md border p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "hsl(var(--foreground))",
                "::placeholder": {
                  color: "hsl(var(--muted-foreground))",
                },
              },
            },
          }}
        />
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={!stripe || pending}>
          {pending ? "Adding..." : "Add Card"}
        </Button>
      </div>
    </form>
  );
}
