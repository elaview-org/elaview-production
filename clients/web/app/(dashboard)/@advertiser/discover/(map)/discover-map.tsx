"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import SpacePreview from "../space-preview";
import MapPlaceholder from "./placeholder";
import type { MapSpace } from "./map-container";

const MapContainer = dynamic(() => import("./map-container"), {
  ssr: false,
  loading: () => (
    <div className="bg-muted flex h-[600px] w-full items-center justify-center rounded-lg">
      <div className="text-muted-foreground">Loading map...</div>
    </div>
  ),
});

export const DiscoverMap_SpaceFragment = graphql(`
  fragment DiscoverMap_SpaceFragment on Space {
    id
    title
    address
    city
    state
    zipCode
    latitude
    longitude
    pricePerDay
    type
    images
    width
    height
  }
`);

type Props = {
  data: FragmentType<typeof DiscoverMap_SpaceFragment>[];
};

export default function DiscoverMap({ data }: Props) {
  const [selectedSpace, setSelectedSpace] = useState<MapSpace | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const spaces: MapSpace[] = data.map((d) => {
    const space = getFragmentData(DiscoverMap_SpaceFragment, d);
    return {
      id: space.id as string,
      title: space.title,
      address: space.address,
      city: space.city,
      state: space.state,
      zipCode: space.zipCode,
      latitude: space.latitude,
      longitude: space.longitude,
      pricePerDay: Number(space.pricePerDay),
      type: space.type,
      images: space.images as string[],
      width: space.width,
      height: space.height,
    };
  });

  const handleSpaceSelect = (space: MapSpace) => {
    setSelectedSpace(space);
    setPreviewOpen(true);
  };

  return (
    <MaybePlaceholder data={data} placeholder={<MapPlaceholder />}>
      <MapContainer spaces={spaces} onSpaceSelect={handleSpaceSelect} />
      <SpacePreview
        space={selectedSpace}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </MaybePlaceholder>
  );
}
