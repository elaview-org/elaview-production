// // src/app/(advertiser)/browse/page.tsx - OPTIMISTIC UI - NO MARKER FLICKERING
// "use client";

// import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
// import { useUser } from "@clerk/nextjs";
// import { Loader2, AlertCircle, ShoppingCart } from "lucide-react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { AnimatePresence } from "framer-motion";
// import { api } from "../../../../../elaview-mvp/src/trpc/react";
// import { GoogleMap } from "../../../../../elaview-mvp/src/components/browse/maps/GoogleMap";
// import { FloatingMapControls } from "../../../../../elaview-mvp/src/components/browse/map/FloatingMapControls";
// import { SpaceDetailsSidebar } from "../../../../../elaview-mvp/src/components/browse/sheets/SpaceDetailsSidebar";
// import { MobileSpaceSheet } from "../../../../../elaview-mvp/src/components/browse/sheets/MobileSpaceSheet";
// import { FiltersPanel } from "../../../../../elaview-mvp/src/components/browse/filters/FiltersPanel";
// import { MapLoadingState } from "../../../../../elaview-mvp/src/components/browse/map/MapLoadingState";
// import { SpacesEmptyState } from "../../../../../elaview-mvp/src/components/browse/states/SpacesEmptyState";
// import { SpacesErrorState } from "../../../../../elaview-mvp/src/components/browse/states/SpacesErrorState";
// import { NetworkErrorBanner } from "../../../../../elaview-mvp/src/components/browse/states/NetworkErrorBanner";
// import { NoCampaignState } from "../../../../../elaview-mvp/src/components/browse/states/NoCampaignState";
// import { BrowseErrorBoundary } from "../../../../../elaview-mvp/src/components/browse/states/ErrorBoundary";
// import { SearchBar, type SearchResult } from "../../../../../elaview-mvp/src/components/browse/search/SearchBar";
// import { searchSpaces } from "../../../../../elaview-mvp/src/lib/search-utils";
// import type { RouterOutputs } from "../../../../../elaview-mvp/src/trpc/react";

// type SpaceFromAPI = RouterOutputs["spaces"]["browse"]["spaces"][number];

// interface MapBounds {
//   north: number;
//   south: number;
//   east: number;
//   west: number;
// }

// interface FilterState {
//   minPrice: number;
//   maxPrice: number;
//   spaceTypes: string[];
//   sort: "popularity" | "price_low" | "price_high" | "rating" | "newest";
// }

// const DEFAULT_CENTER = { lat: 39.8283, lng: -98.5795 }; // Geographic center of USA
// const DEFAULT_ZOOM = 4; // Shows entire continental USA

// // ✅ HELPER: Dynamic limit based on zoom level
// const getDynamicLimit = (zoom: number): number => {
//   if (zoom <= 8) return 500; // Country/state view - need lots for clustering
//   if (zoom <= 12) return 200; // City view - moderate amount
//   return 100; // Neighborhood view - fewer, more detailed
// };

// function BrowsePageInternal() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { user, isLoaded } = useUser();
//   const [selectedSpace, setSelectedSpace] = useState<SpaceFromAPI | null>(null);
//   const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
//   const [campaignLocked, setCampaignLocked] = useState(false);
//   const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
//   const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
//   const [mapBounds, setMapBounds] = useState<MapBounds | undefined>();
//   const [showFilters, setShowFilters] = useState(false);
//   const [isMounted, setIsMounted] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [collapseSheet, setCollapseSheet] = useState(false);
//   const [hasLoadedSpaces, setHasLoadedSpaces] = useState(false);

//   // ✅ OPTIMISTIC UI: Keep old markers visible until new ones load
//   const [displaySpaces, setDisplaySpaces] = useState<SpaceFromAPI[]>([]);

//   // Phase 3A Task 2: Search state
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

//   const sidebarRef = useRef<HTMLDivElement>(null);

