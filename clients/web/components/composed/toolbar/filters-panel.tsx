"use client";

import { useState } from "react";
import { Button } from "@/components/primitives/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";
import { useSearchParamsUpdater } from "@/hooks/use-search-params-updater";

type Props = {
  filters: {
    key: string;
    placeholder: string;
    fields: { value: string; label: string }[];
  }[];
  open: boolean;
};

export default function ToolbarFiltersPanel({ filters, open }: Props) {
  const { get, update } = useSearchParamsUpdater();
  const [pending, setPending] = useState<Map<string, string>>(new Map());
  const [prevOpen, setPrevOpen] = useState(false);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setPending(parseFilterParam(get("filter")));
    }
  }

  if (!open) return null;

  const committed = parseFilterParam(get("filter"));
  const hasChanges = buildFilterParam(pending) !== buildFilterParam(committed);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {filters.map((filter) => (
        <Select
          key={filter.key}
          value={pending.get(filter.key) ?? "all"}
          onValueChange={(value) => {
            const next = new Map(pending);
            if (value === "all") {
              next.delete(filter.key);
            } else {
              next.set(filter.key, value);
            }
            setPending(next);
          }}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder={filter.placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All {filter.placeholder}</SelectItem>
            {filter.fields.map((field) => (
              <SelectItem key={field.value} value={field.value}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
      <Button
        variant="default"
        size="sm"
        disabled={!hasChanges}
        onClick={() =>
          update({
            filter: buildFilterParam(pending),
            after: null,
            before: null,
            first: null,
            last: null,
          })
        }
      >
        Apply
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setPending(new Map());
          update({
            filter: null,
            after: null,
            before: null,
            first: null,
            last: null,
          });
        }}
      >
        Clear filters
      </Button>
    </div>
  );
}

function parseFilterParam(param: string | null): Map<string, string> {
  if (!param) return new Map();
  const map = new Map<string, string>();
  for (const entry of param.split(",")) {
    const colonIndex = entry.indexOf(":");
    if (colonIndex === -1) continue;
    const key = entry.slice(0, colonIndex);
    const value = entry.slice(colonIndex + 1);
    if (key && value) map.set(key, value);
  }
  return map;
}

function buildFilterParam(filters: Map<string, string>): string | null {
  if (filters.size === 0) return null;
  return Array.from(filters.entries())
    .map(([key, value]) => `${key}:${value}`)
    .join(",");
}
