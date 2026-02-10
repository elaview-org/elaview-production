"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/primitives/dialog";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import { Label } from "@/components/primitives/label";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/core/utils";
import { requestWithdrawalAction } from "./earnings.actions";

type Props = {
  availableBalance: number;
  stripeConnected: boolean;
};

export default function WithdrawDialog({
  availableBalance,
  stripeConnected,
}: Props) {
  const [open, setOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [pending, startTransition] = useTransition();

  const canWithdraw = stripeConnected && availableBalance > 0;
  const parsedAmount = parseFloat(customAmount);
  const isValidCustomAmount =
    !customAmount || (parsedAmount > 0 && parsedAmount <= availableBalance);

  function handleWithdraw(withdrawAll: boolean) {
    const amount = withdrawAll ? undefined : parsedAmount;

    if (!withdrawAll && (!parsedAmount || parsedAmount <= 0)) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!withdrawAll && parsedAmount > availableBalance) {
      toast.error("Amount exceeds available balance");
      return;
    }

    startTransition(async () => {
      const result = await requestWithdrawalAction(amount);

      if (result.success) {
        toast.success(
          `Withdrawal of ${formatCurrency(amount ?? availableBalance, { decimals: true })} requested`
        );
        setOpen(false);
        setCustomAmount("");
      } else {
        toast.error(result.error ?? "Failed to request withdrawal");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" disabled={!canWithdraw}>
          Withdraw
        </Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            Transfer your available balance to your connected Stripe account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-muted-foreground text-sm">Available Balance</p>
            <p className="text-2xl font-semibold">
              {formatCurrency(availableBalance, { decimals: true })}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Custom Amount (optional)</Label>
            <div className="relative">
              <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
                $
              </span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                className="pl-7"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                min={0}
                max={availableBalance}
                step={0.01}
                disabled={pending}
              />
            </div>
            {customAmount && !isValidCustomAmount && (
              <p className="text-destructive text-sm">
                Amount must be between $0.01 and{" "}
                {formatCurrency(availableBalance, { decimals: true })}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={pending}
          >
            Cancel
          </Button>
          {customAmount && isValidCustomAmount ? (
            <Button onClick={() => handleWithdraw(false)} disabled={pending}>
              {pending
                ? "Processing..."
                : `Withdraw ${formatCurrency(parsedAmount, { decimals: true })}`}
            </Button>
          ) : (
            <Button onClick={() => handleWithdraw(true)} disabled={pending}>
              {pending ? "Processing..." : "Withdraw All"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
