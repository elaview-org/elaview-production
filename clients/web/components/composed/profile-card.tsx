import { ReactNode } from "react";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/primitives/avatar";
import { Badge } from "@/components/primitives/badge";
import { Card, CardContent } from "@/components/primitives/card";
import { Separator } from "@/components/primitives/separator";
import { Skeleton } from "@/components/primitives/skeleton";
import { IconRosetteDiscountCheck, IconSettings } from "@tabler/icons-react";
import { cn, getInitials } from "@/lib/utils";

type Stat = {
  value: ReactNode;
  label: string;
};

type Props = {
  name: string;
  avatar?: string | null;
  badge: string;
  badgeIcon?: ReactNode;
  verified?: boolean;
  settingsHref?: string;
  stats: Stat[];
  className?: string;
};

export default function ProfileCard({
  name,
  avatar,
  badge,
  badgeIcon,
  verified = false,
  settingsHref = "/settings",
  stats,
  className,
}: Props) {
  return (
    <Card className={cn("shrink-0 lg:w-72", className)}>
      <CardContent className="flex flex-col items-center gap-4 pt-6">
        <div className="relative">
          <Avatar className="size-28">
            <AvatarImage src={avatar ?? undefined} alt={name} />
            <AvatarFallback className="text-2xl">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          {verified && (
            <div className="bg-primary ring-card absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full ring-2">
              <IconRosetteDiscountCheck className="text-primary-foreground size-4" />
            </div>
          )}
          <Link
            href={settingsHref}
            className="bg-secondary hover:bg-secondary/80 ring-card absolute -bottom-1 -left-1 flex size-7 items-center justify-center rounded-full ring-2 transition-colors"
          >
            <IconSettings className="text-secondary-foreground size-4" />
          </Link>
        </div>

        <div className="flex flex-col items-center gap-1">
          <h2 className="text-xl font-semibold">{name}</h2>
          <Badge variant="secondary" className="gap-1">
            {badgeIcon}
            {badge}
          </Badge>
        </div>

        <Separator />

        <div
          className={cn(
            "grid w-full gap-4 text-center",
            stats.length === 2 && "grid-cols-2",
            stats.length === 3 && "grid-cols-3",
            stats.length >= 4 && "grid-cols-2 sm:grid-cols-4"
          )}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-muted-foreground text-xs">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ProfileCardSkeleton() {
  return (
    <Card className="shrink-0 lg:w-72">
      <CardContent className="flex flex-col items-center gap-4 pt-6">
        <Skeleton className="size-28 rounded-full" />
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <Separator />
        <div className="grid w-full grid-cols-3 gap-4 text-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-3 w-14" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
