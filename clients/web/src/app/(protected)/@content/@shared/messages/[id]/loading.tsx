import { Skeleton } from "@/components/primitives/skeleton";
import { cn } from "@/lib/core/utils";

export default function Loading() {
  return (
    <>
      <div className="bg-background hidden w-full flex-col border-r md:flex md:max-w-sm">
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
      <div className="flex flex-1 flex-col">
        <div className="border-b p-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="mt-2 h-4 w-32" />
        </div>
        <div className="flex-1 space-y-4 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-2",
                i % 2 === 0 ? "flex-row-reverse" : "flex-row"
              )}
            >
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-16 w-48 rounded-2xl" />
            </div>
          ))}
        </div>
        <div className="border-t p-4">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </>
  );
}
