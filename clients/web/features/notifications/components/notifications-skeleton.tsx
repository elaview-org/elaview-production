import { Card } from "@/components/primitives/card";
import { Skeleton } from "@/components/primitives/skeleton";

export function NotificationsSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((group) => (
        <div key={group} className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-px flex-1" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="p-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-4 w-4" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
