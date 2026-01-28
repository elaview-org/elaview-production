import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/primitives/button";

type Props = {
  image?: string;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export default function ErrorState({
  image = "/common/error.svg",
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  actionLabel = "Try again",
  onAction,
  className,
}: Props) {
  return (
    <div
      data-slot="error-state"
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 p-8 text-center",
        className
      )}
    >
      <Image src={image} alt="" width={180} height={140} className="h-auto" />
      <div className="flex max-w-xs flex-col gap-2">
        <h3 className="text-xl font-semibold tracking-tight">
          {ensurePeriod(title)}
        </h3>
        <p className="text-sm text-foreground/80 text-balance">
          {ensurePeriod(message)}
        </p>
      </div>
      {onAction && (
        <Button
          variant="warning"
          className="w-full max-w-xs rounded-full"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

function ensurePeriod(text: string) {
  return text.endsWith(".") ? text : `${text}.`;
}
