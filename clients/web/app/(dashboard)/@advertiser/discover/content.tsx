"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useCallback, useMemo, useSyncExternalStore } from "react";
import { IconLayoutGrid, IconMap, IconSearch } from "@tabler/icons-react";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import FilterSheet from "./filter-sheet";
import { FilterState } from "./types";
import { SpaceType } from "@/types/graphql.generated";

interface ContentProps {
  gridView: ReactNode;
  mapView: ReactNode;
}

function getStoredView(): "grid" | "map" {
  if (typeof window === "undefined") return "map";
  return (localStorage.getItem("ElaviewDiscoverView") as "grid" | "map") ?? "map";
}

const subscribeToStorage = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

export default function Content({ gridView, mapView }: ContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const storedView = useSyncExternalStore(
    subscribeToStorage,
    getStoredView,
    () => "map" as const
  );

  const currentView: "grid" | "map" =
    (searchParams.get("view") as "grid" | "map") ?? storedView;

  const filters = useMemo<FilterState>(() => {
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const types = searchParams.get("types");
    const query = searchParams.get("q");

    return {
      priceRange: [
        minPrice ? parseInt(minPrice) : 0,
        maxPrice ? parseInt(maxPrice) : 500,
      ],
      spaceTypes: types ? (types.split(",") as SpaceType[]) : [],
      searchQuery: query ?? "",
    };
  }, [searchParams]);

  const setView = useCallback(
    (view: "grid" | "map") => {
      localStorage.setItem("ElaviewDiscoverView", view);
      const params = new URLSearchParams(searchParams.toString());
      params.set("view", view);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const handleFiltersChange = useCallback(
    (newFilters: FilterState) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newFilters.priceRange[0] > 0) {
        params.set("minPrice", newFilters.priceRange[0].toString());
      } else {
        params.delete("minPrice");
      }

      if (newFilters.priceRange[1] < 500) {
        params.set("maxPrice", newFilters.priceRange[1].toString());
      } else {
        params.delete("maxPrice");
      }

      if (newFilters.spaceTypes.length > 0) {
        params.set("types", newFilters.spaceTypes.join(","));
      } else {
        params.delete("types");
      }

      if (newFilters.searchQuery) {
        params.set("q", newFilters.searchQuery);
      } else {
        params.delete("q");
      }

      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      handleFiltersChange({ ...filters, searchQuery: query });
    },
    [filters, handleFiltersChange]
  );

  return (
    <>
      <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Discover Spaces
          </h1>
          <p className="text-muted-foreground">
            Find the perfect advertising space for your campaign
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <IconSearch className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search locations..."
              className="pl-10"
              value={filters.searchQuery}
              onChange={handleSearch}
            />
          </div>

          <div className="flex gap-2">
            <FilterSheet
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />

            <div className="flex rounded-md border">
              <Button
                className="rounded-r-none border-0"
                variant={currentView === "map" ? "default" : "ghost"}
                size="icon"
                onClick={() => setView("map")}
                title="Map View"
              >
                <IconMap className="h-4 w-4" />
              </Button>
              <Button
                className="rounded-l-none border-0"
                variant={currentView === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setView("grid")}
                title="Grid View"
              >
                <IconLayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      {currentView === "grid" ? gridView : mapView}
    </>
  );
}