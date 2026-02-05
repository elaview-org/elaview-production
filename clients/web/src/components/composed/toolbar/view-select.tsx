"use client";

import { useTransition } from "react";
import { Button } from "@/components/primitives/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/primitives/tooltip";
import { IconLayoutGrid, IconMap, IconTable } from "@tabler/icons-react";
import { ViewOptions, ViewSet } from "@/types/constants";

type Props = {
  views?: ViewSet;
  currentView?: ViewOptions;
  onViewChangeAction?: (view: ViewOptions) => void;
};

export default function ToolbarViewSelect({
  views,
  currentView = ViewOptions.Grid,
  onViewChangeAction,
}: Props) {
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
        <Tooltip key={key}>
          <TooltipTrigger asChild>
            <Button
              className={`${getRadius(index)} border-0`}
              variant={currentView === key ? "default" : "ghost"}
              size="icon"
              onClick={() => handleViewChange(key)}
              disabled={isPending}
            >
              <Icon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{title}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

const viewGroupConfig = [
  { key: ViewOptions.Map, icon: IconMap, title: "Map View" },
  { key: ViewOptions.Table, icon: IconTable, title: "Table View" },
  { key: ViewOptions.Grid, icon: IconLayoutGrid, title: "Grid View" },
] as const;
