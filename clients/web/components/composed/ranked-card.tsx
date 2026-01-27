import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/primitives/skeleton";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  image: string;
  alt: string;
  title: string;
  rank: number;
  primaryValue: ReactNode;
  secondaryValue?: ReactNode;
  stats?: ReactNode;
  className?: string;
};

const RANK_STYLES = [
  "bg-yellow-500 text-yellow-950",
  "bg-zinc-400 text-zinc-950",
  "bg-amber-600 text-amber-950",
] as const;

export default function RankedCard({
  href,
  image,
  alt,
  title,
  rank,
  primaryValue,
  secondaryValue,
  stats,
  className,
}: Props) {
  const rankStyle = rank <= 3 ? RANK_STYLES[rank - 1] : "bg-muted text-muted-foreground";

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border transition-colors hover:bg-muted/50",
        className
      )}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={image}
          alt={alt}
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
        <span className="line-clamp-1 font-medium">{title}</span>
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-primary">{primaryValue}</span>
          {secondaryValue}
        </div>
        {stats && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {stats}
          </div>
        )}
      </div>
    </Link>
  );
}

export function RankedCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border">
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
  );
}