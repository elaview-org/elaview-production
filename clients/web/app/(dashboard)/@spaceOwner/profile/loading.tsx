import { Card, CardContent } from "@/components/primitives/card";
import { Separator } from "@/components/primitives/separator";
import { Skeleton } from "@/components/primitives/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <Card className="shrink-0 lg:w-72">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <Skeleton className="size-28 rounded-full" />
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Separator />
            <div className="grid w-full grid-cols-3 gap-4">
              <div className="flex flex-col items-center gap-1">
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-3 w-14" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-3 w-10" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-3 w-10" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-1 flex-col gap-6">
          <Skeleton className="h-9 w-64" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-36" />
          </div>
          <Skeleton className="h-5 w-72" />
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-80" />
          <div className="flex gap-2">
            <Skeleton className="size-9" />
            <Skeleton className="size-9" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="gap-4">
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-4 w-36" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
