import { IconStar, IconEye, IconCalendar, IconChartBar } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { Skeleton } from "@/components/primitives/skeleton";
import { cn } from "@/lib/utils";
import mock from "./mock.json";

type TopSpace = {
  id: string;
  title: string;
  image: string;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number | null;
  views: number;
  occupancyRate: number;
  status: string;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
  }).format(amount);
}

function formatNumber(num: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(num);
}

const RANK_STYLES = [
  "bg-yellow-500 text-yellow-950",
  "bg-zinc-400 text-zinc-950",
  "bg-amber-600 text-amber-950",
] as const;

function SpaceCard({ space, rank }: { space: TopSpace; rank: number }) {
  const rankStyle = rank <= 3 ? RANK_STYLES[rank - 1] : "bg-muted text-muted-foreground";

  return (
    <Link
      href={`/listings/${space.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border transition-colors hover:bg-muted/50"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={space.image}
          alt={space.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div
          className={cn(
            "absolute left-2 top-2 flex size-6 items-center justify-center rounded-full text-xs font-bold",
            rankStyle
          )}
        >
          {rank}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <span className="line-clamp-1 font-medium">{space.title}</span>
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-primary">
            {formatCurrency(space.totalRevenue)}
          </span>
          {space.averageRating !== null && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <IconStar className="size-3.5 fill-yellow-400 text-yellow-400" />
              {space.averageRating.toFixed(1)}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <IconCalendar className="size-3" />
            {space.totalBookings} bookings
          </span>
          <span className="flex items-center gap-1">
            <IconEye className="size-3" />
            {formatNumber(space.views)}
          </span>
          <span className="flex items-center gap-1">
            <IconChartBar className="size-3" />
            {space.occupancyRate}%
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function TopSpaces() {
  const spaces = mock.topSpaces as TopSpace[];

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Top Spaces</CardTitle>
          <CardDescription>Your best performing spaces</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/listings">View All</Link>
        </Button>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid grid-cols-1 gap-3 @md/main:grid-cols-2 @lg/main:grid-cols-1 @2xl/main:grid-cols-2 @4xl/main:grid-cols-3">
          {spaces.slice(0, 5).map((space, index) => (
            <SpaceCard key={space.id} space={space} rank={index + 1} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function TopSpacesSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-44" />
        </div>
        <Skeleton className="h-9 w-20" />
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid grid-cols-1 gap-3 @md/main:grid-cols-2 @lg/main:grid-cols-1 @2xl/main:grid-cols-2 @4xl/main:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded-lg border">
              <Skeleton className="aspect-[16/9] w-full rounded-none" />
              <div className="flex flex-col gap-2 p-3">
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-10" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}