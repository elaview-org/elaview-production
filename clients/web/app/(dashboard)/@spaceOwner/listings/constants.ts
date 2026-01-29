import {
  IconBuildingStore,
  IconMapPin,
  IconPhoto,
  IconReceipt,
  IconSquare,
} from "@tabler/icons-react";
import { SpaceStatus, SpaceType } from "@/types/gql/graphql";
import { ViewOptions } from "@/types/constants";

export const STEPS = [
  { id: 1, label: "Photos", icon: IconPhoto },
  { id: 2, label: "Details", icon: IconBuildingStore },
  { id: 3, label: "Location", icon: IconMapPin },
  { id: 4, label: "Pricing", icon: IconReceipt },
  { id: 5, label: "Preview", icon: IconSquare },
] as const;

export const SPACE_TYPES = [
  { value: "WINDOW_DISPLAY", label: "Window Display" },
  { value: "STOREFRONT", label: "Storefront" },
  { value: "BILLBOARD", label: "Billboard" },
  { value: "DIGITAL_DISPLAY", label: "Digital Display" },
  { value: "VEHICLE_WRAP", label: "Vehicle Wrap" },
  { value: "TRANSIT", label: "Transit" },
  { value: "OTHER", label: "Other" },
] as const;

export const DIMENSION_UNITS = [
  { value: "in", label: "Inches" },
  { value: "ft", label: "Feet" },
  { value: "cm", label: "Centimeters" },
  { value: "m", label: "Meters" },
] as const;

export const STATUS_INDICATORS: Record<SpaceStatus, string> = {
  [SpaceStatus.Active]: "bg-emerald-500",
  [SpaceStatus.Inactive]: "bg-muted-foreground",
  [SpaceStatus.PendingApproval]: "bg-amber-500",
  [SpaceStatus.Rejected]: "bg-destructive",
  [SpaceStatus.Suspended]: "bg-destructive",
};

export const TYPE_LABELS: Record<SpaceType, string> = {
  [SpaceType.Billboard]: "Billboard",
  [SpaceType.DigitalDisplay]: "Digital Display",
  [SpaceType.Storefront]: "Storefront",
  [SpaceType.Transit]: "Transit",
  [SpaceType.VehicleWrap]: "Vehicle Wrap",
  [SpaceType.WindowDisplay]: "Window Display",
  [SpaceType.Other]: "Other",
};

export const TOOLBAR_PROPS = {
  searchTarget: "spaces",
  filters: [
    {
      key: "status",
      placeholder: "Status",
      fields: [
        { value: SpaceStatus.Active, label: "Active" },
        { value: SpaceStatus.Inactive, label: "Inactive" },
        { value: SpaceStatus.PendingApproval, label: "Pending Approval" },
        { value: SpaceStatus.Rejected, label: "Rejected" },
        { value: SpaceStatus.Suspended, label: "Suspended" },
      ],
    },
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
  ],
  sort: {
    fields: [
      { value: "createdAt", label: "Date Created" },
      { value: "pricePerDay", label: "Price" },
      { value: "totalBookings", label: "Bookings" },
      { value: "averageRating", label: "Rating" },
      { value: "totalRevenue", label: "Revenue" },
      { value: "title", label: "Title" },
    ],
  },
  views: new Set([ViewOptions.Table, ViewOptions.Map, ViewOptions.Grid]),
};
