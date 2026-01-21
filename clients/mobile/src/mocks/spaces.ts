// Mock spaces data for development
// These will be replaced with real API data later

import { SpaceType } from "@/types/graphql";

export type TrafficLevel = "low" | "medium" | "high";

export interface MockSpace {
  id: string;
  title: string;
  description: string;
  type: SpaceType;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  photos: string[];
  dailyRate: number;
  weeklyRate?: number;
  monthlyRate?: number;
  dimensions: {
    width: number;
    height: number;
    unit: "ft" | "in" | "m" | "cm";
  };
  impressionsPerDay?: number;
  trafficLevel?: TrafficLevel;
  rating?: number;
  reviewCount?: number;
  isActive: boolean;
  ownerId: string;
  ownerName: string;
  createdAt: Date;
  updatedAt: Date;
}

export const spaceTypeLabels: Record<SpaceType, string> = {
  [SpaceType.Billboard]: "Billboard",
  [SpaceType.DigitalDisplay]: "Digital Display",
  [SpaceType.Other]: "Other",
  [SpaceType.Storefront]: "Storefront",
  [SpaceType.Transit]: "Transit",
  [SpaceType.VehicleWrap]: "Vehicle Wrap",
  [SpaceType.WindowDisplay]: "Window Display",
};

export const spaceTypeIcons: Record<SpaceType, string> = {
  [SpaceType.Billboard]: "easel-outline",
  [SpaceType.DigitalDisplay]: "tv-outline",
  [SpaceType.Other]: "cube-outline",
  [SpaceType.Storefront]: "storefront-outline",
  [SpaceType.Transit]: "bus-outline",
  [SpaceType.VehicleWrap]: "car-outline",
  [SpaceType.WindowDisplay]: "browsers-outline",
};

export function formatPrice(price: number): string {
  return `$${price.toFixed(0)}`;
}

export function formatDimensions(dimensions: MockSpace["dimensions"]): string {
  return `${dimensions.width} × ${dimensions.height} ${dimensions.unit}`;
}

export const mockSpaces: MockSpace[] = [
  {
    id: "space-1",
    title: "Downtown Coffee Shop Window",
    description:
      "Prime window display space in a busy downtown coffee shop. High foot traffic from morning commuters and lunch crowds. Perfect for local businesses looking to reach urban professionals.",
    type: SpaceType.WindowDisplay,
    address: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    latitude: 37.7749,
    longitude: -122.4194,
    photos: [
      "https://picsum.photos/seed/space1a/800/600",
      "https://picsum.photos/seed/space1b/800/600",
      "https://picsum.photos/seed/space1c/800/600",
    ],
    dailyRate: 25,
    weeklyRate: 150,
    monthlyRate: 500,
    dimensions: { width: 4, height: 3, unit: "ft" },
    impressionsPerDay: 2500,
    trafficLevel: "high",
    rating: 4.8,
    reviewCount: 24,
    isActive: true,
    ownerId: "owner-1",
    ownerName: "Sarah Chen",
    createdAt: new Date("2025-06-15"),
    updatedAt: new Date("2026-01-10"),
  },
  {
    id: "space-2",
    title: "Gym Entrance Poster Board",
    description:
      "Large poster board at the entrance of a popular gym. Reaches health-conscious audience daily. Great for fitness, wellness, and lifestyle brands.",
    type: SpaceType.Storefront,
    address: "456 Fitness Ave",
    city: "San Francisco",
    state: "CA",
    zipCode: "94103",
    latitude: 37.7751,
    longitude: -122.4180,
    photos: [
      "https://picsum.photos/seed/space2a/800/600",
      "https://picsum.photos/seed/space2b/800/600",
    ],
    dailyRate: 20,
    weeklyRate: 120,
    monthlyRate: 400,
    dimensions: { width: 3, height: 4, unit: "ft" },
    impressionsPerDay: 1800,
    trafficLevel: "medium",
    rating: 4.5,
    reviewCount: 12,
    isActive: true,
    ownerId: "owner-2",
    ownerName: "Mike Rodriguez",
    createdAt: new Date("2025-08-20"),
    updatedAt: new Date("2026-01-05"),
  },
  {
    id: "space-3",
    title: "Restaurant Digital Screen",
    description:
      "Digital display screen in a busy restaurant. Perfect for dynamic content and promotions. Screen rotates ads every 30 seconds during business hours.",
    type: SpaceType.DigitalDisplay,
    address: "789 Culinary Blvd",
    city: "San Francisco",
    state: "CA",
    zipCode: "94104",
    latitude: 37.7755,
    longitude: -122.4170,
    photos: [
      "https://picsum.photos/seed/space3a/800/600",
      "https://picsum.photos/seed/space3b/800/600",
      "https://picsum.photos/seed/space3c/800/600",
      "https://picsum.photos/seed/space3d/800/600",
    ],
    dailyRate: 40,
    weeklyRate: 250,
    monthlyRate: 900,
    dimensions: { width: 55, height: 32, unit: "in" },
    impressionsPerDay: 3200,
    trafficLevel: "high",
    rating: 4.9,
    reviewCount: 31,
    isActive: true,
    ownerId: "owner-3",
    ownerName: "Emma Williams",
    createdAt: new Date("2025-05-10"),
    updatedAt: new Date("2026-01-15"),
  },
  {
    id: "space-4",
    title: "Local Bookstore Window",
    description:
      "Charming window display in a neighborhood bookstore. Ideal for literary events, local businesses, and community announcements.",
    type: SpaceType.WindowDisplay,
    address: "321 Reader Lane",
    city: "Oakland",
    state: "CA",
    zipCode: "94612",
    latitude: 37.8044,
    longitude: -122.2712,
    photos: [
      "https://picsum.photos/seed/space4a/800/600",
    ],
    dailyRate: 15,
    weeklyRate: 90,
    monthlyRate: 300,
    dimensions: { width: 3, height: 2, unit: "ft" },
    impressionsPerDay: 800,
    trafficLevel: "low",
    rating: 4.6,
    reviewCount: 8,
    isActive: false,
    ownerId: "owner-1",
    ownerName: "Sarah Chen",
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date("2025-12-20"),
  },
  {
    id: "space-5",
    title: "Highway Billboard",
    description:
      "Large billboard on a busy highway with excellent visibility. Reaches thousands of commuters daily. Ideal for brand awareness campaigns.",
    type: SpaceType.Billboard,
    address: "Highway 101 Mile Marker 42",
    city: "San Jose",
    state: "CA",
    zipCode: "95112",
    latitude: 37.3382,
    longitude: -121.8863,
    photos: [
      "https://picsum.photos/seed/space5a/800/600",
      "https://picsum.photos/seed/space5b/800/600",
    ],
    dailyRate: 150,
    weeklyRate: 900,
    monthlyRate: 3000,
    dimensions: { width: 48, height: 14, unit: "ft" },
    impressionsPerDay: 50000,
    trafficLevel: "high",
    rating: 4.7,
    reviewCount: 15,
    isActive: true,
    ownerId: "owner-4",
    ownerName: "David Park",
    createdAt: new Date("2025-03-15"),
    updatedAt: new Date("2026-01-18"),
  },
];
