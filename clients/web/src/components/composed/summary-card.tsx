import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/primitives/badge";
import { Skeleton } from "@/components/primitives/skeleton";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type TrendBadge = {
  type: "trend";
  value: number;
};

type TextBadge = {
  type: "text";
  text: string;
  className?: string;
};

type BadgeConfig = TrendBadge | TextBadge;

type Props = {
  label: string;
  value: string;
  badge?: BadgeConfig;
  footer: string;
  description: string;
  showFooterIcon?: boolean;
};

//this summary card they should perform also skeleton

export default function SummaryCard({
  label,
  value,
  badge,
  footer,
  description,
  showFooterIcon = true,
}: Props) {
  const trend =
    badge?.type === "trend"
      ? badge.value > 0
        ? "up"
        : badge.value < 0
          ? "down"
          : "neutral"
      : null;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        <CardAction>
          {badge?.type === "trend" && trend !== "neutral" && (
            <Badge variant="outline">
              {trend === "up" ? <IconTrendingUp /> : <IconTrendingDown />}
              {badge.value > 0 ? "+" : ""}
              {badge.value.toFixed(1)}%
            </Badge>
          )}
          {badge?.type === "text" && (
            <Badge variant="outline" className={badge.className}>
              {badge.text}
            </Badge>
          )}
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {footer}
          {showFooterIcon && trend === "up" && (
            <IconTrendingUp className="size-4" />
          )}
          {showFooterIcon && trend === "down" && (
            <IconTrendingDown className="size-4" />
          )}
        </div>
        <div className="text-muted-foreground">{description}</div>
      </CardFooter>
    </Card>
  );
}

type GridProps = {
  children: ReactNode;
  className?: string;
};

export function SummaryCardGrid({ children, className }: GridProps) {
  return (
    <div
      className={cn(
        "*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SummaryCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border p-6">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}
