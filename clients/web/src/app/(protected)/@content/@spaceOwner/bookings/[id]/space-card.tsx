import Image from "next/image";
import Link from "next/link";
import { IconExternalLink, IconMapPin } from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { Button } from "@/components/primitives/button";

type Props = {
  space?: {
    id: unknown;
    title: string;
    images: unknown;
    address: string;
    city: string;
    state: string;
    zipCode?: string | null;
  } | null;
};

export default function SpaceCard({ space }: Props) {
  if (!space) return null;

  const images = space.images as string[];
  const address = [space.address, space.city, space.state, space.zipCode]
    .filter(Boolean)
    .join(", ");

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Space</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/listings/${space.id}`}>
            View Space
            <IconExternalLink className="size-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          {images[0] && (
            <div className="relative size-24 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={images[0]}
                alt={space.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <h3 className="font-medium">{space.title}</h3>
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <IconMapPin className="size-4" />
              {address}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
