import { Button } from "@/shared/components/button";
import { IconHeart, IconShare } from "@tabler/icons-react";
import { Badge } from "@/shared/components/badge";

interface SpaceCardProps {
  address: string;
  size: string;
  type: string;
  monthlyRate: string;
  status: string;
}

export default function SpaceCard(props: SpaceCardProps) {
  return (
    <div className="group bg-muted relative aspect-square cursor-pointer overflow-hidden rounded-sm transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
      <div className="from-primary/20 via-muted to-primary/10 absolute inset-0 flex items-center justify-center bg-linear-to-br">
        <span className="text-muted-foreground/70 text-3xl font-semibold">
          {props.size}
        </span>
      </div>

      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-50" />

      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 rounded-full backdrop-blur-sm"
        >
          <IconHeart className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 rounded-full backdrop-blur-sm"
        >
          <IconShare className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute top-3 left-3">
        <Badge
          variant={
            props.status === "Available"
              ? "default"
              : props.status === "Booked"
                ? "secondary"
                : "destructive"
          }
          className="shadow-md"
        >
          {props.status}
        </Badge>
      </div>

      <div className="text-foreground absolute right-0 bottom-0 left-0 translate-y-4 p-4 transition-transform duration-300 group-hover:translate-y-0">
        <p className="line-clamp-2 text-sm font-medium">{props.address}</p>
        <div className="mt-1 mb-4 flex items-baseline gap-1">
          <span className="text-lg font-semibold">{props.monthlyRate}</span>
          <span className="text-sm opacity-90">/month</span>
        </div>
      </div>
    </div>
  );
}
