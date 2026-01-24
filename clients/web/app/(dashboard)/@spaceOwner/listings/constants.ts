import {
  IconBuildingStore,
  IconMapPin,
  IconPhoto,
  IconReceipt,
  IconSquare,
} from "@tabler/icons-react";
import { SpaceStatus, SpaceType } from "@/types/gql/graphql";

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
