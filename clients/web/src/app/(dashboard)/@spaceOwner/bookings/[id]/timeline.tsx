import { IconCheck, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/core/utils";
import type { BookingStatus } from "@/types/gql/graphql";
import {
  TIMELINE_STEPS,
  TERMINAL_STATUSES,
  isStepComplete,
  isStepCurrent,
} from "./constants";

type Props = {
  status: BookingStatus;
};

export default function Timeline({ status }: Props) {
  const isTerminal = TERMINAL_STATUSES.includes(
    status as (typeof TERMINAL_STATUSES)[number]
  );

  if (isTerminal) {
    return <TerminalStatus status={status} />;
  }

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center justify-between">
        {TIMELINE_STEPS.map((step, index) => {
          const isComplete = isStepComplete(step.status, status);
          const isCurrent = isStepCurrent(step.status, status);
          const isLast = index === TIMELINE_STEPS.length - 1;

          return (
            <div key={step.status} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border-2 text-sm font-medium",
                    isComplete &&
                      "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-primary bg-primary/10 text-primary",
                    !isComplete &&
                      !isCurrent &&
                      "border-muted text-muted-foreground"
                  )}
                >
                  {isComplete ? <IconCheck className="size-4" /> : index + 1}
                </div>
                <div className="flex flex-col items-center gap-0.5 text-center">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      (isComplete || isCurrent) && "text-foreground",
                      !isComplete && !isCurrent && "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                  {isCurrent && (
                    <span className="text-muted-foreground max-w-24 text-[10px]">
                      {step.description}
                    </span>
                  )}
                </div>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "mx-2 h-0.5 flex-1",
                    isComplete ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TerminalStatus({ status }: { status: BookingStatus }) {
  const messages: Record<string, { title: string; description: string }> = {
    REJECTED: {
      title: "Booking Rejected",
      description: "This booking request was rejected.",
    },
    CANCELLED: {
      title: "Booking Cancelled",
      description: "This booking was cancelled.",
    },
    DISPUTED: {
      title: "Booking Disputed",
      description: "This booking is under dispute review.",
    },
  };

  const message = messages[status] ?? {
    title: "Status Unknown",
    description: "Unable to determine booking status.",
  };

  return (
    <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-6">
      <div className="flex items-center gap-3">
        <div className="bg-destructive/20 text-destructive flex size-8 items-center justify-center rounded-full">
          <IconX className="size-4" />
        </div>
        <div>
          <p className="text-destructive font-medium">{message.title}</p>
          <p className="text-muted-foreground text-sm">{message.description}</p>
        </div>
      </div>
    </div>
  );
}
