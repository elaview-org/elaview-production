import { SpaceType } from "@/types/gql/graphql";
import { ViewOptions } from "@/types/constants";

export const PHASE_1_TYPES = [
  SpaceType.Storefront,
  SpaceType.WindowDisplay,
  SpaceType.Other,
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export const DEFAULT_SORT: SortOption = "newest";

export const TOOLBAR_PROPS = {
  searchTarget: "spaces",
  filters: [
    {
      key: "type",
      placeholder: "Type",
      fields: [
        { value: "storefront", label: "Storefront" },
        { value: "window_display", label: "Window Display" },
        { value: "other", label: "Other" },
      ],
    },
    {
      key: "price",
      placeholder: "Price",
      fields: [
        { value: "0-50", label: "$0 - $50/day" },
        { value: "50-100", label: "$50 - $100/day" },
        { value: "100-200", label: "$100 - $200/day" },
        { value: "200+", label: "$200+/day" },
      ],
    },
  ],
  sort: {
    fields: [
      { value: "price", label: "Price" },
      { value: "createdAt", label: "Date Added" },
      { value: "rating", label: "Rating" },
    ],
  },
  views: new Set([ViewOptions.Grid, ViewOptions.Table, ViewOptions.Map]),
};

export type FilterState = {
  priceRange: [number, number];
  spaceTypes: SpaceType[];
  searchQuery: string;
};
