import { Card, CardContent } from "@/components/primitives/card";
import { Separator } from "@/components/primitives/separator";
import { Skeleton } from "@/components/primitives/skeleton";

export default function Loading() {
  return (
    <Card className="shrink-0 lg:w-72">
      <CardContent className="flex flex-col items-center gap-4 pt-6">
        <Skeleton className="size-28 rounded-full" />
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Separator />
        <div className="grid w-full grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-3 w-14" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
