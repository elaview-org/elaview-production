"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { createRoot, Root } from "react-dom/client";
import { MapContainer, useMap } from "react-leaflet";
import ThemedTileLayer from "./themed-tile-layer";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { cn } from "@/lib/core/utils";
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

type MarkerClusterGroupProps<TData> = {
  data: TData[];
  getId: Accessor<TData, string>;
  latitude: Accessor<TData, number>;
  longitude: Accessor<TData, number>;
  markerLabel?: Accessor<TData, string>;
  renderPopup?: (item: TData) => ReactNode;
  onMarkerClick?: (item: TData) => void;
};

function MarkerClusterGroup<TData>({
  data,
  getId,
  latitude,
  longitude,
  markerLabel,
  renderPopup,
  onMarkerClick,
}: MarkerClusterGroupProps<TData>) {
  const map = useMap();
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const popupRootsRef = useRef<Map<string, Root>>(new Map());

  useEffect(() => {
    // Create cluster group
    if (!clusterGroupRef.current) {
      clusterGroupRef.current = L.markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 50,
      });
      map.addLayer(clusterGroupRef.current);
    }

    const clusterGroup = clusterGroupRef.current;

    const markersRefs = markersRef.current;
    const popupRootsRefs = popupRootsRef.current;
    // Capture ref values for cleanup
    const currentMarkers = new Map(markersRefs);
    const currentPopupRoots = new Map(popupRootsRefs);
    // Clear existing markers and popup roots
    currentMarkers.forEach((marker) => {
      clusterGroup.removeLayer(marker);
    });
    currentPopupRoots.forEach((root) => {
      root.unmount();
    });
    markersRef.current.clear();
    popupRootsRef.current.clear();

    // Add new markers
    data.forEach((item) => {
      const id = getValue(item, getId);
      const position: [number, number] = [
        getValue(item, latitude),
        getValue(item, longitude),
      ];
      const label = markerLabel ? getValue(item, markerLabel) : undefined;
      const icon = label ? createLabelIcon(label) : undefined;

      const marker = L.marker(position, { icon });

      // Add popup if renderPopup is provided
      if (renderPopup) {
        const popupContainer = document.createElement("div");
        const popup = L.popup({
          content: popupContainer,
          className: "custom-popup",
        });
        marker.bindPopup(popup);

        // Create React root for popup content
        const root = createRoot(popupContainer);
        popupRootsRef.current.set(id, root);

        // Render popup content when popup opens
        marker.on("popupopen", () => {
          root.render(renderPopup(item));
        });

        // Cleanup root when popup closes
        marker.on("popupclose", () => {
          root.render(null);
        });
      }

      // Add click handler if onMarkerClick is provided
      if (onMarkerClick) {
        marker.on("click", () => {
          onMarkerClick(item);
        });
      }

      clusterGroup.addLayer(marker);
      markersRef.current.set(id, marker);
    });

    // Cleanup - use captured values
    return () => {
      const cleanupClusterGroup = clusterGroupRef.current;
      const cleanupMarkers = new Map(markersRefs);
      const cleanupPopupRoots = new Map(popupRootsRefs);

      if (cleanupClusterGroup) {
        cleanupMarkers.forEach((marker) => {
          cleanupClusterGroup.removeLayer(marker);
        });
        cleanupPopupRoots.forEach((root) => {
          setTimeout(() => {
            root.unmount();
          }, 0);
        });
        map.removeLayer(cleanupClusterGroup);
        clusterGroupRef.current = null;
        markersRefs.clear();
        popupRootsRefs.clear();
      }
    };
  }, [
    map,
    data,
    getId,
    latitude,
    longitude,
    markerLabel,
    renderPopup,
    onMarkerClick,
  ]);

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
        <MarkerClusterGroup
          data={data}
          getId={getId}
          latitude={latitude}
          longitude={longitude}
          markerLabel={markerLabel}
          renderPopup={renderPopup}
          onMarkerClick={onMarkerClick}
        />
      </MapContainer>
    </div>
  );
}
