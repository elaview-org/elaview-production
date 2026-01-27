import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { Skeleton } from "@/components/primitives/skeleton";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  count?: number;
  viewAllHref?: string;
  viewAllLabel?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export default function SectionCard({
  title,
  description,
  count,
  viewAllHref,
  viewAllLabel = "View All",
  children,
  className,
  contentClassName,
}: Props) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            {title}
            {count !== undefined && (
              <Badge variant="secondary" className="tabular-nums">
                {count}
              </Badge>
            )}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {viewAllHref && (
          <Button variant="outline" size="sm" asChild>
            <Link href={viewAllHref}>{viewAllLabel}</Link>
          </Button>
        )}
      </CardHeader>
      <CardContent className={cn("flex-1", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}

export function SectionCardSkeleton({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-20" />
      </CardHeader>
      <CardContent className="flex-1">{children}</CardContent>
    </Card>
  );
}