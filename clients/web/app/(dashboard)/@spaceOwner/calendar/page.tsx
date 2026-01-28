"use client";

import * as React from "react";
import CalendarHeader from "./calendar-header";
import CalendarGrid from "./calendar-grid";
import UpcomingEvents from "./upcoming-events";
import type { CalendarView } from "./constants";

export default function Page() {
  const [currentDate, setCurrentDate] = React.useState(() => new Date());
  const [view, setView] = React.useState<CalendarView>("month");

  return (
    <div className="flex flex-col gap-6">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onDateChange={setCurrentDate}
        onViewChange={setView}
      />

      <div className="grid grid-cols-1 gap-6 @3xl/main:grid-cols-[1fr_320px]">
        <div className="min-w-0 overflow-auto">
          <CalendarGrid
            currentDate={currentDate}
            view={view}
            selectedSpaceId={null}
          />
        </div>

        <UpcomingEvents selectedSpaceId={null} />
      </div>
    </div>
  );
}
