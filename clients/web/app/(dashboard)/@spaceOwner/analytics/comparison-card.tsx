import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import ComparisonTable, { ComparisonTableSkeleton } from "@/components/composed/comparison-table";
import { Skeleton } from "@/components/primitives/skeleton";
import mock from "./mock.json";

export function ComparisonCardSkeleton() {
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

export default function ComparisonCard() {
  const { comparison } = mock;
  const { current, previous } = comparison;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Period Comparison</CardTitle>
        <CardDescription>
          {current.period} vs {previous.period}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ComparisonTable
          rows={[
            { label: "Bookings", current: current.bookings, previous: previous.bookings },
            { label: "Revenue", current: current.revenue, previous: previous.revenue, format: "currency" },
            { label: "Avg. Rating", current: current.avgRating, previous: previous.avgRating, format: "rating" },
            { label: "Completion Rate", current: current.completionRate, previous: previous.completionRate, format: "percent" },
          ]}
        />
      </CardContent>
    </Card>
  );
}