import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/primitives/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { cn } from "@/lib/utils";

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
  children: React.ReactNode;
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