//   const [filters, setFilters] = useState<FilterState>({
//     minPrice: 0,
//     maxPrice: 1000,
//     spaceTypes: [],
//     sort: "popularity",
//   });

//   const updateURLDebounced = useRef<NodeJS.Timeout | undefined>(undefined);
//   const hasInitializedFromURL = useRef(false);

//   const updateURL = useCallback(
//     (params: Record<string, string | number | string[] | null | undefined>) => {
//       if (updateURLDebounced.current) {
//         clearTimeout(updateURLDebounced.current);
//       }

//       updateURLDebounced.current = setTimeout(() => {
//         const url = new URLSearchParams();

//         Object.entries(params).forEach(([key, value]) => {
//           if (value === null || value === undefined) return;

//           if (Array.isArray(value)) {
//             if (value.length > 0) url.set(key, value.join(","));
//           } else {
//             url.set(key, String(value));
//           }
//         });

//         router.replace(`/browse?${url.toString()}`, { scroll: false });
//       }, 500);
//     },
//     [router]
//   );

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     checkMobile();
//     window.addEventListener("resize", checkMobile);

//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         selectedSpace &&
//         sidebarRef.current &&
//         !sidebarRef.current.contains(event.target as Node)
//       ) {
//         setSelectedSpace(null);
//       }
//     };

//     if (selectedSpace) {
//       const timer = setTimeout(() => {
//         document.addEventListener("mousedown", handleClickOutside);
//       }, 100);

//       return () => {
//         clearTimeout(timer);
//         document.removeEventListener("mousedown", handleClickOutside);
//       };
//     }
//   }, [selectedSpace]);

//   const {
//     data: campaignsData,
//     isLoading: campaignsLoading,
//     refetch: refetchCampaigns,
//   } = api.campaigns.getMyCampaigns.useQuery(undefined, {
//     enabled: isLoaded && !!user,
//     staleTime: 30000,
//     refetchOnWindowFocus: true,
//     refetchOnMount: true,
//   });

//   const activeCampaigns = useMemo(() => {
//     if (!campaignsData) return [];
//     const campaigns = Array.isArray(campaignsData) ? campaignsData : campaignsData.campaigns || [];
//     return campaigns
//       .filter((c) => ["DRAFT", "SUBMITTED", "ACTIVE"].includes(c.status))
//       .map((c) => ({
//         ...c,
//         createdAt: c.createdAt || new Date(),
//       }));
//   }, [campaignsData]);

//   useEffect(() => {
//     if (!campaignLocked && activeCampaigns.length > 0 && !selectedCampaignId) {
//       if (activeCampaigns.length === 1) {
//         setSelectedCampaignId(activeCampaigns[0]!.id);
//       } else {
//         const mostRecent = activeCampaigns.sort(
//           (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//         )[0];
//         if (mostRecent) {
//           setSelectedCampaignId(mostRecent.id);
//         }
//       }
//     }
//   }, [activeCampaigns, selectedCampaignId, campaignLocked]);

//   const queryInput = useMemo(() => {
//     const roundedBounds = mapBounds
//       ? {
//           north: Number(mapBounds.north.toFixed(3)),
//           south: Number(mapBounds.south.toFixed(3)),
//           east: Number(mapBounds.east.toFixed(3)),
//           west: Number(mapBounds.west.toFixed(3)),
//         }
//       : undefined;

//     return {
//       north: roundedBounds?.north,
//       south: roundedBounds?.south,
//       east: roundedBounds?.east,
//       west: roundedBounds?.west,
//       minPrice: filters.minPrice,
//       maxPrice: filters.maxPrice,
//       types: filters.spaceTypes as any[],
//       zoom: mapZoom,
//       sort: filters.sort,
//       limit: getDynamicLimit(mapZoom),
//     };
//   }, [
//     mapBounds?.north.toFixed(3),
//     mapBounds?.south.toFixed(3),
//     mapBounds?.east.toFixed(3),
//     mapBounds?.west.toFixed(3),
//     filters.minPrice,
//     filters.maxPrice,
//     filters.spaceTypes,
//     filters.sort,
//     mapZoom,
//   ]);

