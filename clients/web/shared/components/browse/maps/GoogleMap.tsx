// src/components/browse/maps/GoogleMap.tsx - FULLY OPTIMIZED WITH CIRCLE MARKERS
"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from "@vis.gl/react-google-maps";
import {
  MapPin,
  Building,
  Monitor,
  Bus,
  Car,
  Store,
  Camera,
  Locate,
} from "lucide-react";
import useSupercluster from "use-supercluster";
import type { BBox } from "geojson";

// ============================================================================
// TYPES
// ============================================================================

interface Space {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  pricePerDay: number;
  images: string[];
  owner: {
    id: string;
    name?: string;
    email: string;
  };
  _count: {
    bookings: number;
    reviews: number;
  };
  averageRating?: number;
}

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface GoogleMapProps {
  spaces: Space[];
  selectedSpace: Space | null;
  onSpaceClick: (space: Space) => void;
  onClusterClick?: (clusterSpaces: Space[]) => void;
  onMapClick?: () => void;
  onBoundsChange: (bounds: MapBounds, zoom: number) => void;
  mapCenter: { lat: number; lng: number };
  mapZoom: number;
  isLoading?: boolean;
  isInCart?: (spaceId: string) => boolean;
  className?: string;
  clusterRadius?: number;
  maxClusterZoom?: number;
  onTilesLoaded?: () => void;
}

interface ClusterProperties {
  cluster: boolean;
  space?: Space;
  cluster_id?: number;
  point_count?: number;
  point_count_abbreviated?: string;
  spaceId?: string;
}

interface ClusterFeature {
  type: "Feature";
  id?: string | number;
  properties: ClusterProperties;
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SPACE_TYPE_ICONS: Record<string, React.ComponentType<any>> = {
  BILLBOARD: Building,
  STOREFRONT: Store,
  TRANSIT: Bus,
  DIGITAL_DISPLAY: Monitor,
  WINDOW_DISPLAY: Store,
  VEHICLE_WRAP: Car,
  OTHER: Camera,
};

const SPACE_TYPE_COLORS: Record<string, string> = {
  BILLBOARD: "#3B82F6",
  STOREFRONT: "#10B981",
  TRANSIT: "#F59E0B",
  DIGITAL_DISPLAY: "#8B5CF6",
  WINDOW_DISPLAY: "#EF4444",
  VEHICLE_WRAP: "#F97316",
  OTHER: "#6B7280",
};

const DEBUG = process.env.NODE_ENV === "development";

// Default world view
const DEFAULT_CENTER = { lat: 0, lng: 0 };
const DEFAULT_ZOOM = 2;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

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

// ============================================================================
// MARKER COMPONENTS - CIRCLE STYLE (like StreetEasy/Caasie)
// ============================================================================

const SpaceMarker: React.FC<{
  space: Space;
  isSelected: boolean;
  isInCart: boolean;
  onClick: () => void;
}> = React.memo(
  ({ space, isSelected, isInCart, onClick }) => {
    const color = SPACE_TYPE_COLORS[space.type] || "#6B7280";

    // Circle marker styling
    const size = isSelected ? 40 : isInCart ? 36 : 32;
    const borderWidth = isSelected ? 3 : 2;

    return (
      <AdvancedMarker
        position={{ lat: space.latitude, lng: space.longitude }}
        onClick={onClick}
        zIndex={isSelected ? 1000 : isInCart ? 500 : 100}
      >
        <div
          className="flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: "50%",
            backgroundColor: isSelected
              ? "#EF4444"
              : isInCart
              ? "#10B981"
              : `${color}CC`, // CC = 80% opacity
            border: `${borderWidth}px solid ${
              isSelected ? "#DC2626" : isInCart ? "#059669" : color
            }`,
            boxShadow: isSelected
              ? "0 4px 12px rgba(0, 0, 0, 0.3)"
              : "0 2px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <span className="text-white font-semibold text-xs">
            ${Math.floor(space.pricePerDay)}
          </span>
        </div>
      </AdvancedMarker>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.space.id === nextProps.space.id &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.isInCart === nextProps.isInCart
    );
  }
);

SpaceMarker.displayName = "SpaceMarker";

const ClusterMarker: React.FC<{
  cluster: ClusterFeature;
  onClick: () => void;
}> = React.memo(({ cluster, onClick }) => {
  const [longitude, latitude] = cluster.geometry.coordinates;
  const pointCount = cluster.properties.point_count || 0;

  // Scale cluster size based on point count
  const size = Math.min(40 + pointCount / 10, 60);

  return (
    <AdvancedMarker
      position={{ lat: latitude, lng: longitude }}
      onClick={onClick}
      zIndex={200}
    >
      <div
        className="flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          backgroundColor: "#2563EBCC", // Semi-transparent blue
          border: "3px solid #1D4ED8",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        }}
      >
        <span className="text-white font-bold text-sm">{pointCount}</span>
      </div>
    </AdvancedMarker>
  );
});

