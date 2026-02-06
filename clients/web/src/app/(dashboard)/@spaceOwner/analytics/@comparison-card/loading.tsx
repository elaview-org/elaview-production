import { Card, CardContent, CardHeader } from "@/components/primitives/card";
import { ComparisonTableSkeleton } from "@/components/composed/comparison-table";
import { Skeleton } from "@/components/primitives/skeleton";

function Loading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <ComparisonTableSkeleton rowCount={4} />
      </CardContent>
    </Card>
  );
}

export default Loading;
