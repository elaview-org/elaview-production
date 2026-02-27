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
import type { AdvertiserPeriodComparison } from "@/types/gql";

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
  data: AdvertiserPeriodComparison;
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
              label: "Spending",
              current: Number(current.spending ?? 0),
              previous: Number(previous.spending ?? 0),
              format: "currency",
            },
            {
              label: "Impressions",
              current: Number(current.impressions),
              previous: Number(previous.impressions),
              format: "number",
            },
            {
              label: "ROI",
              current: Number(current.roi ?? 0),
              previous: Number(previous.roi ?? 0),
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}
