import Link from "next/link";
import { Button } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/primitives/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { MapPin, Ruler, Star } from "lucide-react";
import Image from "next/image";

interface SpaceInfoProps {
  space?: {
    id: string;
    title: string;
    photos?: string[];
    location?: {
      address: string;
      city: string;
      state: string;
    };
    width?: number;
    height?: number;
    dimensionUnit?: string;
    spaceType?: {
      name: string;
    };
    owner?: {
      id: string;
      firstName: string;
      lastName: string;
      avatarUrl?: string | null;
    };
  };
  bookingId?: string;
}

export default function SpaceInfo({ space, bookingId }: SpaceInfoProps) {
  if (!space) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Space Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No space information available
          </p>
        </CardContent>
      </Card>
    );
  }

  const locationString = space.location
    ? `${space.location.address}, ${space.location.city}, ${space.location.state}`
    : "Location not available";

  const dimensionsString =
    space.width && space.height && space.dimensionUnit
      ? `${space.width}×${space.height} ${space.dimensionUnit}`
      : "Dimensions not available";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Space Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Space Image */}
        {space.photos && space.photos.length > 0 && (
          <div className="bg-muted flex h-32 w-full items-center justify-center overflow-hidden rounded-lg">
            <Image
              src={space.photos[0]}
              alt={space.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Space Details */}
        <div className="space-y-2">
          <h3 className="font-semibold">{space.title}</h3>
          <div className="text-muted-foreground space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{locationString}</span>
            </div>
            <div className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              <span>{dimensionsString}</span>
            </div>
            {space.spaceType && (
              <div>
                <Badge variant="outline">{space.spaceType.name}</Badge>
              </div>
            )}
          </div>
        </div>

        {/* Owner Info */}
        {space.owner && (
          <div className="flex items-center gap-2 border-t pt-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={space.owner.avatarUrl || undefined} />
              <AvatarFallback>
                {space.owner.firstName[0]}
                {space.owner.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {space.owner.firstName} {space.owner.lastName}
              </p>
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>4.8</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 border-t pt-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/spaces/${space.id}`}>View Space</Link>
          </Button>
          {bookingId && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/src/app/(dashboard)/messages/${bookingId}`}>
                Contact Owner
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
