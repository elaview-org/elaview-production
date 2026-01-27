import {
  IconTrendingUp,
  IconStar,
  IconCalendar,
  IconCurrencyDollar,
  IconAlertTriangle,
} from "@tabler/icons-react";
import Link from "next/link";
import { Skeleton } from "@/components/primitives/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { Badge } from "@/components/primitives/badge";
import { cn, formatCurrency } from "@/lib/utils";
import mock from "./mock.json";

type PerformerCardProps = {
  icon: React.ReactNode;
  title: string;
  spaceName: string;
  spaceId: string;
  value: string;
  subtitle?: string;
  variant?: "default" | "warning";
};

function PerformerCard({
  icon,
  title,
  spaceName,
  spaceId,
  value,
  subtitle,
  variant = "default",
}: PerformerCardProps) {
  return (
    <Link
      href={`/listings/${spaceId}`}
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50",
        variant === "warning" && "border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20"
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
        <span className="truncate font-medium">{spaceName}</span>
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

export function TopPerformersSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border p-6">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 gap-4 @lg/main:grid-cols-2 @3xl/main:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border p-4">
            <Skeleton className="size-10 rounded-lg" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TopPerformers() {
  const { topPerformers } = mock;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performers</CardTitle>
        <CardDescription>
          Your best performing spaces and areas that need attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 @lg/main:grid-cols-2 @3xl/main:grid-cols-3">
          <PerformerCard
            icon={<IconCurrencyDollar className="size-5" />}
            title="Highest Revenue"
            spaceName={topPerformers.bestRevenue.title}
            spaceId={topPerformers.bestRevenue.id}
            value={formatCurrency(topPerformers.bestRevenue.value)}
            subtitle={`+${topPerformers.bestRevenue.change}%`}
          />
          <PerformerCard
            icon={<IconStar className="size-5" />}
            title="Best Rated"
            spaceName={topPerformers.bestRating.title}
            spaceId={topPerformers.bestRating.id}
            value={`★ ${topPerformers.bestRating.value}`}
            subtitle={`${topPerformers.bestRating.reviews} reviews`}
          />
          <PerformerCard
            icon={<IconCalendar className="size-5" />}
            title="Highest Occupancy"
            spaceName={topPerformers.bestOccupancy.title}
            spaceId={topPerformers.bestOccupancy.id}
            value={`${topPerformers.bestOccupancy.value}%`}
            subtitle={`+${topPerformers.bestOccupancy.change}%`}
          />
          <PerformerCard
            icon={<IconTrendingUp className="size-5" />}
            title="Most Bookings"
            spaceName={topPerformers.mostBookings.title}
            spaceId={topPerformers.mostBookings.id}
            value={topPerformers.mostBookings.value.toString()}
            subtitle={`+${topPerformers.mostBookings.change}%`}
          />
          <PerformerCard
            icon={<IconAlertTriangle className="size-5" />}
            title="Needs Attention"
            spaceName={topPerformers.needsAttention.title}
            spaceId={topPerformers.needsAttention.id}
            value={`${topPerformers.needsAttention.occupancy}%`}
            subtitle={`${topPerformers.needsAttention.bookings} bookings`}
            variant="warning"
          />
        </div>
      </CardContent>
    </Card>
  );
}