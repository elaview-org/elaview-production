"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/primitives/toggle-group";
import { TIME_RANGES, type TimeRange } from "@/lib/constants";

type Props = {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
  className?: string;
};

export default function TimeRangeSelector({ value, onChange, className }: Props) {
  return (
    <>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(v) => v && onChange(v as TimeRange)}
        variant="outline"
        className={`hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex ${className ?? ""}`}
      >
        {TIME_RANGES.map((range) => (
          <ToggleGroupItem key={range.value} value={range.value}>
            {range.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Select value={value} onValueChange={(v) => onChange(v as TimeRange)}>
        <SelectTrigger
          className={`flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden ${className ?? ""}`}
          size="sm"
          aria-label="Select time range"
        >
          <SelectValue placeholder="Last 3 months" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          {TIME_RANGES.map((range) => (
            <SelectItem key={range.value} value={range.value} className="rounded-lg">
              {range.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}