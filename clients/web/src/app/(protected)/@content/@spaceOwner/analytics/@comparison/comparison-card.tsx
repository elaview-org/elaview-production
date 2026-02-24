import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import ComparisonTable, {
  ComparisonTableSkeleton,
} from "@/components/composed/comparison-table";
import { Skeleton } from "@/components/primitives/skeleton";
import type { PeriodComparison } from "@/types/gql";

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

type Props = {
  data: PeriodComparison;
};

export default function ComparisonCard({ data }: Props) {
  const { current, previous } = data;

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
            {
              label: "Bookings",
              current: current.bookings,
              previous: previous.bookings,
            },
            {
              label: "Revenue",
              current: Number(current.revenue ?? 0),
              previous: Number(previous.revenue ?? 0),
              format: "currency",
            },
            {
              label: "Avg. Rating",
              current: current.avgRating ?? 0,
              previous: previous.avgRating ?? 0,
              format: "rating",
            },
            {
              label: "Completion Rate",
              current: Number(current.completionRate ?? 0),
              previous: Number(previous.completionRate ?? 0),
              format: "percent",
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}
