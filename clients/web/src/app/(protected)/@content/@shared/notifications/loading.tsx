import { Card, CardHeader } from "@/components/primitives/card";
import { Skeleton } from "@/components/primitives/skeleton";

export default function Loading() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-4">
          <div>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-1 h-4 w-40" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-24" />
          </div>
        </CardHeader>
      </Card>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-45" />
      </div>

      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, groupIndex) => (
          <div key={groupIndex} className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-px flex-1" />
              <Skeleton className="h-4 w-8" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, itemIndex) => (
                <Card key={itemIndex} className="p-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="size-5 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="size-8" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
