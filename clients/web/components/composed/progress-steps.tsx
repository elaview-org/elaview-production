import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/primitives/skeleton";

type Props = {
  steps: string[];
  currentStep: number;
  className?: string;
};

export default function ProgressSteps({ steps, currentStep, className }: Props) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={cn(
              "flex size-5 items-center justify-center rounded-full text-xs font-medium",
              index < currentStep
                ? "bg-primary text-primary-foreground"
                : index === currentStep
                  ? "bg-primary/20 text-primary ring-2 ring-primary"
                  : "bg-muted text-muted-foreground"
            )}
          >
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "h-0.5 w-4",
                index < currentStep ? "bg-primary" : "bg-muted"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function ProgressStepsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center">
          <Skeleton className="size-5 rounded-full" />
          {i < count - 1 && <Skeleton className="h-0.5 w-4" />}
        </div>
      ))}
    </div>
  );
}