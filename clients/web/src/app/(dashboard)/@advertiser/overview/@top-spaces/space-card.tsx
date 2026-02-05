import { IconCalendar, IconStar } from "@tabler/icons-react";
import RankedCard from "@/components/composed/ranked-card";
import { formatCurrency } from "@/lib/utils";

type Space = {
  id: string;
  title: string;
  image: string | null;
  averageRating: number | null;
  totalSpend: number;
  bookingCount: number;
};

type Props = {
  space: Space;
  rank: number;
};

const PLACEHOLDER_IMAGE = "/images/placeholder-space.jpg";

export default function SpaceCard({ space, rank }: Props) {
  return (
    <RankedCard
      href={`/discover/${space.id}`}
      image={space.image ?? PLACEHOLDER_IMAGE}
      alt={space.title}
      title={space.title}
      rank={rank}
      primaryValue={formatCurrency(space.totalSpend, { compact: true })}
      secondaryValue={
        space.averageRating !== null && (
          <span className="text-muted-foreground flex items-center gap-1">
            <IconStar className="size-3.5 fill-yellow-400 text-yellow-400" />
            {space.averageRating.toFixed(1)}
          </span>
        )
      }
      stats={
        <span className="flex items-center gap-1">
          <IconCalendar className="size-3" />
          {space.bookingCount}{" "}
          {space.bookingCount === 1 ? "booking" : "bookings"}
        </span>
      }
    />
  );
}
