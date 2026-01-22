"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/primitives/dialog";
import { Button } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import { SpaceMarker } from "./types";
import {
  IconMapPin,
  IconRuler,
  IconCalendar,
  IconArrowRight,
} from "@tabler/icons-react";
import Link from "next/link";

interface SpacePreviewProps {
  space: SpaceMarker | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SpacePreview({
  space,
  open,
  onOpenChange,
}: SpacePreviewProps) {
  if (!space) return null;

  const fullAddress = `${space.address}, ${space.city}, ${space.state} ${space.zipCode}`;
  const dimensions =
    space.width && space.height ? `${space.width}×${space.height} ft` : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="gap-0 overflow-hidden p-0">
        <div className="bg-muted relative aspect-video w-full">
          {space.images[0] ? (
            <img
              src={space.images[0]}
              alt={space.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-muted-foreground text-3xl font-semibold">
                {dimensions ?? "No image"}
              </span>
            </div>
          )}
          <Badge className="absolute top-4 left-4" variant="secondary">
            {space.type.replace("_", " ")}
          </Badge>
        </div>

        <div className="p-6">
          <DialogHeader className="mb-4">
            <div className="flex items-start justify-between">
              <DialogTitle className="text-xl">{space.title}</DialogTitle>
              <div className="text-right">
                <div className="text-2xl font-bold">${space.pricePerDay}</div>
                <div className="text-muted-foreground text-sm">per day</div>
              </div>
            </div>
          </DialogHeader>

          <div className="text-muted-foreground mb-6 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <IconMapPin className="h-4 w-4 shrink-0" />
              <span>{fullAddress}</span>
            </div>
            {dimensions && (
              <div className="flex items-center gap-2">
                <IconRuler className="h-4 w-4 shrink-0" />
                <span>{dimensions}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <IconCalendar className="h-4 w-4 shrink-0" />
              <span>Available now</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" asChild>
              <Link href={`/space/${space.id}`}>View Full Details</Link>
            </Button>
            <Button className="flex-1" asChild>
              <Link href={`/space/${space.id}#book`}>
                Request Booking
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
