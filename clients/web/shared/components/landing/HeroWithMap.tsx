// // src/components/landing/HeroWithMap.tsx
// "use client";

// import { useState, useCallback, useMemo, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { MapPin, Search, TrendingUp, Filter } from 'lucide-react';
// import { GoogleMap } from '~/components/browse/maps/GoogleMap';
// import { FiltersPanel } from '~/components/browse/FiltersPanel';
// import { PublicSpaceSidebar } from './PublicSpaceSidebar';
// import { api } from '~/trpc/react';
// import type { RouterOutputs } from '~/trpc/react';

// type SpaceFromAPI = RouterOutputs['spaces']['browsePublic']['spaces'][number];

// interface MapBounds {
//   north: number;
//   south: number;
//   east: number;
//   west: number;
// }

// interface FilterState {
//   maxPrice: number;
//   spaceTypes: string[];
// }

// const DEFAULT_CENTER = { lat: 33.7175, lng: -117.8311 };
// const DEFAULT_ZOOM = 10;

// export function HeroWithMap() {
//   const router = useRouter();
//   const [selectedSpace, setSelectedSpace] = useState<SpaceFromAPI | null>(null);
//   const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
//   const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
//   const [mapBounds, setMapBounds] = useState<MapBounds | undefined>();
//   const [showFilters, setShowFilters] = useState(false);
//   const [heroVisible, setHeroVisible] = useState(true);
  
//   const [filters, setFilters] = useState<FilterState>({
//     maxPrice: 500,
//     spaceTypes: []
//   });

