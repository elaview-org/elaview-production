import { Skeleton } from "@/components/primitives/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <Skeleton className="h-9 w-64" />
      <div className="flex flex-col gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-5" />
            <Skeleton className="h-5 w-48" />
          </div>
        ))}
      </div>
      <Skeleton className="h-5 w-72" />
    </div>
  );
}