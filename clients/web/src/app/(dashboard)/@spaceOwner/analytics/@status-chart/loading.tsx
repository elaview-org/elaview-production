import { Skeleton } from "@/components/primitives/skeleton";

export default function StatusChartLoader() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border p-6">
      <div className="flex flex-col items-center gap-1">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="mx-auto size-62.5 rounded-full" />
    </div>
  );
}
