import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import ComparisonTable from "@/components/composed/comparison-table";
import mock from "../mock.json";

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
            {
              label: "Bookings",
              current: current.bookings,
              previous: previous.bookings,
            },
            {
              label: "Revenue",
              current: current.revenue,
              previous: previous.revenue,
              format: "currency",
            },
            {
              label: "Avg. Rating",
              current: current.avgRating,
              previous: previous.avgRating,
              format: "rating",
            },
            {
              label: "Completion Rate",
              current: current.completionRate,
              previous: previous.completionRate,
              format: "percent",
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}
