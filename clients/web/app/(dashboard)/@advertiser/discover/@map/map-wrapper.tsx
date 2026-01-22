"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { SpaceMarker } from "../types";
import SpacePreview from "../space-preview";
import { Skeleton } from "@/components/primitives/skeleton";

export function MapSkeleton() {
  return <Skeleton className="h-[600px] w-full rounded-lg" />;
}

const MapView = dynamic(() => import("./map-container"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

interface MapWrapperProps {
  spaces: SpaceMarker[];
}

export default function MapWrapper({ spaces }: MapWrapperProps) {
  const [selectedSpace, setSelectedSpace] = useState<SpaceMarker | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleSpaceSelect = (space: SpaceMarker) => {
    setSelectedSpace(space);
    setPreviewOpen(true);
  };

  return (
    <>
      <MapView spaces={spaces} onSpaceSelect={handleSpaceSelect} />
      <SpacePreview
        space={selectedSpace}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </>
  );
}
