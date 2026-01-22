"use client";

import { useState, useSyncExternalStore } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { SpaceMarker } from "../types";
import { Button } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import { IconCurrentLocation } from "@tabler/icons-react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

interface MapViewProps {
  spaces: SpaceMarker[];
  onSpaceSelect: (space: SpaceMarker) => void;
  center?: [number, number];
  zoom?: number;
}

function createPriceIcon(price: number) {
  return L.divIcon({
    className: "price-marker",
    html: `<div class="bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-semibold shadow-md whitespace-nowrap">$${price}/day</div>`,
    iconSize: [80, 30],
    iconAnchor: [40, 30],
  });
}

function GeolocationButton() {
  const map = useMap();
  const [loading, setLoading] = useState(false);

  const handleGeolocation = () => {
    if (!navigator.geolocation) return;

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        map.flyTo([position.coords.latitude, position.coords.longitude], 14);
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
        onClick={handleGeolocation}
        disabled={loading}
      >
        <IconCurrentLocation className={loading ? "animate-pulse" : ""} />
      </Button>
    </div>
  );
}

function MapEventHandler({
  onBoundsChange,
}: {
  onBoundsChange?: (bounds: L.LatLngBounds) => void;
}) {
  useMapEvents({
    moveend: (e) => {
      onBoundsChange?.(e.target.getBounds());
    },
  });
  return null;
}

export default function MapView({
  spaces,
  onSpaceSelect,
  center = [38.0293, -78.4767],
  zoom = 13,
}: MapViewProps) {
  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  if (!mounted) {
    return (
      <div className="bg-muted flex h-[600px] w-full items-center justify-center rounded-lg">
        <div className="text-muted-foreground">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-lg">
      <style jsx global>{`
        .price-marker {
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
          min-width: 280px;
        }
        .leaflet-popup-close-button {
          display: none;
        }
      `}</style>
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeolocationButton />
        <MapEventHandler />
        {spaces.map((space) => (
          <Marker
            key={space.id}
            position={[space.latitude, space.longitude]}
            icon={createPriceIcon(space.pricePerDay)}
            eventHandlers={{
              click: () => onSpaceSelect(space),
            }}
          >
            <Popup>
              <div className="w-[280px]">
                <div className="bg-muted aspect-video w-full">
                  {space.images[0] ? (
                    <img
                      src={space.images[0]}
                      alt={space.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-muted-foreground text-sm">
                        {space.width}x{space.height} sq ft
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {space.type.replace("_", " ")}
                    </Badge>
                    <span className="text-sm font-semibold">
                      ${space.pricePerDay}/day
                    </span>
                  </div>
                  <p className="text-muted-foreground line-clamp-2 text-xs">
                    {space.address}, {space.city}
                  </p>
                  <Button
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => onSpaceSelect(space)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