//   const {
//     data: spacesData,
//     isLoading: spacesLoading,
//     error,
//     refetch,
//   } = api.spaces.browse.useQuery(queryInput, {
//     enabled: isLoaded && !!user && !!mapBounds,
//     staleTime: 300000,
//     gcTime: 600000,
//     refetchOnWindowFocus: false,
//   });

//   // Track when initial data loads
//   useEffect(() => {
//     if (spacesData && !hasLoadedSpaces) {
//       setHasLoadedSpaces(true);
//     }
//   }, [spacesData, hasLoadedSpaces]);

//   // ✅ OPTIMISTIC UI: Update displaySpaces only when new data arrives
//   useEffect(() => {
//     if (spacesData?.spaces && spacesData.spaces.length > 0) {
//       setDisplaySpaces(spacesData.spaces);
//     }
//     // Keep old spaces visible if new fetch returns empty or is still loading
//   }, [spacesData?.spaces]);

//   const { data: cartData, refetch: refetchCart } = api.cart.getCart.useQuery(undefined, {
//     enabled: isLoaded && !!user,
//     staleTime: 30000,
//   });

//   const cartSpaceIds = useMemo(
//     () => new Set(cartData?.items?.map((item) => item.space.id) || []),
//     [cartData?.items]
//   );

//   useEffect(() => {
//     if (cartData?.items && cartData.items.length > 0) {
//       setCampaignLocked(true);

//       const cartCampaignId = cartData.items[0]?.campaignId;
//       if (cartCampaignId && !selectedCampaignId) {
//         setSelectedCampaignId(cartCampaignId);
//       }
//     } else {
//       setCampaignLocked(false);
//     }
//   }, [cartData, selectedCampaignId]);

//   useEffect(() => {
//     if (!isMounted || hasInitializedFromURL.current) return;
//     hasInitializedFromURL.current = true;

//     const urlMaxPrice = searchParams.get("maxPrice");
//     const urlMinPrice = searchParams.get("minPrice");
//     const urlTypes = searchParams.get("types");

//     if (urlMaxPrice) {
//       const price = parseInt(urlMaxPrice);
//       if (price >= 0 && price <= 10000) {
//         setFilters((prev) => ({ ...prev, maxPrice: price }));
//       }
//     }
//     if (urlMinPrice) {
//       const price = parseInt(urlMinPrice);
//       if (price >= 0 && price <= 10000) {
//         setFilters((prev) => ({ ...prev, minPrice: price }));
//       }
//     }
//     if (urlTypes) {
//       const types = urlTypes.split(",").filter(Boolean);
//       setFilters((prev) => ({ ...prev, spaceTypes: types }));
//     }

//     const urlSearchQuery = searchParams.get("q");
//     if (urlSearchQuery) {
//       setSearchQuery(urlSearchQuery);
//     }

//     const urlLat = searchParams.get("lat");
//     const urlLng = searchParams.get("lng");
//     const urlZoom = searchParams.get("zoom");

//     if (urlLat && urlLng) {
//       const lat = parseFloat(urlLat);
//       const lng = parseFloat(urlLng);
//       if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
//         setMapCenter({ lat, lng });
//       }
//     }
//     if (urlZoom) {
//       const zoom = parseInt(urlZoom);
//       if (zoom >= 1 && zoom <= 22) {
//         setMapZoom(zoom);
//       }
//     }

//     const urlSpaceId = searchParams.get("space");
//     if (urlSpaceId && displaySpaces.length > 0) {
//       const space = displaySpaces.find((s) => s.id === urlSpaceId);
//       if (space) setSelectedSpace(space);
//     }
//   }, [isMounted, searchParams, displaySpaces]);

//   useEffect(() => {
//     if (!isMounted) return;

