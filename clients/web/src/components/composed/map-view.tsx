"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";
import type { LatLngBounds } from "leaflet";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/primitives/skeleton";

type Accessor<TData, TValue> = keyof TData | ((item: TData) => TValue);

type MapViewState = {
  bounds: LatLngBounds;
  zoom: number;
};

type MapViewProps<TData> = {
  data: TData[];
  getId: Accessor<TData, string>;
  latitude: Accessor<TData, number>;
  longitude: Accessor<TData, number>;
  markerLabel?: Accessor<TData, string>;
  renderPopup?: (item: TData) => ReactNode;
  onMarkerClick?: (item: TData) => void;
  onViewChange?: (state: MapViewState) => void;
  center?: [number, number];
  zoom?: number;
  height?: number | string;
  enableGeolocation?: boolean;
  className?: string;
};

type MapViewSkeletonProps = {
  height?: number | string;
  className?: string;
};

export function MapViewSkeleton({
  height = 600,
  className,
}: MapViewSkeletonProps) {
  return (
    <Skeleton
      className={cn("w-full rounded-lg", className)}
      style={{ height: typeof height === "number" ? `${height}px` : height }}
    />
  );
}

const MapView = dynamic(() => import("./map-view-impl"), {
  ssr: false,
  loading: () => <MapViewSkeleton />,
}) as <TData>(props: MapViewProps<TData>) => ReactNode;

export default MapView;

export type { MapViewProps, MapViewSkeletonProps, MapViewState };
