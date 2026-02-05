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
import { useSearchParamsUpdater } from "@/lib/hooks/use-search-params-updater";

type SortEntry = { field: string; direction: string };

type Props = {
  sort: {
    fields: { value: string; label: string }[];
  };
  open: boolean;
};

export default function ToolbarSortPanel({ sort, open }: Props) {
  const { get, update } = useSearchParamsUpdater();
  const [pending, setPending] = useState<SortEntry[]>([]);
  const [prevOpen, setPrevOpen] = useState(false);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setPending(parseSortParam(get("sort")));
    }
  }

  if (!open) return null;

  const committed = parseSortParam(get("sort"));
  const hasChanges = buildSortParam(pending) !== buildSortParam(committed);
  const primary = pending[0];
  const secondary = pending[1];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={primary?.direction ?? ""}
        onValueChange={(direction) => {
          const next = [...pending];
          if (next.length === 0) return;
          next[0] = { ...next[0], direction };
          setPending(next);
        }}
      >
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Order" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ASC">Ascending</SelectItem>
          <SelectItem value="DESC">Descending</SelectItem>
        </SelectContent>
      </Select>

      {(["Primary", "Secondary"] as const).map((label, index) => {
        const entry = index === 0 ? primary : secondary;
        return (
          <Select
            key={label}
            value={entry?.field ?? ""}
            onValueChange={(field) => {
              const next = [...pending];
              const direction = next[0]?.direction ?? "ASC";
              if (index === 0) {
                next[0] = { field, direction };
              } else if (next.length === 0) {
                next.push({ field, direction });
              } else {
                next[1] = { field, direction };
              }
              setPending(next);
            }}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder={label} />
            </SelectTrigger>
            <SelectContent>
              {sort.fields.map((field) => (
                <SelectItem key={field.value} value={field.value}>
                  {field.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      })}

      <Button
        variant="default"
        size="sm"
        disabled={!hasChanges}
        onClick={() =>
          update({
            sort: buildSortParam(pending),
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
          setPending([]);
          update({
            sort: null,
            after: null,
            before: null,
            first: null,
            last: null,
          });
        }}
      >
        Reset to default
      </Button>
    </div>
  );
}

function parseSortParam(param: string | null): SortEntry[] {
  if (!param) return [];
  return param.split(",").reduce<SortEntry[]>((acc, entry) => {
    const colonIndex = entry.indexOf(":");
    if (colonIndex === -1) return acc;
    const field = entry.slice(0, colonIndex);
    const direction = entry.slice(colonIndex + 1);
    if (field && direction) acc.push({ field, direction });
    return acc;
  }, []);
}

function buildSortParam(entries: SortEntry[]): string | null {
  const valid = entries.filter((e) => e.field && e.direction);
  if (valid.length === 0) return null;
  return valid.map((e) => `${e.field}:${e.direction}`).join(",");
}
