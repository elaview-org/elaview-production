import { SpaceType } from "@/types/gql/graphql";
import { ViewOptions } from "@/types/constants";

export const PRICE_RANGES: Record<string, { gte: number; lte?: number }> = {
  "0-50": { gte: 0, lte: 50 },
  "50-100": { gte: 50, lte: 100 },
  "100-200": { gte: 100, lte: 200 },
  "200+": { gte: 200 },
};

export const TOOLBAR_PROPS = {
  searchTarget: "spaces",
  filters: [
    {
      key: "type",
      placeholder: "Type",
      fields: [
        { value: SpaceType.Storefront, label: "Storefront" },
        { value: SpaceType.WindowDisplay, label: "Window Display" },
        { value: SpaceType.Billboard, label: "Billboard" },
        { value: SpaceType.DigitalDisplay, label: "Digital Display" },
        { value: SpaceType.VehicleWrap, label: "Vehicle Wrap" },
        { value: SpaceType.Transit, label: "Transit" },
        { value: SpaceType.Other, label: "Other" },
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
      { value: "pricePerDay", label: "Price" },
      { value: "averageRating", label: "Rating" },
      { value: "createdAt", label: "Date Added" },
      { value: "totalBookings", label: "Bookings" },
    ],
  },
  views: new Set([ViewOptions.Grid, ViewOptions.Table, ViewOptions.Map]),
};
