// src/components/landing/LandingPage.tsx - OPTIMISTIC UI - NO MARKER FLICKERING
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { DollarSign, Eye, Image as ImageIcon, Loader2, MapPin, Star } from "lucide-react";
import { GoogleMap } from "../browse/maps/GoogleMap";
import { FloatingMapControls } from "../browse/map/FloatingMapControls";
import { SpaceDetailsSidebar } from "../browse/sheets/SpaceDetailsSidebar";
import { FiltersPanel } from "../browse/filters/FiltersPanel";
import { SignInModal } from "../auth/SignInModal";
import { SignUpModal } from "../auth/SignUpModal";
import { AuthModal } from "../auth/AuthModal";
import { Navigation } from "../layout/Navigation";
import { MobileLandingPage } from "./MobileLandingPage";
import type { RouterOutputs } from "../../../../elaview-mvp/src/trpc/react";
import { api } from "../../../../elaview-mvp/src/trpc/react";

type SpaceFromAPI = RouterOutputs["spaces"]["browsePublic"]["spaces"][number];

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface FilterState {
  maxPrice: number;
  spaceTypes: string[];
}

const DEFAULT_CENTER = { lat: 39.8283, lng: -98.5795 };
const DEFAULT_ZOOM = 4;
const MAX_PRICE = 500;

const getDynamicLimit = (zoom: number): number => {
  if (zoom <= 6) return 500;
  if (zoom <= 10) return 300;
  if (zoom <= 13) return 150;
  return 75;
};

