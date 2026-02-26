import { Skeleton } from "@/components/primitives/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border">
      <div className="p-6 pb-0">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-1 h-4 w-48" />
      </div>
      <div className="overflow-hidden">
        <div className="bg-muted border-y p-4">
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-20" />
            ))}
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b p-4 last:border-b-0"
          >
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        ))}
      </div>
    </div>
  );
}
