"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import { Separator } from "@/components/primitives/separator";
import {
  IconCreditCard,
  IconCheck,
  IconTrash,
  IconPlus,
} from "@tabler/icons-react";
import { toast } from "sonner";
import {
  setDefaultPaymentMethodAction,
  deletePaymentMethodAction,
} from "../settings.actions";
import { CARD_BRAND_NAMES } from "../constants";
import AddCardDialog from "./add-card-dialog";

type PaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
};

type Props = {
  paymentMethods: PaymentMethod[];
};

export default function PaymentSettingsForm({ paymentMethods }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [defaultPending, startDefaultTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();

  function handleSetDefault(id: string) {
    setPendingId(id);
    startDefaultTransition(async () => {
      const result = await setDefaultPaymentMethodAction(id);
      setPendingId(null);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Default payment method updated");
    });
  }

  function handleDelete(id: string) {
    setPendingId(id);
    startDeleteTransition(async () => {
      const result = await deletePaymentMethodAction(id);
      setPendingId(null);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Payment method removed");
    });
  }

  const isPending = (id: string) =>
    pendingId === id && (defaultPending || deletePending);

  return (
    <div className="space-y-6">
      {paymentMethods.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="bg-muted flex size-12 items-center justify-center rounded-full">
            <IconCreditCard className="text-muted-foreground size-6" />
          </div>
          <div>
            <p className="font-medium">No payment methods</p>
            <p className="text-muted-foreground text-sm">
              Add a card to make payments for bookings
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <IconPlus className="size-4" />
            Add Payment Method
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between rounded-md border p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-muted flex size-10 items-center justify-center rounded-full">
                    <IconCreditCard className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {CARD_BRAND_NAMES[method.brand?.toLowerCase() ?? ""] ??
                          CARD_BRAND_NAMES.unknown}{" "}
                        •••• {method.last4}
                      </span>
                      {method.isDefault && (
                        <Badge variant="secondary" className="gap-1">
                          <IconCheck className="size-3" />
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Expires {method.expMonth?.toString().padStart(2, "0")}/
                      {method.expYear?.toString().slice(-2)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                      disabled={isPending(method.id)}
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(method.id)}
                    disabled={isPending(method.id)}
                  >
                    <IconTrash className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <Button
            variant="outline"
            onClick={() => setDialogOpen(true)}
            className="gap-2"
          >
            <IconPlus className="size-4" />
            Add Payment Method
          </Button>
        </>
      )}

      <AddCardDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
