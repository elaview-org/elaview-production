import { Skeleton } from "@/components/primitives/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Skeleton className="size-10" />
        <Skeleton className="h-8 w-64" />
        <div className="flex-1" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="aspect-video rounded-lg" />
        <div className="rounded-lg border p-4">
          <Skeleton className="mb-3 h-5 w-24" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
          <Skeleton className="mt-4 h-2 w-full rounded-full" />
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <Skeleton className="mb-3 h-5 w-24" />
        <Skeleton className="h-20 w-full" />
      </div>

      <div className="rounded-lg border">
        <div className="border-b px-4 py-3">
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="divide-y">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
