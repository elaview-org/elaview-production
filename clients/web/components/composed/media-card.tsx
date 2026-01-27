import { Skeleton } from "@/components/primitives/skeleton";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  href: string;
  image?: string | null;
  alt: string;
  title: string;
  description?: string | null;
  indicator?: Indicator;
  badges?: Badge[];
  meta?: ReactNode;
  metaLeft?: ReactNode;
  metaRight?: ReactNode;
  aspectRatio?: "video" | "square" | "portrait";
  className?: string;
};

export default function MediaCard({
  href,
  image,
  alt,
  title,
  description,
  indicator,
  badges,
  meta,
  metaLeft,
  metaRight,
  aspectRatio = "video",
  className,
}: Props) {
  const hasFooterMeta = metaLeft || metaRight;

  return (
    <Link href={href} className={cn("group block", className)}>
      <article className="bg-card text-card-foreground flex h-full flex-col overflow-hidden rounded-sm shadow-sm transition-shadow hover:shadow-lg">
        <div className="p-3 pb-0">
          <div
            className={cn(
              "relative overflow-hidden",
              ASPECT_RATIOS[aspectRatio]
            )}
          >
            {image ? (
              <Image
                src={image}
                alt={alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="bg-muted flex h-full items-center justify-center">
                <span className="text-muted-foreground text-sm">No image</span>
              </div>
            )}

            {indicator && (
              <div
                className={cn(
                  "absolute top-3 left-3 size-2.5 rounded-full ring-2 ring-white",
                  indicator.className
                )}
                title={indicator.title}
              />
            )}

            {badges?.map((badge, index) => (
              <span
                key={index}
                className={cn(
                  "absolute rounded-sm text-xs",
                  BADGE_POSITIONS[badge.position],
                  badge.className
                )}
              >
                {badge.content}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5">
          <h3 className="truncate text-lg font-semibold">{title}</h3>

          {description !== undefined && (
            <p className="text-muted-foreground line-clamp-2 min-h-10 text-sm">
              {description || "No description"}
            </p>
          )}

          {meta && (
            <div className="text-muted-foreground mt-auto text-xs">{meta}</div>
          )}

          {hasFooterMeta && (
            <div className="mt-auto flex items-center justify-between">
              {metaLeft && (
                <span className="text-muted-foreground text-xs">
                  {metaLeft}
                </span>
              )}
              {metaRight && (
                <span className="text-muted-foreground ml-auto text-xs">
                  {metaRight}
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

export function MediaCardSkeleton({
  aspectRatio = "video",
  showDescription = true,
}: {
  aspectRatio?: "video" | "square" | "portrait";
  showDescription?: boolean;
}) {
  return (
    <article className="bg-card overflow-hidden rounded-sm shadow-sm">
      <div className="p-3 pb-0">
        <Skeleton className={cn("rounded-none", ASPECT_RATIOS[aspectRatio])} />
      </div>
      <div className="flex flex-col gap-2 p-5">
        <Skeleton className="h-6 w-3/4" />
        {showDescription && <Skeleton className="h-10 w-full" />}
        <div className="mt-auto flex items-center justify-between pt-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </article>
  );
}

type BadgePosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type Badge = {
  position: BadgePosition;
  content: ReactNode;
  className?: string;
};

type Indicator = {
  className: string;
  title?: string;
};

const ASPECT_RATIOS = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
} as const;

const BADGE_POSITIONS = {
  "top-left": "top-2 left-2",
  "top-right": "top-2 right-2",
  "bottom-left": "bottom-2 left-2",
  "bottom-right": "bottom-2 right-2",
} as const;