//     updateURL({
//       maxPrice: filters.maxPrice !== 1000 ? filters.maxPrice : null,
//       minPrice: filters.minPrice !== 0 ? filters.minPrice : null,
//       types: filters.spaceTypes.length > 0 ? filters.spaceTypes : null,
//     });
//   }, [filters, isMounted, updateURL]);

//   useEffect(() => {
//     if (!isMounted) return;

//     updateURL({
//       lat: mapCenter.lat.toFixed(4),
//       lng: mapCenter.lng.toFixed(4),
//       zoom: mapZoom,
//     });
//   }, [mapCenter, mapZoom, isMounted, updateURL]);

//   useEffect(() => {
//     if (!isMounted) return;

//     updateURL({
//       space: selectedSpace?.id || null,
//     });
//   }, [selectedSpace, isMounted, updateURL]);

//   useEffect(() => {
//     if (!isMounted) return;

//     updateURL({
//       q: searchQuery || null,
//     });
//   }, [searchQuery, isMounted, updateURL]);

//   useEffect(() => {
//     if (isLoaded && user && displaySpaces.length > 0) {
//       const pendingSpaceData = sessionStorage.getItem("pendingSpace");
//       if (pendingSpaceData) {
//         try {
//           const { spaceId, intent } = JSON.parse(pendingSpaceData);
//           if (intent === "add-to-campaign") {
//             const space = displaySpaces.find((s) => s.id === spaceId);
//             if (space) {
//               setSelectedSpace(space);
//               setMapCenter({ lat: space.latitude, lng: space.longitude });
//             }
//           }
//         } catch (error) {
//           console.error("Error parsing pending space data:", error);
//         } finally {
//           sessionStorage.removeItem("pendingSpace");
//         }
//       }
//     }
//   }, [isLoaded, user, displaySpaces]);

//   const handleBoundsChange = useCallback((bounds: MapBounds, zoom: number) => {
//     const latRange = bounds.north - bounds.south;
//     const lngRange = bounds.east - bounds.west;

//     const bufferedBounds = {
//       north: bounds.north + latRange * 0.25,
//       south: bounds.south - latRange * 0.25,
//       east: bounds.east + lngRange * 0.25,
//       west: bounds.west - lngRange * 0.25,
//     };

//     setMapZoom(zoom);
//     setMapBounds(bufferedBounds);
//   }, []);

//   const handleSpaceClick = useCallback(
//     (space: SpaceFromAPI) => {
//       if (selectedSpace?.id === space.id) {
//         setSelectedSpace(null);
//       } else {
//         setSelectedSpace(space);
//         setMapCenter({ lat: space.latitude, lng: space.longitude });
//       }
//     },
//     [selectedSpace]
//   );

//   const isInCart = useCallback(
//     (spaceId: string): boolean => {
//       return cartSpaceIds.has(spaceId);
//     },
//     [cartSpaceIds]
//   );

//   const handleCampaignChange = useCallback(
//     (campaignId: string) => {
//       if (!campaignLocked) {
//         setSelectedCampaignId(campaignId);
//       }
//     },
//     [campaignLocked]
//   );

//   const handleAddToCartSuccess = useCallback(() => {
//     refetchCart();
//     setSelectedSpace(null);
//   }, [refetchCart]);

//   const handleCloseSidebar = useCallback(() => {
//     setSelectedSpace(null);
//   }, []);

//   const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
//     setFilters((prev) => ({ ...prev, ...newFilters }));
//   }, []);

//   const applyFilters = useCallback(() => {
//     refetch();
//     setShowFilters(false);
//   }, [refetch]);

//   const resetFilters = useCallback(() => {
//     setFilters({
//       minPrice: 0,
//       maxPrice: 10000,
//       spaceTypes: [],
//       sort: "popularity",
//     });
//     refetch();
//   }, [refetch]);

//   const handleCreateCampaign = useCallback(() => {
//     router.push("/campaigns/new");
//   }, [router]);

//   const handleSearch = useCallback(
//     (query: string) => {
//       setSearchQuery(query);

