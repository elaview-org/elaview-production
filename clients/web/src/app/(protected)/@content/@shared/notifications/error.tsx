"use client";

import ErrorState from "@/components/status/error-state";

type Props = {
  error: Error;
  reset: () => void;
};

export default function Error({ reset }: Props) {
  return (
    <ErrorState
      title="Failed to load notifications"
      message="We couldn't load your notifications. Please try again."
      onAction={reset}
    />
  );
}
