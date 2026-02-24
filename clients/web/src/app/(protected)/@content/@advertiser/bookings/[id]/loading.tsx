import { Skeleton } from "@/components/primitives/skeleton";
import { Card, CardContent, CardHeader } from "@/components/primitives/card";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 pb-24">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
      </div>

      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-2">
                  <Skeleton className="size-8 rounded-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
                {i < 6 && <Skeleton className="mx-2 h-0.5 flex-1" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-16" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Skeleton className="size-24 rounded-lg" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-20" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Skeleton className="aspect-video w-40 rounded-lg" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-36" />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-14" />
              </div>
            </div>
            <Skeleton className="h-px w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
