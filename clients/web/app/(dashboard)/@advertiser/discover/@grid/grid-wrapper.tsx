"use client";

import { useState } from "react";
import { SpaceMarker } from "../types";
import SpacePreview from "../space-preview";
import SpaceCard from "./space-card";
import { Skeleton } from "@/components/skeleton";

export function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="aspect-4/3 w-full rounded-lg" />
      ))}
    </div>
  );
}

interface GridWrapperProps {
  spaces: SpaceMarker[];
}

export default function GridWrapper({ spaces }: GridWrapperProps) {
  const [selectedSpace, setSelectedSpace] = useState<SpaceMarker | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleSpaceSelect = (space: SpaceMarker) => {
    setSelectedSpace(space);
    setPreviewOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {spaces.map((space) => (
          <SpaceCard
            key={space.id}
            space={space}
            onClick={() => handleSpaceSelect(space)}
          />
        ))}
      </div>
      {spaces.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground text-lg">No spaces found</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
      <SpacePreview
        space={selectedSpace}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </>
  );
}