"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/sheet";
import { Button } from "@/components/button";
import { Slider } from "@/components/slider";
import { Checkbox } from "@/components/checkbox";
import { Label } from "@/components/label";
import { IconFilter, IconX } from "@tabler/icons-react";
import { SpaceType } from "@/types/graphql.generated";
import { FilterState } from "./types";

const SPACE_TYPE_LABELS: Record<SpaceType, string> = {
  [SpaceType.Billboard]: "Billboard",
  [SpaceType.DigitalDisplay]: "Digital Display",
  [SpaceType.Other]: "Other",
  [SpaceType.Storefront]: "Storefront",
  [SpaceType.Transit]: "Transit",
  [SpaceType.VehicleWrap]: "Vehicle Wrap",
  [SpaceType.WindowDisplay]: "Window Display",
};

const PHASE_1_TYPES = [
  SpaceType.Storefront,
  SpaceType.WindowDisplay,
  SpaceType.Other,
];

interface FilterSheetProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  maxPrice?: number;
}

export default function FilterSheet({
  filters,
  onFiltersChange,
  maxPrice = 500,
}: FilterSheetProps) {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const handlePriceChange = (value: number[]) => {
    setLocalFilters((prev) => ({
      ...prev,
      priceRange: [value[0], value[1]] as [number, number],
    }));
  };

  const handleTypeToggle = (type: SpaceType) => {
    setLocalFilters((prev) => {
      const types = prev.spaceTypes.includes(type)
        ? prev.spaceTypes.filter((t) => t !== type)
        : [...prev.spaceTypes, type];
      return { ...prev, spaceTypes: types };
    });
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      priceRange: [0, maxPrice],
      spaceTypes: [],
      searchQuery: "",
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const activeFilterCount =
    (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0) +
    (filters.spaceTypes.length > 0 ? 1 : 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <IconFilter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground flex h-5 w-5 items-center justify-center rounded-full text-xs">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-8 overflow-y-auto py-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Price Range</Label>
              <span className="text-muted-foreground text-sm">
                ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
              </span>
            </div>
            <Slider
              value={localFilters.priceRange}
              onValueChange={handlePriceChange}
              min={0}
              max={maxPrice}
              step={5}
            />
            <div className="text-muted-foreground flex justify-between text-xs">
              <span>$0</span>
              <span>${maxPrice}/day</span>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium">Space Type</Label>
            <div className="space-y-3">
              {PHASE_1_TYPES.map((type) => (
                <div key={type} className="flex items-center gap-3">
                  <Checkbox
                    id={type}
                    checked={localFilters.spaceTypes.includes(type)}
                    onCheckedChange={() => handleTypeToggle(type)}
                  />
                  <Label
                    htmlFor={type}
                    className="cursor-pointer text-sm font-normal"
                  >
                    {SPACE_TYPE_LABELS[type]}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SheetFooter className="flex-row gap-3 border-t pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleReset}
          >
            <IconX className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button className="flex-1" onClick={handleApply}>
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}