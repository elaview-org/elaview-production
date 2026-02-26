"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import MapView, {
  MapViewSkeleton,
  type MapViewState,
} from "@/components/composed/map-view";
import { useSearchParamsUpdater } from "@/lib/hooks/use-search-params-updater";
import { formatCurrency } from "@/lib/core/utils";

let globalMountCounter = 0;

export const ListingsMap_SpaceFragment = graphql(`
  fragment ListingsMap_SpaceFragment on Space {
    id
    title
    latitude
    longitude
    pricePerDay
  }
`);

type Bounds = {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
};

type Props = {
  data: FragmentType<typeof ListingsMap_SpaceFragment>[];
  bounds?: Bounds;
  zoom?: number;
};

export default function ListingsMap({ data, bounds, zoom }: Props) {
  const router = useRouter();
  const { get, update } = useSearchParamsUpdater();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [mapKey, setMapKey] = useState<string | null>(null);

  useEffect(() => {
    setMapKey(`map-${++globalMountCounter}`);
    return () => setMapKey(null);
  }, []);

  const handleMarkerClick = (id: string) => {
    router.push(`/listings/${id}`);
  };

  const spaces = data.map((d) => getFragmentData(ListingsMap_SpaceFragment, d));
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
      onMarkerClick={(s) => handleMarkerClick(s.id)}
      onViewChange={handleViewChange}
      center={center}
      zoom={zoom}
      height={mapHeight}
    />
  );
}
