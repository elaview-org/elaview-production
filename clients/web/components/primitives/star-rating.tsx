import { IconStarFilled } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type Props = {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZES = {
  sm: "size-3",
  md: "size-4",
  lg: "size-5",
} as const;

export default function StarRating({
  rating,
  max = 5,
  size = "sm",
  className,
}: Props) {
  return (
    <div className={cn("flex gap-0.5", className)}>
      {Array.from({ length: max }).map((_, i) => (
        <IconStarFilled
          key={i}
          className={cn(
            SIZES[size],
            i < rating ? "text-foreground" : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
}