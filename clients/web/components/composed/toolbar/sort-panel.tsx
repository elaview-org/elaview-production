"use client";

import { Button } from "@/components/primitives/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";

type Props = {
  sort: {
    fields: { value: string; label: string }[];
  };
  open: boolean;
};

export default function ToolbarSortPanel({ sort, open }: Props) {
  if (!open) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Order" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ASC">Ascending</SelectItem>
          <SelectItem value="DESC">Descending</SelectItem>
        </SelectContent>
      </Select>

      {["Primary", "Secondary"].map((item) => (
        <Select key={item}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder={item} />
          </SelectTrigger>
          <SelectContent>
            {sort.fields.map((field) => (
              <SelectItem key={field.value} value={field.value}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      <Button variant="ghost" size="sm">
        Reset to default
      </Button>
    </div>
  );
}
