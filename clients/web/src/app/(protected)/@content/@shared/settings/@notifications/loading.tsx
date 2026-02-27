import { Skeleton } from "@/components/primitives/skeleton";

export default function Loading() {
  return (
    <div className="rounded-lg border px-6 py-4">
      <div className="flex items-center gap-3">
        <Skeleton className="size-5" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
    </div>
  );
}