ClusterMarker.displayName = "ClusterMarker";

// ============================================================================
// MY LOCATION BUTTON
// ============================================================================

const MyLocationButton: React.FC<{
  onClick: () => void;
  isLocating: boolean;
}> = ({ onClick, isLocating }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLocating}
      className="absolute top-4 right-4 z-10 bg-white hover:bg-gray-50 disabled:bg-gray-100 rounded-lg shadow-lg p-3 transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed"
      title="Go to my location"
    >
      <Locate
        className={`h-5 w-5 text-gray-700 ${isLocating ? "animate-pulse" : ""}`}
      />
    </button>
  );
};

// ============================================================================
// MAP INITIALIZER
// ============================================================================

const MapInitializer: React.FC<{
  onBoundsChange: (bounds: MapBounds, zoom: number) => void;
  onBoundsReady: (bounds: BBox) => void;
  onMapReady?: () => void;
  onTilesLoaded?: () => void;
}> = ({ onBoundsChange, onMapReady, onBoundsReady, onTilesLoaded }) => {
  const map = useMap();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!map || hasInitialized.current) return;

    const listener = map.addListener("tilesloaded", () => {
      const bounds = map.getBounds();
      const zoom = map.getZoom();

      if (bounds && zoom !== undefined && !hasInitialized.current) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        const mapBounds: MapBounds = {
          north: ne.lat(),
          south: sw.lat(),
          east: ne.lng(),
          west: sw.lng(),
        };

        const boundsArray: BBox = [sw.lng(), sw.lat(), ne.lng(), ne.lat()];
        onBoundsReady(boundsArray);

        if (DEBUG) {
          console.log("🗺️ Map initialized with bounds:", mapBounds);
        }

        onBoundsChange(mapBounds, zoom);
        hasInitialized.current = true;
        onMapReady?.();
        onTilesLoaded?.();

        google.maps.event.removeListener(listener);
      }
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map, onBoundsChange, onMapReady, onBoundsReady, onTilesLoaded]);

  return null;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const GoogleMap: React.FC<GoogleMapProps> = ({
  spaces,
  selectedSpace,
  onSpaceClick,
  onClusterClick,
  onMapClick,
  onBoundsChange,
  mapCenter,
  mapZoom,
  isLoading = false,
  isInCart = () => false,
  className = "",
  clusterRadius = 75,
  maxClusterZoom = 20,
  onTilesLoaded,
}) => {
  const [mapReady, setMapReady] = useState(false);
  const [mapsApiLoaded, setMapsApiLoaded] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastBoundsRef = useRef<MapBounds | null>(null);
  const hasAutoLocated = useRef(false);

  const [bounds, setBounds] = useState<BBox | undefined>();
  const [zoom, setZoom] = useState(mapZoom);

  // Check if Google Maps API is loaded
  useEffect(() => {
    const checkGoogleMaps = () => {
      if (typeof window !== "undefined" && window.google?.maps) {
        setMapsApiLoaded(true);
      } else {
        const timeout = setTimeout(checkGoogleMaps, 100);
        return () => clearTimeout(timeout);
      }
    };
    checkGoogleMaps();
  }, []);

  // Auto-request location on mount
  useEffect(() => {
    if (!mapReady || hasAutoLocated.current) return;

    const requestLocation = () => {
      if ("geolocation" in navigator) {
        setIsLocating(true);

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            setUserLocation(location);
            hasAutoLocated.current = true;
            setIsLocating(false);

            if (mapRef.current) {
              mapRef.current.panTo(location);
              mapRef.current.setZoom(12); // Zoom in to show local spaces

              if (DEBUG) {
                console.log("📍 User location detected:", location);
              }
            }
          },
          (error) => {
            console.warn("Geolocation denied or failed:", error.message);
            setIsLocating(false);
            hasAutoLocated.current = true; // Don't keep trying
          },
          {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      }
    };

    // Request location after a short delay to let map settle
    const timer = setTimeout(requestLocation, 500);
    return () => clearTimeout(timer);
  }, [mapReady]);

  // Handle "My Location" button click
  const handleMyLocationClick = useCallback(() => {
    if ("geolocation" in navigator) {
      setIsLocating(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setUserLocation(location);
          setIsLocating(false);

          if (mapRef.current) {
            mapRef.current.panTo(location);
            mapRef.current.setZoom(12);

            if (DEBUG) {
              console.log("📍 Relocating to user position:", location);
            }
          }
        },
        (error) => {
          console.error("Geolocation error:", error.message);
          setIsLocating(false);
          alert(
            "Unable to get your location. Please check your browser permissions."
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  }, []);

  // Convert spaces to GeoJSON points
  const points = useMemo(() => {
    return spaces.map((space) => ({
      type: "Feature" as const,
      properties: {
        cluster: false,
        spaceId: space.id,
        space: space,
      },
      geometry: {
        type: "Point" as const,
        coordinates: [space.longitude, space.latitude],
      },
    }));
  }, [spaces]);

  const point = [
    {
      type: "Feature",
      properties: {
        cluster: false,
        id: 1,
        city: "Los Angeles",
      },
      geometry: {
        type: "Point",
        coordinates: [-118.2437, 34.0522],
      },
    },
    {
      type: "Feature",
      properties: {
        cluster: false,
        id: 2,
        city: "San Francisco",
      },
      geometry: {
        type: "Point",
        coordinates: [-117.4194, 37.7749],
      },
    },
    {
      type: "Feature",
      properties: {
        cluster: false,
        id: 3,
        city: "San Diego",
      },
      geometry: {
        type: "Point",
        coordinates: [-117.1611, 32.7157],
      },
    },
    {
      type: "Feature",
      properties: {
        cluster: false,
        id: 4,
        city: "San Jose",
      },
      geometry: {
        type: "Point",
        coordinates: [-121.8863, 37.3382],
      },
    },
    {
      type: "Feature",
      properties: {
        cluster: false,
        id: 5,
        city: "Sacramento",
      },
      geometry: {
        type: "Point",
        coordinates: [-121.4944, 38.5816],
      },
    },
  ];

  // Generate clusters
  const { clusters, supercluster } = useSupercluster({
    points: point,
    bounds: bounds,
    zoom: zoom,
    options: {
      radius: clusterRadius,
      maxZoom: maxClusterZoom,
    },
  });

  console.log("cluster", clusters);
  // Handle map idle with debounce and threshold
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

  // Cleanup
  useEffect(() => {
    return () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, []);

  // Store map reference
  const MapRefHandler: React.FC = () => {
    const map = useMap();
    useEffect(() => {
      if (map) {
        mapRef.current = map;
      }
    }, [map]);
    return null;
  };

  // Render markers and clusters
  const markers = useMemo(() => {
    if (!mapReady || clusters.length === 0) return [];

    if (DEBUG) {
      console.log("🔄 Rendering markers/clusters:", {
        count: clusters.length,
        selectedId: selectedSpace?.id || "none",
      });
    }

    return clusters.map((cluster) => {
      const properties = cluster.properties as ClusterProperties;
      const isCluster = properties.cluster;

      if (isCluster) {
        return (
          <ClusterMarker
            key={`cluster-${cluster.id}`}
            cluster={cluster as ClusterFeature}
            onClick={() => {
              if (!supercluster || typeof cluster.id !== "number") return;

              const clusterLeaves = supercluster.getLeaves(
                cluster.id,
                Infinity
              );
              const clusterSpaces = clusterLeaves
                .map((leaf) => (leaf.properties as any).space)
                .filter((space): space is Space => space !== undefined);

              if (DEBUG) {
                console.log("🎯 Cluster clicked:", {
                  clusterId: cluster.id,
                  spacesInCluster: clusterSpaces.length,
                });
              }

              if (onClusterClick && clusterSpaces.length > 0) {
                onClusterClick(clusterSpaces);
              } else {
                if (!mapRef.current) return;
                const [lng, lat] = cluster.geometry.coordinates;

                if (typeof lat === "number" && typeof lng === "number") {
                  const expansionZoom = supercluster.getClusterExpansionZoom(
                    cluster.id
                  );
                  mapRef.current.panTo({ lat, lng });
                  mapRef.current.setZoom(expansionZoom);
                }
              }
            }}
          />
        );
      }

      if (!properties.space) return null;

      return (
        <SpaceMarker
          key={properties.space.id}
          space={properties.space}
          isSelected={selectedSpace?.id === properties.space.id}
          isInCart={isInCart(properties.space.id)}
          onClick={() => onSpaceClick(properties.space!)}
        />
      );
    });
  }, [
    clusters,
    selectedSpace?.id,
    mapReady,
    isInCart,
    onSpaceClick,
    onClusterClick,
    supercluster,
  ]);

  // Legend - Desktop only
  const legend = useMemo(
    () => (
      <div className="hidden md:block absolute bottom-8 left-8 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl p-4 max-w-xs z-10">
        <h4 className="text-sm font-semibold text-white mb-3">Space Types</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {Object.entries(SPACE_TYPE_COLORS).map(([type, color]) => {
            const IconComponent = SPACE_TYPE_ICONS[type];
            return (
              <div key={type} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${color}CC` }}
                >
                  {IconComponent && <IconComponent size={10} color="white" />}
                </div>
                <span className="text-slate-300 leading-tight">
                  {type.replace("_", " ").toLowerCase()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    ),
    []
  );

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

  if (!apiKey) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-900 ${className}`}
      >
        <div className="text-center p-8">
          <MapPin className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Google Maps API key not configured</p>
          <p className="text-sm text-slate-500 mt-2">
            Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local
          </p>
        </div>
      </div>
    );
  }

  if (!mapsApiLoaded) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-900 ${className}`}
      >
        <div className="text-center p-8">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500 mx-auto mb-4" />
          <p className="text-slate-400">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={DEFAULT_CENTER}
          defaultZoom={DEFAULT_ZOOM}
          onIdle={handleIdle}
          onZoomChanged={handleIdle}
          onClick={(e) => {
            if (onMapClick && !e.detail.placeId) {
              onMapClick();
            }
          }}
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID"}
          style={{ width: "100%", height: "100%" }}
          gestureHandling="greedy"
          disableDefaultUI={false}
          zoomControl={true}
          clickableIcons={false}
          mapTypeControl={false}
          scaleControl={false}
          streetViewControl={false}
          rotateControl={false}
          fullscreenControl={false}
        >
          <MapRefHandler />
          <MapInitializer
            onBoundsChange={onBoundsChange}
            onBoundsReady={setBounds}
            onMapReady={() => setMapReady(true)}
            onTilesLoaded={onTilesLoaded}
          />

          {markers}
        </Map>
      </APIProvider>

      <MyLocationButton
        onClick={handleMyLocationClick}
        isLocating={isLocating}
      />
      {legend}
    </div>
  );
};

GoogleMap.displayName = "GoogleMap";

export default GoogleMap;
