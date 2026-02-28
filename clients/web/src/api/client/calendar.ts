"use client";

import { useTransition } from "react";
import { blockDatesAction, unblockDatesAction } from "./calendar.actions";

type SimpleResult = { success: boolean; error: string | null };

function useBlockDates() {
  const [isPending, startTransition] = useTransition();

  function blockDates(
    spaceId: string,
    dates: string[],
    reason?: string,
    onResult?: (result: SimpleResult) => void
  ) {
    startTransition(async () => {
      const result = await blockDatesAction(spaceId, dates, reason);
      onResult?.(result);
    });
  }

  return { blockDates, isPending };
}

function useUnblockDates() {
  const [isPending, startTransition] = useTransition();

  function unblockDates(
    spaceId: string,
    dates: string[],
    onResult?: (result: SimpleResult) => void
  ) {
    startTransition(async () => {
      const result = await unblockDatesAction(spaceId, dates);
      onResult?.(result);
    });
  }

  return { unblockDates, isPending };
}

const calendar = {
  useBlockDates,
  useUnblockDates,
};
export default calendar;
