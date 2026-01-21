// Mock spaces data for development
// These will be replaced with real API data later

export type SpaceType =
  | "window"
  | "billboard"
  | "poster"
  | "digital_screen"
  | "vehicle"
  | "storefront"
  | "wall"
  | "other";

export interface Space {
  id: string;
  title: string;
  type: SpaceType;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  dailyRate: number;
  weeklyRate?: number;
  monthlyRate?: number;
  dimensions: {
    width: number;
    height: number;
    unit: "in" | "ft" | "cm" | "m";
  };
  photos: string[];
  ownerId: string;
  ownerName: string;
  rating?: number;
  reviewCount: number;
  isActive: boolean;
  createdAt: Date;
  impressionsPerDay?: number;
  trafficLevel?: "low" | "medium" | "high";
}

export const mockSpaces: Space[] = [
  {
    id: "space-1",
    title: "Downtown Coffee Shop Window",
    type: "window",
    description:
      "Prime storefront window in busy downtown area. High foot traffic from morning commuters and lunch crowds.",
    address: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    latitude: 37.7849,
    longitude: -122.4094,
    dailyRate: 25,
    weeklyRate: 150,
    monthlyRate: 500,
    dimensions: { width: 48, height: 36, unit: "in" },
    photos: ["https://picsum.photos/seed/space1/400/300"],
    ownerId: "owner-1",
    ownerName: "Sarah Chen",
    rating: 4.8,
    reviewCount: 24,
    isActive: true,
    createdAt: new Date("2025-08-01"),
    impressionsPerDay: 2500,
    trafficLevel: "high",
  },
  {
    id: "space-2",
    title: "Gym Entrance Poster Board",
    type: "poster",
    description:
      "Large poster board at gym entrance. Perfect for fitness, health, and lifestyle brands.",
    address: "456 Fitness Ave",
    city: "San Francisco",
    state: "CA",
    zipCode: "94103",
    latitude: 37.7749,
    longitude: -122.4194,
    dailyRate: 15,
    weeklyRate: 90,
    monthlyRate: 300,
    dimensions: { width: 24, height: 36, unit: "in" },
    photos: ["https://picsum.photos/seed/space2/400/300"],
    ownerId: "owner-2",
    ownerName: "Mike Rodriguez",
    rating: 4.5,
    reviewCount: 12,
    isActive: true,
    createdAt: new Date("2025-09-15"),
    impressionsPerDay: 800,
    trafficLevel: "medium",
  },
  {
    id: "space-3",
    title: "Restaurant Digital Screen",
    type: "digital_screen",
    description:
      '55" digital display in upscale restaurant waiting area. Great for food, beverage, and lifestyle ads.',
    address: "789 Gourmet Blvd",
    city: "Oakland",
    state: "CA",
    zipCode: "94612",
    latitude: 37.8044,
    longitude: -122.2712,
    dailyRate: 40,
    weeklyRate: 250,
    monthlyRate: 900,
    dimensions: { width: 48, height: 27, unit: "in" },
    photos: ["https://picsum.photos/seed/space3/400/300"],
    ownerId: "owner-3",
    ownerName: "Emma Williams",
    rating: 4.9,
    reviewCount: 31,
    isActive: true,
    createdAt: new Date("2025-07-20"),
    impressionsPerDay: 400,
    trafficLevel: "medium",
  },
  {
    id: "space-4",
    title: "Bookstore Front Window",
    type: "window",
    description:
      "Charming bookstore window display. Ideal for literary, educational, and artistic campaigns.",
    address: "321 Reader Lane",
    city: "Berkeley",
    state: "CA",
    zipCode: "94704",
    latitude: 37.8716,
    longitude: -122.2727,
    dailyRate: 20,
    weeklyRate: 120,
    monthlyRate: 400,
    dimensions: { width: 60, height: 48, unit: "in" },
    photos: ["https://picsum.photos/seed/space4/400/300"],
    ownerId: "owner-4",
    ownerName: "David Park",
    rating: 4.7,
    reviewCount: 18,
    isActive: true,
    createdAt: new Date("2025-10-05"),
    impressionsPerDay: 1200,
    trafficLevel: "medium",
  },
  {
    id: "space-5",
    title: "Food Truck Side Panel",
    type: "vehicle",
    description:
      "Mobile advertising on popular food truck. Travels to different locations and events.",
    address: "Various Locations",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    latitude: 37.7849,
    longitude: -122.4094,
    dailyRate: 35,
    weeklyRate: 200,
    monthlyRate: 700,
    dimensions: { width: 8, height: 4, unit: "ft" },
    photos: ["https://picsum.photos/seed/space5/400/300"],
    ownerId: "owner-5",
    ownerName: "Lisa Tran",
    rating: 4.6,
    reviewCount: 9,
    isActive: true,
    createdAt: new Date("2025-11-10"),
    impressionsPerDay: 3000,
    trafficLevel: "high",
  },
];

// Space type labels for display
export const spaceTypeLabels: Record<SpaceType, string> = {
  window: "Window Display",
  billboard: "Billboard",
  poster: "Poster Board",
  digital_screen: "Digital Screen",
  vehicle: "Vehicle",
  storefront: "Storefront",
  wall: "Wall Space",
  other: "Other",
};

// Space type icons (Ionicons)
export const spaceTypeIcons: Record<SpaceType, string> = {
  window: "storefront-outline",
  billboard: "easel-outline",
  poster: "image-outline",
  digital_screen: "tv-outline",
  vehicle: "car-outline",
  storefront: "business-outline",
  wall: "grid-outline",
  other: "cube-outline",
};

// Helper to format price
export function formatPrice(amount: number): string {
  return `$${amount.toFixed(0)}`;
}

// Helper to format dimensions
export function formatDimensions(dimensions: Space["dimensions"]): string {
  return `${dimensions.width} × ${dimensions.height} ${dimensions.unit}`;
}
