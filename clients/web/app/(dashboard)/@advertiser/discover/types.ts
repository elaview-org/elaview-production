import { Space, SpaceType } from "@/types/gql";

export interface SpaceMarker {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  pricePerDay: number;
  type: SpaceType;
  images: string[];
  width: number | null;
  height: number | null;
  status: string;
}

export interface FilterState {
  priceRange: [number, number];
  spaceTypes: SpaceType[];
  searchQuery: string;
}

export function toSpaceMarker(space: Partial<Space>): SpaceMarker {
  return {
    id: space.id as string,
    title: space.title ?? "",
    address: space.address ?? "",
    city: space.city ?? "",
    state: space.state ?? "",
    zipCode: space.zipCode ?? "",
    latitude: space.latitude ?? 0,
    longitude: space.longitude ?? 0,
    pricePerDay: Number(space.pricePerDay) || 0,
    type: space.type ?? SpaceType.Other,
    images: space.images ?? [],
    width: space.width ?? null,
    height: space.height ?? null,
    status: space.status ?? "ACTIVE",
  };
}