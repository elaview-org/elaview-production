import { Skeleton } from "@/components/primitives/skeleton";

export default function Loading() {
  return (
    <>
      <div className="bg-background flex w-full flex-col border-r md:max-w-sm">
        <div className="border-b px-4 py-3">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="mt-1 h-4 w-32" />
        </div>
        <div className="h-full overflow-y-auto">
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-muted/30 hidden flex-1 md:flex" />
    </>
  );
}