export default function LandingPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded: clerkLoaded } = useUser();

  const [selectedSpace, setSelectedSpace] = useState<SpaceFromAPI | null>(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const [mapBounds, setMapBounds] = useState<MapBounds | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [hasLoadedSpaces, setHasLoadedSpaces] = useState(false);

  // ✅ OPTIMISTIC UI: Keep old markers visible until new ones load
  const [displaySpaces, setDisplaySpaces] = useState<SpaceFromAPI[]>([]);

  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<FilterState>({
    maxPrice: MAX_PRICE,
    spaceTypes: [],
  });

  const { data: user, isLoading: userLoading } = api.user.getCurrentUser.useQuery(undefined, {
    enabled: isSignedIn && clerkLoaded && isMounted,
    retry: false,
  });

  useEffect(() => {
    setIsMounted(true);

    if (typeof window === "undefined") return;

    const locationPreference = window.localStorage.getItem("locationPreference");

    if (!locationPreference && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          console.log("📍 User location cached (not auto-zooming):", userLocation);
          window.localStorage.setItem("locationPreference", "allowed");
          window.localStorage.setItem("userLocation", JSON.stringify(userLocation));
        },
        (error) => {
          console.log("⚠️ Geolocation denied:", error.message);
          window.localStorage.setItem("locationPreference", "denied");
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }

    console.log("🗺️  Starting with full US view (zoom 4)");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkMobileViewport = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobileViewport(isMobile);
      console.log(`📱 Viewport: ${isMobile ? "Mobile" : "Desktop"} (${window.innerWidth}px)`);
    };

    checkMobileViewport();
    window.addEventListener("resize", checkMobileViewport);

    return () => {
      window.removeEventListener("resize", checkMobileViewport);
    };
  }, []);

  useEffect(() => {
    console.log("🖥️ RENDER STATE:", {
      isMobileViewport,
      isMounted,
      shouldShowMobile: isMobileViewport && isMounted,
      shouldShowDesktop: !isMobileViewport || !isMounted,
      windowWidth: typeof window !== "undefined" ? window.innerWidth : "SSR",
    });
  }, [isMobileViewport, isMounted]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectedSpace &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        console.log("👆 Clicked outside sidebar, closing...");
        setSelectedSpace(null);
      }
    };

    if (selectedSpace) {
      const timeoutId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [selectedSpace]);

  const queryInput = useMemo(() => {
    const input = {
      north: mapBounds?.north,
      south: mapBounds?.south,
      east: mapBounds?.east,
      west: mapBounds?.west,
      minPrice: 0,
      maxPrice: filters.maxPrice >= MAX_PRICE ? undefined : filters.maxPrice,
      types: filters.spaceTypes as any[],
      zoom: mapZoom,
      sort: "popularity" as const,
      limit: getDynamicLimit(mapZoom),
    };

    console.log("📊 Query Input:", {
      hasBounds: !!mapBounds,
      bounds: mapBounds
        ? {
            north: mapBounds.north,
            south: mapBounds.south,
            east: mapBounds.east,
            west: mapBounds.west,
            latRange: (mapBounds.north - mapBounds.south).toFixed(2),
            lngRange: (mapBounds.east - mapBounds.west).toFixed(2),
          }
        : "NO BOUNDS",
      zoom: mapZoom,
      limit: input.limit,
      sort: input.sort,
      filters: {
        maxPrice: input.maxPrice,
        types: input.types.length,
      },
    });

    return input;
  }, [mapBounds, filters, mapZoom]);

  const {
    data: spacesData,
    isLoading: spacesLoading,
    refetch,
  } = api.spaces.browsePublic.useQuery(queryInput, {
    enabled: !!mapBounds,
    staleTime: 300000,
    gcTime: 600000,
    refetchOnWindowFocus: false,
  });

  // Track when initial data loads
  useEffect(() => {
    if (spacesData && !hasLoadedSpaces) {
      setHasLoadedSpaces(true);
    }
  }, [spacesData, hasLoadedSpaces]);

  // ✅ OPTIMISTIC UI: Update displaySpaces only when new data arrives
  useEffect(() => {
    if (spacesData?.spaces && spacesData.spaces.length > 0) {
      setDisplaySpaces(spacesData.spaces);

      // Debug log geographic distribution
      const stateDistribution = spacesData.spaces.reduce(
        (acc, space) => {
          acc[space.state] = (acc[space.state] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const states = Object.keys(stateDistribution).sort();
      const statesText =
        states.slice(0, 10).join(", ") +
        (states.length > 10 ? `, +${states.length - 10} more` : "");

      console.log("📦 Spaces Data:", {
        count: spacesData.spaces.length,
        isLoading: spacesLoading,
        statesCount: states.length,
        statesSample: statesText,
        topStates: Object.entries(stateDistribution)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .slice(0, 5)
          .map(([state, count]) => `${state}: ${count}`),
        sample: {
          firstSpace: spacesData.spaces[0]?.city + ", " + spacesData.spaces[0]?.state,
          lastSpace:
            spacesData.spaces[spacesData.spaces.length - 1]?.city +
            ", " +
            spacesData.spaces[spacesData.spaces.length - 1]?.state,
        },
      });
    }
  }, [spacesData?.spaces, spacesLoading]);

  const nearestSpaces = useMemo(() => {
    if (!displaySpaces.length) return [];

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const spacesWithDistance = displaySpaces.map((space) => ({
      ...space,
      distance: calculateDistance(mapCenter.lat, mapCenter.lng, space.latitude, space.longitude),
    }));

    return spacesWithDistance.sort((a, b) => a.distance - b.distance).slice(0, 18);
  }, [displaySpaces, mapCenter]);

  const handleBoundsChange = useCallback((bounds: MapBounds, zoom: number) => {
    console.log("🗺️  MAP BOUNDS CHANGED:", {
      zoom: zoom,
      bounds: {
        north: bounds.north.toFixed(4),
        south: bounds.south.toFixed(4),
        east: bounds.east.toFixed(4),
        west: bounds.west.toFixed(4),
      },
      coverage: {
        latRange: (bounds.north - bounds.south).toFixed(2) + "°",
        lngRange: (bounds.east - bounds.west).toFixed(2) + "°",
        approximateArea: `${((bounds.north - bounds.south) * (bounds.east - bounds.west)).toFixed(0)}° squared`,
      },
      dynamicLimit: getDynamicLimit(zoom),
    });

    setMapZoom(zoom);
    setMapBounds(bounds);
  }, []);

  const handleSpaceClick = useCallback(
    (space: SpaceFromAPI) => {
      if (selectedSpace?.id === space.id) {
        setSelectedSpace(null);
      } else {
        setSelectedSpace(space);
      }
    },
    [selectedSpace]
  );

  const handleCardClick = useCallback((space: SpaceFromAPI) => {
    console.log("🖱️  Card clicked:", space.title);
    setSelectedSpace(space);
    setMapCenter({ lat: space.latitude, lng: space.longitude });
    setMapZoom(14);
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    console.log("🔧 Filters changed:", newFilters);
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const applyFilters = useCallback(() => {
    console.log("✅ Applying filters");
    refetch();
    setShowFilters(false);
  }, [refetch]);

  const resetFilters = useCallback(() => {
    console.log("🔄 Resetting filters");
    setFilters({
      maxPrice: MAX_PRICE,
      spaceTypes: [],
    });
    refetch();
  }, [refetch]);

  const activeFilterCount =
    (filters.spaceTypes.length > 0 ? 1 : 0) + (filters.maxPrice < MAX_PRICE ? 1 : 0);

  const handleMyLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      setIsLocating(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          console.log("📍 User location detected:", userLocation);
          setMapCenter(userLocation);
          setMapZoom(12);
          setIsLocating(false);

          window.localStorage.setItem("locationPreference", "allowed");
          window.localStorage.setItem("userLocation", JSON.stringify(userLocation));
        },
        (error) => {
          console.log("⚠️ Geolocation error:", error.message);
          setIsLocating(false);
          alert("Unable to get your location. Please check your browser settings.");
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, []);

  if (isMobileViewport && isMounted) {
    console.log("🔍 RENDERING: Mobile Landing Page with AuthModal");
    return (
      <>
        <MobileLandingPage
          onSignIn={() => {
            console.log("👆 Mobile: Sign In clicked");
            setShowSignIn(true);
          }}
          onGetStarted={() => {
            console.log("👆 Mobile: Get Started clicked");
            setShowSignUp(true);
          }}
        />

        <AuthModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} />

        <SignUpModal
          isOpen={showSignUp}
          onClose={() => setShowSignUp(false)}
          onSwitchToSignIn={() => {
            setShowSignUp(false);
            setShowSignIn(true);
          }}
        />
      </>
    );
  }

  console.log("🔍 RENDERING: Desktop Landing Page with SignInModal");
  return (
    <div className="flex h-screen flex-col bg-slate-950">
      <Navigation
        spacesCount={displaySpaces.length}
        onSignInClick={() => {
          console.log("👆 Desktop: Sign In clicked");
          setShowSignIn(true);
        }}
        onSignUpClick={() => {
          console.log("👆 Desktop: Sign Up clicked");
          setShowSignUp(true);
        }}
      />

      <div className="flex min-h-0 flex-1 pt-16">
        <div className="flex w-[400px] shrink-0 flex-col border-r border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Nearby Spaces</h2>
              <button
                onClick={handleMyLocation}
                disabled={isLocating}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLocating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Locating...
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4" />
                    My Location
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-slate-400">Sorted by distance from map center</p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {spacesLoading && !hasLoadedSpaces ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : nearestSpaces.length === 0 ? (
              <div className="py-12 text-center">
                <MapPin className="mx-auto mb-3 h-12 w-12 text-slate-600" />
                <p className="text-slate-400">No spaces found nearby</p>
                <p className="mt-1 text-sm text-slate-500">Try zooming out or moving the map</p>
              </div>
            ) : (
              nearestSpaces.map((space) => (
                <button
                  key={space.id}
                  onClick={() => handleCardClick(space)}
                  className={`w-full overflow-hidden rounded-xl border bg-slate-800 text-left transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 ${
                    selectedSpace?.id === space.id
                      ? "border-blue-500 ring-2 ring-blue-500/20"
                      : "border-slate-700"
                  }`}
                >
                  <div className="group relative h-40 bg-slate-700">
                    {space.images && space.images.length > 0 ? (
                      <>
                        <img
                          src={space.images[0]}
                          alt={space.title}
                          className="h-full w-full object-cover"
                        />

                        {space.images.length > 1 && (
                          <div className="absolute right-2 bottom-2 flex items-center gap-1 rounded-md border border-white/20 bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                            <ImageIcon className="h-3 w-3" />
                            {space.images.length}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <MapPin className="h-12 w-12 text-slate-600" />
                      </div>
                    )}

                    <div className="absolute top-2 left-2 rounded-md border border-slate-700 bg-slate-900/90 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {space.type.replace("_", " ")}
                    </div>

                    <div className="absolute top-2 right-2 rounded-md bg-blue-600/90 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {space.distance < 1
                        ? `${(space.distance * 1000).toFixed(0)}m away`
                        : `${space.distance.toFixed(1)}km away`}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="mb-1 line-clamp-1 text-base font-semibold text-white">
                      {space.title}
                    </h3>

                    <p className="mb-3 line-clamp-1 text-sm text-slate-400">
                      {space.city}, {space.state}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-slate-400">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-semibold text-white">
                          ${Number(space.pricePerDay)}
                        </span>
                        <span className="text-sm">/day</span>
                      </div>

                      {space.averageRating && (
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm font-medium text-white">
                            {space.averageRating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-700 pt-3">
                      <span className="flex items-center gap-1 text-sm font-medium text-blue-400">
                        <Eye className="h-4 w-4" />
                        View Details
                      </span>
                      {space.totalBookings > 0 && (
                        <span className="text-xs text-slate-500">
                          {space.totalBookings} bookings
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="relative min-w-0 flex-1 bg-slate-950 p-4">
          <div className="relative h-full w-full overflow-hidden rounded-xl border border-slate-800 shadow-2xl">
            <FloatingMapControls
              campaigns={[]}
              selectedCampaignId={null}
              isLocked={false}
              onCampaignChange={() => {}}
              onCreateCampaign={() => setShowSignUp(true)}
              cartCount={0}
              spacesCount={displaySpaces.length}
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(!showFilters)}
              activeFilterCount={activeFilterCount}
              isPublicView={true}
            />

            {!isMapLoaded && (
              <div className="absolute inset-0 z-0 flex animate-pulse items-center justify-center bg-slate-900">
                <div className="flex flex-col items-center text-slate-700">
                  <MapPin className="mb-4 h-16 w-16 opacity-50" />
                  <div className="mb-2 h-2 w-32 rounded-full bg-slate-800"></div>
                  <div className="h-2 w-24 rounded-full bg-slate-800"></div>
                </div>

                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: "radial-gradient(circle, #334155 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                    opacity: 0.1,
                  }}
                ></div>
              </div>
            )}

            <GoogleMap
              spaces={displaySpaces as any}
              selectedSpace={selectedSpace}
              onSpaceClick={handleSpaceClick as any}
              onBoundsChange={handleBoundsChange}
              mapCenter={mapCenter}
              mapZoom={mapZoom}
              isLoading={false}
              isInCart={() => false}
              className={`h-full w-full transition-opacity duration-500 ${isMapLoaded ? "opacity-100" : "opacity-0"}`}
              onTilesLoaded={() => setIsMapLoaded(true)}
            />

            <FiltersPanel
              isOpen={showFilters}
              filters={filters}
              onFilterChange={handleFilterChange}
              onApply={applyFilters}
              onReset={resetFilters}
              onClose={() => setShowFilters(false)}
            />

            {isMounted && selectedSpace && (
              <div ref={sidebarRef}>
                <SpaceDetailsSidebar
                  space={selectedSpace}
                  campaignId={null}
                  isInCart={false}
                  onClose={() => setSelectedSpace(null)}
                  onSuccess={() => {}}
                  onCreateCampaign={() => setShowSignUp(true)}
                  isPublicView={true}
                  onAuthRequired={() => setShowSignUp(true)}
                />
              </div>
            )}

            {!spacesLoading && mapBounds && displaySpaces.length === 0 && hasLoadedSpaces && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
                <div className="pointer-events-auto max-w-md rounded-xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800">
                    <MapPin className="h-7 w-7 text-slate-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">No spaces found</h3>
                  <p className="mb-6 text-slate-400">
                    Try adjusting your filters or zoom out to see more areas.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-all hover:bg-blue-700"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <SignInModal
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
        onSwitchToSignUp={() => {
          setShowSignIn(false);
          setShowSignUp(true);
        }}
      />

      <SignUpModal
        isOpen={showSignUp}
        onClose={() => setShowSignUp(false)}
        onSwitchToSignIn={() => {
          setShowSignUp(false);
          setShowSignIn(true);
        }}
      />
    </div>
  );
}
