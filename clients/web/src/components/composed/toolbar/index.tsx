"use client";

import { ComponentType, ReactNode, useState } from "react";
import { Button } from "@/components/primitives/button";
import {
  IconChevronDown,
  IconChevronUp,
  IconFilter,
  IconSortAscending,
} from "@tabler/icons-react";
import { ViewOptions } from "@/types/constants";
import ToolbarFiltersPanel from "./filters-panel";
import ToolbarSearch from "./search";
import ToolbarViewSelect from "./view-select";
import ToolbarSortPanel from "./sort-panel";
import ToolbarPagination from "./pagination";

type Props = {
  searchTarget: string;
  filters: Parameters<typeof ToolbarFiltersPanel>[0]["filters"];
  sort: Parameters<typeof ToolbarSortPanel>[0]["sort"];
  pageInfo?: Parameters<typeof ToolbarPagination>[0]["pageInfo"];
  pageSize?: Parameters<typeof ToolbarPagination>[0]["pageSize"];
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
        <ToolbarSearch searchTarget={props.searchTarget} />
        <ToolbarPagination
          pageInfo={props.pageInfo}
          pageSize={props.pageSize}
        />

        <ToolbarViewSelect
          views={props.views}
          currentView={props.currentView}
          onViewChangeAction={props.onViewChangeAction}
        />
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

        {props.action}
      </div>

      <ToolbarFiltersPanel filters={props.filters} open={filtersOpen} />
      <ToolbarSortPanel sort={props.sort} open={sortOpen} />
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
