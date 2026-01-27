"use client";

import { ComponentType, ReactNode, useState, useTransition } from "react";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/primitives/pagination";
import {
  IconChevronDown,
  IconChevronUp,
  IconFilter,
  IconLayoutGrid,
  IconMap,
  IconSearch,
  IconSortAscending,
  IconTable,
} from "@tabler/icons-react";
import { ViewOptions, ViewSet } from "@/types/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";

type ToolbarFilterProps = {
  placeholder: string;
  fields: { value: string; label: string }[];
};

type ToolbarSortProps = {
  fields: { value: string; label: string }[];
};

type Props = {
  searchTarget: string;
  filters: ToolbarFilterProps[];
  sort: ToolbarSortProps;
  views?: Set<ViewOptions>;
  currentView?: ViewOptions;
  onViewChangeAction?: (view: ViewOptions) => void;
  action?: ReactNode;
};

export default function Toolbar(props: Props) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <SearchGroup searchTarget={props.searchTarget} />
        <PaginationGroup />

        <ToggleButton
          open={filtersOpen}
          onClick={() => {
            setSortOpen(false);
            setFiltersOpen(!filtersOpen);
          }}
          icon={IconFilter}
          label="Filters"
        />
        <ToggleButton
          open={sortOpen}
          onClick={() => {
            setFiltersOpen(false);
            setSortOpen(!sortOpen);
          }}
          icon={IconSortAscending}
          label="Sort"
        />

        <ViewGroup
          views={props.views}
          currentView={props.currentView}
          onViewChangeAction={props.onViewChangeAction}
        />
        {props.action}
      </div>

      <FiltersPanel filters={props.filters} open={filtersOpen} />
      <SortPanel sort={props.sort} open={sortOpen} />
    </div>
  );
}

function ToggleButton({
  open,
  onClick,
  icon: Icon,
  label,
}: {
  open: boolean;
  onClick: () => void;
  icon: ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Button variant="outline" onClick={onClick} className="gap-2">
      <Icon className="size-4" />
      {label}
      {open ? (
        <IconChevronUp className="size-4" />
      ) : (
        <IconChevronDown className="size-4" />
      )}
    </Button>
  );
}

function FiltersPanel({
  filters,
  open,
}: {
  filters: ToolbarFilterProps[];
  open: boolean;
}) {
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

function SortPanel({ sort, open }: { sort: ToolbarSortProps; open: boolean }) {
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

function SearchGroup({ searchTarget }: { searchTarget: string }) {
  return (
    <div className="relative w-80">
      <IconSearch className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input placeholder={`Search ${searchTarget}...`} className="pl-9" />
    </div>
  );
}

function PaginationGroup() {
  return (
    <div className="flex-1">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

const viewGroupConfig = [
  { key: ViewOptions.Map, icon: IconMap, title: "Map View" },
  { key: ViewOptions.Table, icon: IconTable, title: "Table View" },
  { key: ViewOptions.Grid, icon: IconLayoutGrid, title: "Grid View" },
] as const;

type ViewGroupProps = {
  views?: ViewSet;
  currentView?: ViewOptions;
  onViewChangeAction?: (view: ViewOptions) => void;
};

function ViewGroup({ views, currentView = ViewOptions.Grid, onViewChangeAction }: ViewGroupProps) {
  const [isPending, startTransition] = useTransition();

  const visibleViews = viewGroupConfig.filter(
    (v) => views?.has(v.key) ?? false
  );
  if (visibleViews.length === 0) {
    return null;
  }

  const getRadius = (index: number) => {
    const isFirst = index === 0;
    const isLast = index === visibleViews.length - 1;
    if (isFirst && isLast) return "";
    if (isFirst) return "rounded-r-none";
    if (isLast) return "rounded-l-none";
    return "rounded-none";
  };

  const handleViewChange = (view: ViewOptions) => {
    if (onViewChangeAction) {
      startTransition(() => {
        onViewChangeAction(view);
      });
    }
  };

  return (
    <div className="flex rounded-md border">
      {visibleViews.map(({ key, icon: Icon, title }, index) => (
        <Button
          key={key}
          className={`${getRadius(index)} border-0`}
          variant={currentView === key ? "default" : "ghost"}
          size="icon"
          onClick={() => handleViewChange(key)}
          disabled={isPending}
          title={title}
        >
          <Icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
}
