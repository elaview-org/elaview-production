"use client";

import { Button } from "@/components/primitives/button";
import { IconHeart, IconShare } from "@tabler/icons-react";
import { Badge } from "@/components/primitives/badge";
import { SpaceMarker } from "../types";

interface SpaceCardProps {
  space: SpaceMarker;
  onClick?: () => void;
}

export default function SpaceCard({ space, onClick }: SpaceCardProps) {
  const fullAddress = `${space.address}, ${space.city}`;
  const dimensions =
    space.width && space.height ? `${space.width}×${space.height} ft` : null;

  return (
    <div
      className="group bg-muted relative aspect-4/3 cursor-pointer overflow-hidden rounded-lg transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl"
      onClick={onClick}
    >
      {space.images[0] ? (
        <img
          src={space.images[0]}
          alt={space.title}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="from-primary/20 via-muted to-primary/10 absolute inset-0 flex items-center justify-center bg-linear-to-br">
          <span className="text-muted-foreground/70 text-3xl font-semibold">
            {dimensions ?? "No image"}
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 rounded-full backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <IconHeart className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 rounded-full backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <IconShare className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute top-3 left-3 flex gap-2">
        <Badge variant="default" className="shadow-md">
          {space.type.replace("_", " ")}
        </Badge>
      </div>

      <div className="text-foreground absolute right-0 bottom-0 left-0 translate-y-4 p-4 transition-transform duration-300 group-hover:translate-y-0">
        <p className="line-clamp-2 text-sm font-medium text-white drop-shadow-md">
          {fullAddress}
        </p>
        <div className="mt-1 mb-4 flex items-baseline gap-1 text-white drop-shadow-md">
          <span className="text-lg font-semibold">${space.pricePerDay}</span>
          <span className="text-sm opacity-90">/day</span>
        </div>
      </div>
    </div>
  );
}
