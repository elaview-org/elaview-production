"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import MapView, {
  MapViewSkeleton,
  type MapViewState,
} from "@/components/composed/map-view";
import { useSearchParamsUpdater } from "@/lib/hooks/use-search-params-updater";
import { formatCurrency } from "@/lib/core/utils";
import { SPACE_TYPE } from "@/lib/core/constants";
import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";

let globalMountCounter = 0;

export const DiscoverMap_SpaceFragment = graphql(`
  fragment DiscoverMap_SpaceFragment on Space {
    id
    title
    address
    city
    latitude
    longitude
    pricePerDay
    type
    images
  }
`);

type Bounds = {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
};

type Props = {
  data: FragmentType<typeof DiscoverMap_SpaceFragment>[];
  bounds?: Bounds;
  zoom?: number;
};

export default function DiscoverMap({ data, bounds, zoom }: Props) {
  const { get, update } = useSearchParamsUpdater();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [mapKey, setMapKey] = useState<string | null>(null);

  useEffect(() => {
    setMapKey(`map-${++globalMountCounter}`);
    return () => setMapKey(null);
  }, []);

  const spaces = data.map((d) => getFragmentData(DiscoverMap_SpaceFragment, d));
  const validSpaces = spaces.filter(
    (s) => s.latitude !== null && s.longitude !== null
  );

  const center: [number, number] | undefined = bounds
    ? [(bounds.minLat + bounds.maxLat) / 2, (bounds.minLng + bounds.maxLng) / 2]
    : undefined;

  const handleViewChange = ({ bounds, zoom }: MapViewState) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      const mapKeys = new Set(["minLat", "maxLat", "minLng", "maxLng", "zoom"]);
      const currentFilter = get("filter");
      const entries = currentFilter
        ? currentFilter.split(",").filter((e) => !mapKeys.has(e.split(":")[0]))
        : [];
      entries.push(
        `minLat:${bounds.getSouth()}`,
        `maxLat:${bounds.getNorth()}`,
        `minLng:${bounds.getWest()}`,
        `maxLng:${bounds.getEast()}`,
        `zoom:${zoom}`
      );
      update({ filter: entries.join(",") || null });
    }, 300);
  };

  const mapHeight = "calc(100dvh - 13rem)";

  if (!mapKey) {
    return <MapViewSkeleton height={mapHeight} />;
  }

  return (
    <MapView
      key={mapKey}
      data={validSpaces}
      getId={(s) => s.id}
      latitude={(s) => s.latitude!}
      longitude={(s) => s.longitude!}
      markerLabel={(s) => `${formatCurrency(Number(s.pricePerDay))}/day`}
      onViewChange={handleViewChange}
      center={center}
      zoom={zoom}
      height={mapHeight}
      enableGeolocation
      renderPopup={(space) => (
        <div className="w-[280px]">
          <div className="bg-muted relative aspect-video w-full">
            {(space.images as string[])[0] ? (
              <Image
                src={(space.images as string[])[0]}
                alt={space.title}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-muted-foreground text-sm">No image</span>
              </div>
            )}
          </div>
          <div className="p-3">
            <div className="mb-1 flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {SPACE_TYPE.labels[space.type]}
              </Badge>
              <span className="text-sm font-semibold">
                {formatCurrency(Number(space.pricePerDay))}/day
              </span>
            </div>
            <p className="text-muted-foreground line-clamp-1 text-xs">
              {space.address}, {space.city}
            </p>
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" asChild>
                <Link href={`/spaces/${space.id}`}>View Details</Link>
              </Button>
              <Button size="sm" className="flex-1" asChild>
                <Link href={`/spaces/${space.id}#book`}>Request Booking</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    />
  );
}
