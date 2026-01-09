"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useCallback, useEffect } from "react";
import { IconLayoutGrid, IconMap, IconSearch } from "@tabler/icons-react";
import { Input } from "@/components/input";
import { Button } from "@/components/button";

interface ContentProps {
  gridView: ReactNode;
  mapView: ReactNode;
}

export default function Content({ gridView, mapView }: ContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentView: "grid" | "map" = (searchParams.get("view") ??
    (typeof window !== "undefined"
      ? localStorage.getItem("ElaviewDiscoverView")
      : null) ??
    "grid") as "grid" | "map";

  const setView = useCallback(
    (view: "grid" | "map") => {
      localStorage.setItem("ElaviewDiscoverView", view);
      router.replace(`${pathname}?view=${view}`);
    },
    [router, pathname]
  );

  useEffect(() => {
    if (!searchParams.get("view")) {
      setView(currentView);
    }
  }, [searchParams, currentView, setView]);

  return (
    <>
      <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Spaces in Charlottesville
          </h1>
          <p className="text-muted-foreground">
            20+ premium advertising spaces available
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-sm">
            <IconSearch className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input placeholder="Search locations..." className="pl-10" />
          </div>

          <div className="flex gap-2">
            <Button
              className={"cursor-pointer"}
              variant={currentView === "map" ? "default" : "outline"}
              onClick={() => setView("map")}
              title={"Map View"}
            >
              <IconMap className="h-4 w-4" />
            </Button>
            <Button
              className={"cursor-pointer"}
              variant={currentView === "grid" ? "default" : "outline"}
              onClick={() => setView("grid")}
              title={"Grid View"}
            >
              <IconLayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      {currentView === "grid" ? gridView : mapView}
    </>
  );
}
