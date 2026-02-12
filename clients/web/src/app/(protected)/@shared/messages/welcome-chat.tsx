import { cn } from "@/lib/core/utils";

type Props = {
  className?: string;
};

export function WelcomeChat({ className }: Props) {
  return (
    <div
      className={cn(
        "bg-muted/30 flex-1 flex-col items-center justify-center p-4 sm:p-6 md:p-8",
        className
      )}
    >
      <div className="flex w-full max-w-md flex-col items-center gap-4 text-center sm:gap-6">
        {/* Icon */}
        <div className="bg-primary/10 flex size-16 items-center justify-center rounded-full sm:size-20">
          <svg
            className="text-primary size-8 sm:size-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="space-y-1.5 sm:space-y-2">
          <h2 className="text-foreground text-xl font-semibold sm:text-2xl">
            Welcome to Messages
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
            Select a conversation from the list to start messaging with space
            owners about your bookings.
          </p>
        </div>

        {/* Features */}
        <div className="mt-3 grid w-full grid-cols-1 gap-3 text-left sm:mt-4 sm:grid-cols-2 sm:gap-4">
          <div className="bg-background flex items-start gap-2.5 rounded-lg border p-3 sm:gap-3 sm:p-4">
            <div className="bg-primary/10 flex size-7 shrink-0 items-center justify-center rounded-md sm:size-8">
              <svg
                className="text-primary size-3.5 sm:size-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-foreground text-sm font-medium sm:text-base">
                Track Bookings
              </h3>
              <p className="text-muted-foreground mt-0.5 text-xs sm:mt-1 sm:text-sm">
                Communicate about installation and verification
              </p>
            </div>
          </div>

          <div className="bg-background flex items-start gap-2.5 rounded-lg border p-3 sm:gap-3 sm:p-4">
            <div className="bg-primary/10 flex size-7 shrink-0 items-center justify-center rounded-md sm:size-8">
              <svg
                className="text-primary size-3.5 sm:size-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-foreground text-sm font-medium sm:text-base">
                Share Files
              </h3>
              <p className="text-muted-foreground mt-0.5 text-xs sm:mt-1 sm:text-sm">
                Upload creative files and attachments
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
