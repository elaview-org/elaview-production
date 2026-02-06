"use client";

import { ReactNode, useEffect, useState } from "react";
import { MapContainer, Marker, Popup, useMap } from "react-leaflet";
import ThemedTileLayer from "./themed-tile-layer";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";
import { Button } from "@/components/primitives/button";
import { IconCurrentLocation } from "@tabler/icons-react";

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

export type MapViewState = {
  bounds: L.LatLngBounds;
  zoom: number;
};

export type MapViewImplProps<TData> = {
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

type ViewWatcherProps = {
  onViewChange?: (state: MapViewState) => void;
};

function ViewWatcher({ onViewChange }: ViewWatcherProps) {
  const map = useMap();

  useEffect(() => {
    if (!onViewChange) return;
    const handler = () => {
      onViewChange({ bounds: map.getBounds(), zoom: map.getZoom() });
    };
    map.on("moveend", handler);
    map.on("zoomend", handler);
    return () => {
      map.off("moveend", handler);
      map.off("zoomend", handler);
    };
  }, [map, onViewChange]);

  return null;
}

function createLabelIcon(label: string): L.DivIcon {
  return L.divIcon({
    className: "map-view-marker",
    html: `<div class="bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-semibold shadow-md whitespace-nowrap">${label}</div>`,
    iconSize: [80, 30],
    iconAnchor: [40, 30],
  });
}

export default function MapViewImpl<TData>({
  data,
  getId,
  latitude,
  longitude,
  markerLabel,
  renderPopup,
  onMarkerClick,
  onViewChange,
  center = [38.0293, -78.4767],
  zoom = 13,
  height = 600,
  enableGeolocation = true,
  className,
}: MapViewImplProps<TData>) {
  const heightStyle = typeof height === "number" ? `${height}px` : height;

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
        <ThemedTileLayer />
        {enableGeolocation && <GeolocationButton />}
        {onViewChange && <ViewWatcher onViewChange={onViewChange} />}
        {data.map((item) => {
          const id = getValue(item, getId);
          const lat = getValue(item, latitude);
          const lng = getValue(item, longitude);
          const label = markerLabel ? getValue(item, markerLabel) : undefined;
          const icon = label ? createLabelIcon(label) : undefined;

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
