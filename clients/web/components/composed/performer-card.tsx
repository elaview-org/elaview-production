import { ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/primitives/badge";
import { Skeleton } from "@/components/primitives/skeleton";
import { cn } from "@/lib/utils";

type Props = {
  icon: ReactNode;
  title: string;
  name: string;
  href: string;
  value: string;
  subtitle?: string;
  variant?: "default" | "warning";
  className?: string;
};

export default function PerformerCard({
  icon,
  title,
  name,
  href,
  value,
  subtitle,
  variant = "default",
  className,
}: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50",
        variant === "warning" && "border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20",
        className
      )}
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg",
          variant === "default" && "bg-primary/10 text-primary",
          variant === "warning" && "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
        )}
      >
        {icon}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-muted-foreground text-xs">{title}</span>
        <span className="truncate font-medium">{name}</span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold tabular-nums">{value}</span>
          {subtitle && (
            <Badge variant="outline" className="text-xs">
              {subtitle}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
}

export function PerformerCardSkeleton() {
  return (
    <div className="flex items-start gap-3 rounded-lg border p-4">
      <Skeleton className="size-10 rounded-lg" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  );
}