//       if (!query.trim()) {
//         setSearchResults([]);
//         return;
//       }

//       const results = searchSpaces(displaySpaces as any, query);
//       setSearchResults(results);
//     },
//     [displaySpaces]
//   );

//   const handleClearSearch = useCallback(() => {
//     setSearchQuery("");
//     setSearchResults([]);
//   }, []);

//   const handleSelectResult = useCallback(
//     (result: SearchResult) => {
//       if (result.type === "space") {
//         const space = displaySpaces.find((s) => s.id === result.id);
//         if (space) {
//           setMapCenter({ lat: space.latitude, lng: space.longitude });
//           setMapZoom(15);
//           setSelectedSpace(space);
//           setSearchQuery("");
//           setSearchResults([]);
//         }
//       }
//     },
//     [displaySpaces]
//   );

//   useEffect(() => {
//     if (searchQuery.trim()) {
//       const results = searchSpaces(displaySpaces as any, searchQuery);
//       setSearchResults(results);
//     } else {
//       setSearchResults([]);
//     }
//   }, [searchQuery, displaySpaces]);

//   const filteredSpaces = useMemo(() => {
//     if (searchQuery.trim() && searchResults.length > 0) {
//       const resultIds = new Set(searchResults.map((r) => r.id));
//       return displaySpaces.filter((s) => resultIds.has(s.id));
//     }
//     return displaySpaces;
//   }, [searchQuery, searchResults, displaySpaces]);

//   useEffect(() => {
//     if (searchQuery.trim()) {
//       handleSearch(searchQuery);
//     } else {
//       setSearchResults([]);
//     }
//   }, [searchQuery, handleSearch]);

//   const activeFilterCount =
//     (filters.spaceTypes.length > 0 ? 1 : 0) +
//     (filters.minPrice > 0 ? 1 : 0) +
//     (filters.maxPrice < 10000 ? 1 : 0);

//   if (!isLoaded || campaignsLoading) {
//     return (
//       <div className="flex h-full items-center justify-center bg-slate-950">
//         <div className="flex flex-col items-center gap-3">
//           <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
//           <p className="text-sm text-slate-400">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="flex h-full items-center justify-center bg-slate-950">
//         <div className="mx-auto max-w-md rounded-xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl">
//           <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
//             <AlertCircle className="h-7 w-7 text-red-400" />
//           </div>
//           <h2 className="mb-2 text-xl font-bold text-white">Sign In Required</h2>
//           <p className="mb-6 text-slate-400">Please sign in to browse advertising spaces.</p>
//           <button
//             onClick={() => router.push("/sign-in")}
//             className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-all hover:bg-blue-700"
//           >
//             Sign In
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const cartCount = cartData?.items?.length || 0;

//   return (
//     <>
//       <NetworkErrorBanner />

//       <FiltersPanel
//         isOpen={showFilters}
//         filters={filters}
//         onFilterChange={handleFilterChange}
//         onApply={applyFilters}
//         onReset={resetFilters}
//         onClose={() => setShowFilters(false)}
//       />

//       <div className="h-full w-full md:p-4">
//         <div className="relative h-full w-full overflow-hidden md:rounded-xl md:border md:border-slate-800 md:shadow-2xl">
//           {activeCampaigns.length === 0 ? (
//             <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950">
//               <NoCampaignState onCreateCampaign={handleCreateCampaign} />
//             </div>
//           ) : (
//             <>
//               <FloatingMapControls
//                 campaigns={activeCampaigns}
//                 selectedCampaignId={selectedCampaignId}
//                 isLocked={campaignLocked}
//                 onCampaignChange={handleCampaignChange}
//                 onCreateCampaign={handleCreateCampaign}
//                 cartCount={cartCount}
//                 spacesCount={filteredSpaces.length}
//                 showFilters={showFilters}
//                 onToggleFilters={() => setShowFilters(!showFilters)}
//                 activeFilterCount={activeFilterCount}
//                 isPublicView={false}
//                 filters={{
//                   maxPrice: filters.maxPrice,
//                   spaceTypes: filters.spaceTypes,
//                 }}
//                 onFilterChange={handleFilterChange}
//               />

