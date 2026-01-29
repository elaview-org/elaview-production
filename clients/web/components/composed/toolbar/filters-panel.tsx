import { Button } from "@/components/primitives/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";

type Props = {
  filters: {
    placeholder: string;
    fields: { value: string; label: string }[];
  }[];
  open: boolean;
};

export default function ToolbarFiltersPanel({ filters, open }: Props) {
  if (!open) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {filters.map((filter, index) => (
        <Select key={index}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder={filter.placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {filter.fields.map((field) => (
              <SelectItem key={field.value} value={field.value}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
      <Button variant="ghost" size="sm">
        Clear filters
      </Button>
    </div>
  );
}
