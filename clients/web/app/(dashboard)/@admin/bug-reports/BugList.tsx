import { api } from "../../../../../elaview-mvp/src/trpc/server";
import { type BugCategory, type BugSeverity, type BugStatus } from "@prisma/client";
import type { BugReport } from "../../../../../elaview-mvp/src/lib/bug-utils";
import { AlertCircle, RefreshCw } from "lucide-react";
import BugCard from "./BugCard";

export function BugListSkeleton() {
  return (
    <div className="flex items-center justify-center py-12">
      <RefreshCw className="h-8 w-8 animate-spin text-slate-400" />
    </div>
  );
}

type Filters = {
  status?: BugStatus;
  severity?: BugSeverity;
  category?: BugCategory;
};

interface BugListProps {
  filters: Filters;
}

export default async function BugList(props: BugListProps) {
  const filters = props.filters;
  const bugsData = await api.bugReports.getAll(filters);
  const bugReports = (bugsData?.bugReports ?? []) as BugReport[];

  return (
    <>
      {bugReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-slate-600" />
          <p className="text-lg font-medium text-slate-400">No bug reports found</p>
          <p className="text-sm text-slate-500">
            {(filters.status ?? filters.severity ?? filters.category)
              ? "Try adjusting your filters"
              : "Users haven't reported any bugs yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bugReports.map((report) => (
            <BugCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </>
  );
}
