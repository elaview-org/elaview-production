import { ReactNode } from "react";
import { IconClock } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/primitives/avatar";
import { Badge } from "@/components/primitives/badge";
import { Skeleton } from "@/components/primitives/skeleton";
import { cn, getInitials } from "@/lib/utils";

type Props = {
  avatar?: string | null;
  name: string;
  subtitle?: string;
  timestamp?: string;
  metaLeft?: ReactNode;
  metaRight?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export default function ActionCard({
  avatar,
  name,
  subtitle,
  timestamp,
  metaLeft,
  metaRight,
  actions,
  className,
}: Props) {
  return (
    <div className={cn("flex flex-col gap-3 rounded-lg border p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src={avatar ?? undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{name}</span>
            {subtitle && (
              <span className="text-muted-foreground text-sm">{subtitle}</span>
            )}
          </div>
        </div>
        {timestamp && (
          <Badge variant="outline" className="text-muted-foreground gap-1">
            <IconClock className="size-3" />
            {timestamp}
          </Badge>
        )}
      </div>

      {(metaLeft || metaRight) && (
        <div className="flex items-center justify-between text-sm">
          {metaLeft && (
            <span className="text-muted-foreground">{metaLeft}</span>
          )}
          {metaRight && (
            <span className="font-semibold tabular-nums">{metaRight}</span>
          )}
        </div>
      )}

      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function ActionCardSkeleton({ showActions = true }: { showActions?: boolean }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      {showActions && (
        <div className="flex gap-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
      )}
    </div>
  );
}