import SummaryCard, {
  SummaryCardGrid,
} from "@/components/composed/summary-card";
import { calculateTrend, formatCurrency } from "@/lib/utils";
import mock from "../mock.json";

export default async function SummaryCards() {
  const { summary } = mock;

  const bookingsChange = calculateTrend(
    summary.totalBookings,
    summary.previousTotalBookings
  );
  const revenueChange = calculateTrend(
    summary.totalRevenue,
    summary.previousTotalRevenue
  );
  const durationChange = calculateTrend(
    summary.averageBookingDuration,
    summary.previousAverageBookingDuration
  );
  const occupancyChange = calculateTrend(
    summary.occupancyRate,
    summary.previousOccupancyRate
  );
  const repeatChange = calculateTrend(
    summary.repeatAdvertiserRate,
    summary.previousRepeatAdvertiserRate
  );

  return (
    <div className="flex flex-col gap-4">
      <SummaryCardGrid>
        <SummaryCard
          label="Total Bookings"
          value={summary.totalBookings.toString()}
          badge={{ type: "trend", value: bookingsChange }}
          footer={bookingsChange >= 0 ? "Trending up" : "Trending down"}
          description={`${summary.previousTotalBookings} bookings last period`}
        />
        <SummaryCard
          label="Total Revenue"
          value={formatCurrency(summary.totalRevenue)}
          badge={{ type: "trend", value: revenueChange }}
          footer={revenueChange >= 0 ? "Trending up" : "Trending down"}
          description={`${formatCurrency(summary.previousTotalRevenue)} last period`}
        />
        <SummaryCard
          label="Average Rating"
          value={summary.averageRating.toFixed(1)}
          badge={{ type: "text", text: "★", className: "text-yellow-500" }}
          footer="Excellent rating"
          description="Based on all reviews"
          showFooterIcon={false}
        />
        <SummaryCard
          label="Completion Rate"
          value={`${summary.completionRate.toFixed(0)}%`}
          badge={{ type: "text", text: "Good" }}
          footer="High completion"
          description="Bookings successfully completed"
          showFooterIcon={false}
        />
      </SummaryCardGrid>

      <SummaryCardGrid>
        <SummaryCard
          label="Avg. Booking Duration"
          value={`${summary.averageBookingDuration.toFixed(1)} days`}
          badge={{ type: "trend", value: durationChange }}
          footer={durationChange >= 0 ? "Longer bookings" : "Shorter bookings"}
          description={`${summary.previousAverageBookingDuration.toFixed(1)} days last period`}
        />
        <SummaryCard
          label="Occupancy Rate"
          value={`${summary.occupancyRate.toFixed(0)}%`}
          badge={{ type: "trend", value: occupancyChange }}
          footer={occupancyChange >= 0 ? "Improving" : "Declining"}
          description="Percentage of days booked"
        />
        <SummaryCard
          label="Repeat Advertisers"
          value={`${summary.repeatAdvertiserRate.toFixed(0)}%`}
          badge={{ type: "trend", value: repeatChange }}
          footer={repeatChange >= 0 ? "Growing loyalty" : "Needs attention"}
          description="Advertisers who book again"
        />
        <SummaryCard
          label="Revenue Forecast"
          value={formatCurrency(summary.forecastedRevenue)}
          badge={{ type: "text", text: "Projected" }}
          footer={`${formatCurrency(summary.pendingBookingsValue)} pending`}
          description={`${formatCurrency(summary.confirmedUpcomingValue)} confirmed upcoming`}
          showFooterIcon={false}
        />
      </SummaryCardGrid>
    </div>
  );
}