//   // Track scroll to hide hero
//   useEffect(() => {
//     const handleScroll = () => {
//       setHeroVisible(window.scrollY < 100);
//     };
    
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const queryInput = useMemo(() => ({
//     north: mapBounds?.north,
//     south: mapBounds?.south,
//     east: mapBounds?.east,
//     west: mapBounds?.west,
//     maxPrice: filters.maxPrice,
//     types: filters.spaceTypes as any[],
//     zoom: mapZoom,
//     limit: 50
//   }), [mapBounds, filters, mapZoom]);

//   const { 
//     data: spacesData, 
//     isLoading: spacesLoading,
//     refetch 
//   } = api.spaces.browsePublic.useQuery(
//     queryInput,
//     { 
//       enabled: !!mapBounds,
//       staleTime: 60000,
//       refetchOnWindowFocus: false,
//     }
//   );

//   const spaces = useMemo(() => spacesData?.spaces || [], [spacesData?.spaces]);

//   const handleBoundsChange = useCallback((bounds: MapBounds, zoom: number) => {
//     setMapZoom(zoom);
//     setMapBounds(bounds);
//   }, []);

//   const handleSpaceClick = useCallback((space: SpaceFromAPI) => {
//     if (selectedSpace?.id === space.id) {
//       setSelectedSpace(null);
//     } else {
//       setSelectedSpace(space);
//       setMapCenter({ lat: space.latitude, lng: space.longitude });
//     }
//   }, [selectedSpace]);

//   const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
//     setFilters(prev => ({ ...prev, ...newFilters }));
//   }, []);

//   const applyFilters = useCallback(() => {
//     refetch();
//     setShowFilters(false);
//   }, [refetch]);

//   const resetFilters = useCallback(() => {
//     setFilters({
//       maxPrice: 500,
//       spaceTypes: []
//     });
//     refetch();
//   }, [refetch]);

//   const activeFilterCount = 
//     (filters.spaceTypes.length > 0 ? 1 : 0) + 
//     (filters.maxPrice < 500 ? 1 : 0);

//   const scrollToLearnMore = () => {
//     const howItWorksSection = document.getElementById('how-it-works');
//     howItWorksSection?.scrollIntoView({ behavior: 'smooth' });
//   };

//   return (
//     <section className="relative h-screen overflow-hidden">
//       {/* LAYER 1: Google Map - Base Layer (z-0) */}
//       <div className="absolute inset-0 z-0">
//         <GoogleMap
//           spaces={spaces as any}
//           selectedSpace={selectedSpace as any}
//           onSpaceClick={handleSpaceClick as any}
//           onBoundsChange={handleBoundsChange}
//           mapCenter={mapCenter}
//           mapZoom={mapZoom}
//           isLoading={spacesLoading}
//           isInCart={() => false}
//           className="w-full h-full"
//         />
//       </div>

//       {/* LAYER 2: Hero Overlay - Top Left (z-30) */}
//       <div 
//         className={`absolute top-24 left-8 z-30 max-w-lg transition-all duration-500 ${
//           heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
//         }`}
//       >
//         <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8">
//           {/* Badge */}
//           <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium mb-4 border border-blue-400/30">
//             <TrendingUp className="h-4 w-4" />
//             {spaces.length > 0 ? `${spaces.length} Spaces` : '2,500+ Spaces'} Available
//           </div>
          
//           {/* Headline */}
//           <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
//             Find Your Perfect
//             <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
//               Ad Space
//             </span>
//           </h1>
          
//           {/* Subheadline */}
//           <p className="text-lg text-slate-300 mb-6">
//             Browse thousands of billboards, storefronts, and digital displays on an interactive map
//           </p>
          
//           {/* CTA Buttons */}
//           <div className="flex flex-col sm:flex-row gap-3 mb-6">
//             <button
//               onClick={scrollToLearnMore}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
//             >
//               <Search className="h-5 w-5" />
//               Explore Spaces
//             </button>
//             <button 
//               onClick={() => router.push('/how-it-works')}
//               className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all font-medium border border-slate-700"
//             >
//               How It Works
//             </button>
//           </div>
          
//           {/* Trust Indicators */}
//           <div className="flex items-center gap-4 text-sm text-slate-400">
//             <div className="flex items-center gap-1">
//               <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
//               Real-time availability
//             </div>
//             <div>No credit card required</div>
//           </div>
//         </div>
//       </div>

//       {/* LAYER 3: Floating Controls (z-30) */}
//       <button
//         onClick={() => setShowFilters(true)}
//         className="absolute top-24 right-8 z-30 px-4 py-2 bg-slate-900/95 backdrop-blur-xl border border-slate-800 text-white rounded-lg hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2"
//       >
//         <Filter className="h-4 w-4" />
//         Filters
//         {activeFilterCount > 0 && (
//           <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
//             {activeFilterCount}
//           </span>
//         )}
//       </button>
      
//       {/* Space Count - Bottom Left (z-30) */}
//       <div className="absolute bottom-8 left-8 z-30 px-4 py-2 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-lg shadow-lg">
//         <span className="text-white font-semibold">
//           {spaces.length}
//         </span>
//         <span className="text-slate-400 ml-2">spaces found</span>
//       </div>

//       {/* Scroll Indicator - Bottom Center (z-30) */}
//       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-30">
//         <div className="text-slate-400 text-sm mb-2">Scroll to learn more</div>
//         <div className="w-6 h-10 border-2 border-slate-700 rounded-full mx-auto flex items-start justify-center p-2">
//           <div className="w-1 h-3 bg-slate-500 rounded-full animate-bounce" />
//         </div>
//       </div>
      
//       {/* LAYER 4: Filters Modal (z-[100]) */}
//       <FiltersPanel
//         isOpen={showFilters}
//         filters={filters}
//         onFilterChange={handleFilterChange}
//         onApply={applyFilters}
//         onReset={resetFilters}
//         onClose={() => setShowFilters(false)}
//       />
      
//       {/* LAYER 5: Selected Space Sidebar (z-50) */}
//       {selectedSpace && (
//         <PublicSpaceSidebar
//           space={selectedSpace}
//           onClose={() => setSelectedSpace(null)}
//           onSignUp={() => router.push('/sign-up?redirect=/browse')}
//         />
//       )}

//       {/* Empty State - No Spaces (z-30) */}
//       {!spacesLoading && mapBounds && spaces.length === 0 && (
//         <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4 z-30">
//           <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-8 text-center max-w-md pointer-events-auto">
//             <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 mx-auto mb-4">
//               <MapPin className="h-7 w-7 text-slate-400" />
//             </div>
//             <h3 className="text-xl font-bold text-white mb-2">No spaces found</h3>
//             <p className="text-slate-400 mb-6">
//               Try adjusting your filters or zoom out to see more areas.
//             </p>
//             <button 
//               onClick={resetFilters}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all"
//             >
//               Reset Filters
//             </button>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }