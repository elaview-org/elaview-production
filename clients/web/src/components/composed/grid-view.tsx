import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { MediaCardSkeleton } from "./media-card";

type Props = {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
};

export function GridView({ children, columns = 3, className }: Props) {
  return (
    <div
      className={cn(
        "grid gap-4 @xl/main:gap-6",
        GRID_COLUMNS[columns],
        className
      )}
    >
      {children}
    </div>
  );
}

type SkeletonProps = {
  count?: number;
  columns?: 2 | 3 | 4;
  aspectRatio?: "video" | "square" | "portrait";
  showDescription?: boolean;
  className?: string;
};

export function GridViewSkeleton({
  count = 6,
  columns = 3,
  aspectRatio = "video",
  showDescription = true,
  className,
}: SkeletonProps) {
  return (
    <GridView columns={columns} className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <MediaCardSkeleton
          key={i}
          aspectRatio={aspectRatio}
          showDescription={showDescription}
        />
      ))}
    </GridView>
  );
}

const GRID_COLUMNS = {
  2: "grid-cols-1 @xl/main:grid-cols-2",
  3: "grid-cols-1 @md/main:grid-cols-2 @3xl/main:grid-cols-3",
  4: "grid-cols-1 @md/main:grid-cols-2 @2xl/main:grid-cols-3 @5xl/main:grid-cols-4",
} as const;
