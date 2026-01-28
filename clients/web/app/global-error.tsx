"use client";

import ErrorState from "@/components/status/error-state";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ reset }: Props) {
  return (
    <html>
      <body className="flex min-h-screen items-center justify-center">
        <ErrorState onAction={reset} />
      </body>
    </html>
  );
}
