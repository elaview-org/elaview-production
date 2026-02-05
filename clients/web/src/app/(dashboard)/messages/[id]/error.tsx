"use client";

import ErrorState from "@/components/status/error-state";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <ErrorState
        title="Failed to load conversation"
        message={error.message || "Something went wrong. Please try again."}
        actionLabel="Try again"
        onAction={reset}
      />
    </div>
  );
}
