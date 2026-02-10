import SummaryCard, {
  SummaryCardGrid,
} from "@/components/composed/summary-card";
import { calculateTrend, formatCurrency } from "@/lib/core/utils";
import type { SpaceOwnerSummary } from "@/types/gql";

type Props = {
  data: SpaceOwnerSummary;
};

export default function SummaryCards({ data }: Props) {
  const bookingsChange = calculateTrend(
    data.totalBookings,
    data.previousTotalBookings
  );
  const revenueChange = calculateTrend(
    data.totalRevenue ?? 0,
    data.previousTotalRevenue ?? 0
  );
  const durationChange = calculateTrend(
    data.avgBookingDuration ?? 0,
    data.previousAvgBookingDuration ?? 0
  );
  const occupancyChange = calculateTrend(
    data.occupancyRate ?? 0,
    data.previousOccupancyRate ?? 0
  );
  const repeatChange = calculateTrend(
    data.repeatAdvertiserRate ?? 0,
    data.previousRepeatAdvertiserRate ?? 0
  );

  return (
    <div className="flex flex-col gap-4">
      <SummaryCardGrid>
        <SummaryCard
          label="Total Bookings"
          value={data.totalBookings.toString()}
          badge={{ type: "trend", value: bookingsChange }}
          footer={bookingsChange >= 0 ? "Trending up" : "Trending down"}
          description={`${data.previousTotalBookings} bookings last period`}
        />
        <SummaryCard
          label="Total Revenue"
          value={formatCurrency(data.totalRevenue ?? 0)}
          badge={{ type: "trend", value: revenueChange }}
          footer={revenueChange >= 0 ? "Trending up" : "Trending down"}
          description={`${formatCurrency(data.previousTotalRevenue ?? 0)} last period`}
        />
        <SummaryCard
          label="Average Rating"
          value={data.averageRating?.toFixed(1) ?? "—"}
          badge={{ type: "text", text: "★", className: "text-yellow-500" }}
          footer="Excellent rating"
          description="Based on all reviews"
          showFooterIcon={false}
        />
        <SummaryCard
          label="Completion Rate"
          value={
            data.completionRate != null
              ? `${Number(data.completionRate).toFixed(0)}%`
              : "—"
          }
          badge={{ type: "text", text: "Good" }}
          footer="High completion"
          description="Bookings successfully completed"
          showFooterIcon={false}
        />
      </SummaryCardGrid>

      <SummaryCardGrid>
        <SummaryCard
          label="Avg. Booking Duration"
          value={
            data.avgBookingDuration != null
              ? `${Number(data.avgBookingDuration).toFixed(1)} days`
              : "—"
          }
          badge={{ type: "trend", value: durationChange }}
          footer={durationChange >= 0 ? "Longer bookings" : "Shorter bookings"}
          description={
            data.previousAvgBookingDuration != null
              ? `${Number(data.previousAvgBookingDuration).toFixed(1)} days last period`
              : "No previous data"
          }
        />
        <SummaryCard
          label="Occupancy Rate"
          value={
            data.occupancyRate != null
              ? `${Number(data.occupancyRate).toFixed(0)}%`
              : "—"
          }
          badge={{ type: "trend", value: occupancyChange }}
          footer={occupancyChange >= 0 ? "Improving" : "Declining"}
          description="Percentage of days booked"
        />
        <SummaryCard
          label="Repeat Advertisers"
          value={
            data.repeatAdvertiserRate != null
              ? `${Number(data.repeatAdvertiserRate).toFixed(0)}%`
              : "—"
          }
          badge={{ type: "trend", value: repeatChange }}
          footer={repeatChange >= 0 ? "Growing loyalty" : "Needs attention"}
          description="Advertisers who book again"
        />
        <SummaryCard
          label="Revenue Forecast"
          value={formatCurrency(data.forecastedRevenue ?? 0)}
          badge={{ type: "text", text: "Projected" }}
          footer="Based on current trends"
          description="Expected revenue this period"
          showFooterIcon={false}
        />
      </SummaryCardGrid>
    </div>
  );
}
