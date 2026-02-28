"use client";

import { useTransition } from "react";
import {
  requestWithdrawalAction,
  retryPayoutAction,
  WithdrawalActionResult,
  PayoutActionResult,
} from "./earnings.actions";

function useRequestWithdrawal() {
  const [isPending, startTransition] = useTransition();

  function requestWithdrawal(
    amount?: number,
    onResult?: (result: WithdrawalActionResult) => void
  ) {
    startTransition(async () => {
      const result = await requestWithdrawalAction(amount);
      onResult?.(result);
    });
  }
  return { requestWithdrawal, isPending };
}

function useRetryPayout() {
  const [isPending, startTransition] = useTransition();
  function retryPayout(
    payoutId: string,
    onResult?: (result: PayoutActionResult) => void
  ) {
    startTransition(async () => {
      const result = await retryPayoutAction(payoutId);

      onResult?.(result);
    });
  }
  return {
    retryPayout,
    isPending,
  };
}

const earnings = {
  useRetryPayout,
  useRequestWithdrawal,
};

export default earnings;
