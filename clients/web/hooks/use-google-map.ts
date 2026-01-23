"use client";

import type { BBox } from "geojson";
import { useCallback, useRef, useState } from "react";
import { Space } from "@/types/gql";

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

const DEBUG = process.env.ELAVIEW_WEB_NODE_ENV === "development";

export default function useGoogleMap({
  spaces,
  onBoundsChange,
}: {
  spaces: Space[];
  onBoundsChange: (bounds: MapBounds, zoom: number) => void;
}) {
  //parameter
  const mapZoom = 12;

  //state management
  const [mapReady, setMapReady] = useState(false);

  const mapRef = useRef<google.maps.Map | null>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastBoundsRef = useRef<MapBounds | null>(null);

  const [bounds, setBounds] = useState<BBox | undefined>();
  const [zoom, setZoom] = useState(mapZoom);
  //function start

  const hasBoundsChangedSignificantly = (
    oldBounds: MapBounds | null,
    newBounds: MapBounds,
    threshold = 0.005
  ): boolean => {
    if (!oldBounds) return true;

    const latDiff = Math.abs(newBounds.north - oldBounds.north);
    const lngDiff = Math.abs(newBounds.east - oldBounds.east);

    const changed = latDiff > threshold || lngDiff > threshold;

    if (DEBUG && !changed) {
      console.log("🚫 Bounds movement too small, skipping update", {
        latDiff: latDiff.toFixed(4),
        lngDiff: lngDiff.toFixed(4),
        threshold,
      });
    }

    return changed;
  };
  console.log(spaces, setMapReady, bounds, zoom);

  const handleIdle = useCallback(() => {
    if (!mapRef.current || !mapReady) return;

    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }

    idleTimeoutRef.current = setTimeout(() => {
      const gMap = mapRef.current;
      if (!gMap) return;

      const newZoom = gMap.getZoom();
      if (newZoom === undefined) {
        if (DEBUG) {
          console.log("Map zoom is undefined, skipping idle update");
        }
        return;
      }

      const newBounds = gMap.getBounds();

      if (newBounds) {
        const ne = newBounds.getNorthEast();
        const sw = newBounds.getSouthWest();

        const mapBounds: MapBounds = {
          north: ne.lat(),
          south: sw.lat(),
          east: ne.lng(),
          west: sw.lng(),
        };

        const boundsArray: BBox = [sw.lng(), sw.lat(), ne.lng(), ne.lat()];
        setBounds(boundsArray);
        setZoom(newZoom);

        if (
          hasBoundsChangedSignificantly(lastBoundsRef.current, mapBounds, 0.005)
        ) {
          lastBoundsRef.current = mapBounds;

          if (DEBUG) {
            console.log("✅ Bounds changed significantly, updating...", {
              bounds: {
                north: mapBounds.north.toFixed(4),
                south: mapBounds.south.toFixed(4),
                east: mapBounds.east.toFixed(4),
                west: mapBounds.west.toFixed(4),
              },
              zoom: newZoom,
            });
          }

          onBoundsChange(mapBounds, newZoom);
        }
      }
    }, 800);
  }, [onBoundsChange, mapReady]);

  const spaces_points = [
    { id: 1, lat: 41.882634400652414, lng: -87.61635240458276 }, //
    { id: 2, lat: 29.782942522602035, lng: -95.37072778347941 },
    { id: 3, lat: 34.09544628580047, lng: -95.37072778347941 },
    { id: 4, lat: 29.38895491106978, lng: -98.530130642438 }, //
    { id: 5, lat: 32.680990742048664, lng: -117.14815159329673 },
    { id: 6, lat: 39.92665736694301, lng: -75.13305342959588 }, //
    { id: 7, lat: 33.478829201377756, lng: -112.09928895851004 }, //
  ];

  return {
    points: spaces_points,
    handleIdle: handleIdle,
  };
}