//               {isMounted && isMobile && (
//                 <SearchBar
//                   value={searchQuery}
//                   onChange={setSearchQuery}
//                   onSearch={handleSearch}
//                   onClear={handleClearSearch}
//                   placeholder="Search locations or spaces..."
//                   isLoading={false}
//                   searchResults={searchResults}
//                   onSelectResult={handleSelectResult}
//                 />
//               )}
//             </>
//           )}

//           <GoogleMap
//             spaces={filteredSpaces as any}
//             selectedSpace={selectedSpace}
//             onSpaceClick={handleSpaceClick as any}
//             onMapClick={() => {
//               if (isMobile) {
//                 setCollapseSheet(true);
//                 setTimeout(() => setCollapseSheet(false), 500);
//               }
//             }}
//             onBoundsChange={handleBoundsChange}
//             mapCenter={mapCenter}
//             mapZoom={mapZoom}
//             isLoading={false}
//             isInCart={isInCart}
//             className="h-full w-full"
//           />

//           {isMounted && (
//             <>
//               <AnimatePresence mode="wait">
//                 {selectedSpace && !isMobile && (
//                   <div ref={sidebarRef}>
//                     <SpaceDetailsSidebar
//                       key={selectedSpace.id}
//                       space={selectedSpace}
//                       campaignId={selectedCampaignId}
//                       isInCart={isInCart(selectedSpace.id)}
//                       onClose={handleCloseSidebar}
//                       onSuccess={handleAddToCartSuccess}
//                       onCreateCampaign={handleCreateCampaign}
//                     />
//                   </div>
//                 )}
//               </AnimatePresence>
//             </>
//           )}

//           {cartCount > 0 && selectedCampaignId && (
//             <button
//               onClick={() => router.push("/cart")}
//               className="fixed right-10 bottom-10 z-40 flex items-center gap-3 rounded-full bg-blue-600 px-6 py-4 font-semibold text-white shadow-2xl transition-all hover:scale-105 hover:bg-blue-700"
//             >
//               <ShoppingCart className="h-5 w-5" />
//               <span>Proceed to Checkout</span>
//               <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-bold text-blue-600">
//                 {cartCount}
//               </span>
//             </button>
//           )}

//           {/* ✅ ONLY show loading spinner on initial page load */}
//           {spacesLoading && !hasLoadedSpaces && <MapLoadingState />}

//           {/* ✅ NO "Updating map..." spinner - markers just swap instantly */}

//           {!spacesLoading && !error && mapBounds && filteredSpaces.length === 0 && (
//             <SpacesEmptyState
//               onAdjustFilters={() => setShowFilters(true)}
//               hasActiveFilters={activeFilterCount > 0 || !!searchQuery.trim()}
//             />
//           )}

//           {error && (
//             <SpacesErrorState
//               error={error?.message || "Failed to load spaces"}
//               onRetry={() => void refetch()}
//               isRetrying={spacesLoading}
//             />
//           )}
//         </div>
//       </div>

//       {isMounted && isMobile && (
//         <MobileSpaceSheet
//           key={selectedSpace?.id ?? "empty"}
//           space={selectedSpace}
//           campaignId={selectedCampaignId}
//           isInCart={selectedSpace ? isInCart(selectedSpace.id) : false}
//           onClose={handleCloseSidebar}
//           onSuccess={handleAddToCartSuccess}
//           onCreateCampaign={handleCreateCampaign}
//           collapseToMin={collapseSheet}
//         />
//       )}
//     </>
//   );
// }

// export default function BrowsePage() {
//   return (
//     <BrowseErrorBoundary>
//       <BrowsePageInternal />
//     </BrowseErrorBoundary>
//   );
// }


import React from 'react'

function page() {
  return (
    <div>
      hello
    </div>
  )
}

export default page
