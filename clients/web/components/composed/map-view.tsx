"use client";

import { ReactNode, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/primitives/skeleton";
import { Button } from "@/components/primitives/button";
import { IconCurrentLocation } from "@tabler/icons-react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

type Accessor<TData, TValue> = keyof TData | ((item: TData) => TValue);

function getValue<TData, TValue>(
  item: TData,
  accessor: Accessor<TData, TValue>
): TValue {
  if (typeof accessor === "function") {
    return accessor(item);
  }
  return item[accessor] as TValue;
}

type MarkerIconFactory<TData> = (item: TData) => L.DivIcon | L.Icon;

type MapViewProps<TData> = {
  data: TData[];
  getId: Accessor<TData, string>;
  latitude: Accessor<TData, number>;
  longitude: Accessor<TData, number>;
  markerIcon?: MarkerIconFactory<TData>;
  renderPopup?: (item: TData) => ReactNode;
  onMarkerClick?: (item: TData) => void;
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

function GeolocationButton() {
  const map = useMap();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        map.flyTo([pos.coords.latitude, pos.coords.longitude], 14);
        setLoading(false);
      },
      () => setLoading(false),
      { enableHighAccuracy: true }
    );
  };

  return (
    <div
      className="leaflet-top leaflet-right"
      style={{ marginTop: 10, marginRight: 10 }}
    >
      <Button
        size="icon"
        variant="secondary"
        className="z-[1000] shadow-md"
        onClick={handleClick}
        disabled={loading}
      >
        <IconCurrentLocation className={loading ? "animate-pulse" : ""} />
      </Button>
    </div>
  );
}

function MapViewBase<TData>({
  data,
  getId,
  latitude,
  longitude,
  markerIcon,
  renderPopup,
  onMarkerClick,
  center = [38.0293, -78.4767],
  zoom = 13,
  height = 600,
  enableGeolocation = true,
  className,
}: MapViewProps<TData>) {
  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const heightStyle = typeof height === "number" ? `${height}px` : height;

  if (!mounted) {
    return <MapViewSkeleton height={height} className={className} />;
  }

  return (
    <div
      className={cn("relative w-full overflow-hidden rounded-lg", className)}
      style={{ height: heightStyle }}
    >
      <style jsx global>{`
        .map-view-marker {
          background: transparent;
          border: none;
        }
        .leaflet-popup-content-wrapper {
          padding: 0;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        .leaflet-popup-content {
          margin: 0;
          min-width: 240px;
        }
        .leaflet-popup-close-button {
          display: none;
        }
      `}</style>
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        zoomControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {enableGeolocation && <GeolocationButton />}
        {data.map((item) => {
          const id = getValue(item, getId);
          const lat = getValue(item, latitude);
          const lng = getValue(item, longitude);
          const icon = markerIcon?.(item);

          return (
            <Marker
              key={id}
              position={[lat, lng]}
              icon={icon}
              eventHandlers={
                onMarkerClick ? { click: () => onMarkerClick(item) } : undefined
              }
            >
              {renderPopup && <Popup>{renderPopup(item)}</Popup>}
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

const MapView = dynamic(() => Promise.resolve(MapViewBase), {
  ssr: false,
  loading: () => <MapViewSkeleton />,
}) as <TData>(props: MapViewProps<TData>) => ReactNode;

export default MapView;

export function createPriceMarker(price: number, suffix = "/day"): L.DivIcon {
  return L.divIcon({
    className: "map-view-marker",
    html: `<div class="bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-semibold shadow-md whitespace-nowrap">$${price}${suffix}</div>`,
    iconSize: [80, 30],
    iconAnchor: [40, 30],
  });
}

export function createDotMarker(
  color: "primary" | "secondary" | "destructive" = "primary"
): L.DivIcon {
  const colorClasses = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    destructive: "bg-destructive",
  };
  return L.divIcon({
    className: "map-view-marker",
    html: `<div class="${colorClasses[color]} size-3 rounded-full shadow-md ring-2 ring-white"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

export function createLabelMarker(label: string): L.DivIcon {
  return L.divIcon({
    className: "map-view-marker",
    html: `<div class="bg-card text-card-foreground border px-2 py-1 rounded-md text-xs font-medium shadow-md whitespace-nowrap">${label}</div>`,
    iconSize: [80, 30],
    iconAnchor: [40, 30],
  });
}

export function createNumberMarker(num: number): L.DivIcon {
  return L.divIcon({
    className: "map-view-marker",
    html: `<div class="bg-primary text-primary-foreground size-6 flex items-center justify-center rounded-full text-xs font-semibold shadow-md">${num}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export type { MapViewProps, MapViewSkeletonProps, MarkerIconFactory };
