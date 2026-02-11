"use client";

import ErrorState from "@/components/status/error-state";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ reset }: Props) {
  return <ErrorState onAction={reset} />;
}
