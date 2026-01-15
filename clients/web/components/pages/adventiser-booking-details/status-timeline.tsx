import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperSeparator,
  StepperTrigger,
  StepperTitle,
} from "@/components/stepper";
import { Check, Loader2 } from "lucide-react";

export type BookingStepStatus =
  | "confirmed"
  | "paid"
  | "installed"
  | "review"
  | "completed";

interface BookingStep {
  id: BookingStepStatus;
  title: string;
}

const BOOKING_STEPS: BookingStep[] = [
  { id: "confirmed", title: "Confirmed" },
  { id: "paid", title: "Paid" },
  { id: "installed", title: "Installed" },
  { id: "review", title: "Review" },
  { id: "completed", title: "Completed" },
];

interface StatusTimelineProps {
  /**
   * Current active step (1-indexed). Defaults to 1.
   * Steps before this will be marked as completed.
   */
  currentStep?: number;
}

function StatusTimeline({ currentStep = 1 }: StatusTimelineProps) {
  const activeStep = Math.max(1, Math.min(currentStep, BOOKING_STEPS.length));

  return (
    <Stepper
      defaultValue={activeStep}
      indicators={{
        completed: <Check className="size-4" />,
        loading: <Loader2 className="size-4 animate-spin" />,
      }}
      className="space-y-8 py-4"
    >
      <StepperNav>
        {BOOKING_STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isLastStep = index === BOOKING_STEPS.length - 1;

          return (
            <StepperItem
              key={step.id}
              step={stepNumber}
              className="relative flex-1 items-start"
            >
              <StepperTrigger className="flex flex-col gap-2.5">
                <StepperIndicator>{stepNumber}</StepperIndicator>
                <StepperTitle>{step.title}</StepperTitle>
              </StepperTrigger>
              {!isLastStep && (
                <StepperSeparator className="group-data-[state=completed]/step:bg-primary absolute inset-x-0 top-3 left-[calc(50%+0.875rem)] m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem+0.225rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none" />
              )}
            </StepperItem>
          );
        })}
      </StepperNav>
    </Stepper>
  );
}

export default StatusTimeline;
