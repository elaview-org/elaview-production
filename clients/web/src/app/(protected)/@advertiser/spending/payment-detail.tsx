"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { IconDownload, IconExternalLink } from "@tabler/icons-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/primitives/sheet";
import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import { Separator } from "@/components/primitives/separator";
import { Input } from "@/components/primitives/input";
import { Textarea } from "@/components/primitives/textarea";
import { Field, FieldGroup, FieldLabel } from "@/components/primitives/field";
import { PAYMENT_STATUS } from "@/lib/core/constants";
import { formatCurrency, formatDate } from "@/lib/core/utils";
import { PaymentStatus } from "@/types/gql";
import { PAYMENT_TYPE_LABELS } from "./constants";
import { requestRefundAction } from "./spending.actions";
import type { PaymentData } from "./payments-table";

type Props = {
  payment: PaymentData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function PaymentDetail({ payment, open, onOpenChange }: Props) {
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [isPending, startTransition] = useTransition();

  if (!payment) return null;

  const status = payment.status as PaymentStatus;
  const canRefund = status === PaymentStatus.Succeeded;

  function handleRefund() {
    const amount = Number(refundAmount);
    if (!amount || amount <= 0 || amount > Number(payment!.amount)) {
      toast.error("Invalid refund amount");
      return;
    }
    if (!refundReason.trim()) {
      toast.error("Please provide a reason for the refund");
      return;
    }

    startTransition(async () => {
      const result = await requestRefundAction(
        payment!.id,
        amount,
        refundReason.trim()
      );
      if (result.success) {
        toast.success("Refund request submitted");
        setShowRefundForm(false);
        setRefundAmount("");
        setRefundReason("");
        onOpenChange(false);
      } else {
        toast.error(result.error ?? "Failed to request refund");
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            {formatCurrency(Number(payment.amount), { decimals: true })}
            <Badge variant={PAYMENT_STATUS.variants[status] ?? "outline"}>
              {PAYMENT_STATUS.labels[status] ?? payment.status}
            </Badge>
          </SheetTitle>
          <SheetDescription>
            {PAYMENT_TYPE_LABELS[payment.type] ?? payment.type}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4">
          <div className="flex flex-col gap-2">
            <DetailRow
              label="Created"
              value={formatDate(payment.createdAt, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            />
            {payment.paidAt && (
              <DetailRow
                label="Paid"
                value={formatDate(payment.paidAt, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              />
            )}
            <DetailRow
              label="Type"
              value={PAYMENT_TYPE_LABELS[payment.type] ?? payment.type}
            />
          </div>

          {payment.booking && (
            <>
              <Separator />
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-medium">Booking</h4>
                {payment.booking.space && (
                  <DetailRow
                    label="Space"
                    value={payment.booking.space.title}
                  />
                )}
                {payment.booking.campaign && (
                  <DetailRow
                    label="Campaign"
                    value={payment.booking.campaign.name}
                  />
                )}
              </div>
            </>
          )}

          <Separator />

          <div className="flex flex-col gap-2">
            {payment.booking && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/bookings/${payment.booking.id}`}>
                  <IconExternalLink className="size-4" />
                  View Booking
                </Link>
              </Button>
            )}
            {payment.receiptUrl && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={payment.receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconDownload className="size-4" />
                  Download Receipt
                </a>
              </Button>
            )}
          </div>

          {canRefund && (
            <>
              <Separator />
              {showRefundForm ? (
                <div className="flex flex-col gap-3">
                  <h4 className="text-sm font-medium">Request Refund</h4>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="refund-amount">Amount</FieldLabel>
                      <Input
                        id="refund-amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        max={Number(payment.amount)}
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(e.target.value)}
                        placeholder={`Max ${formatCurrency(Number(payment.amount), { decimals: true })}`}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="refund-reason">Reason</FieldLabel>
                      <Textarea
                        id="refund-reason"
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                        placeholder="Describe why you're requesting a refund"
                        rows={3}
                      />
                    </Field>
                  </FieldGroup>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleRefund}
                      disabled={isPending}
                    >
                      {isPending ? "Submitting..." : "Submit Request"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowRefundForm(false)}
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRefundForm(true)}
                >
                  Request Refund
                </Button>
              )}
            </>
          )}
        </div>

        <SheetFooter />
      </SheetContent>
    </Sheet>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
