import SummaryCard, {
  SummaryCardGrid,
} from "@/components/composed/summary-card";
import { calculateTrend, formatCurrency, formatNumber } from "@/lib/utils";
import mock from "./mock.json";

export default function SummaryCards() {
  const { summary } = mock;

  const spendChange = calculateTrend(
    summary.totalSpend,
    summary.previousTotalSpend
  );
  const bookingsChange = calculateTrend(
    summary.totalBookings,
    summary.previousTotalBookings
  );
  const impressionsChange = calculateTrend(
    summary.totalImpressions,
    summary.previousTotalImpressions
  );
  const reachChange = calculateTrend(
    summary.reach,
    summary.previousReach
  );
  const cpiChange = calculateTrend(
    summary.avgCostPerImpression,
    summary.previousAvgCostPerImpression
  );
  const roiChange = calculateTrend(
    summary.roi,
    summary.previousRoi
  );

  return (
    <div className="flex flex-col gap-4">
      <SummaryCardGrid>
        <SummaryCard
          label="Total Spend"
          value={formatCurrency(summary.totalSpend)}
          badge={{ type: "trend", value: spendChange }}
          footer={spendChange >= 0 ? "Increased spend" : "Reduced spend"}
          description={`${formatCurrency(summary.previousTotalSpend)} last period`}
        />
        <SummaryCard
          label="Total Bookings"
          value={summary.totalBookings.toString()}
          badge={{ type: "trend", value: bookingsChange }}
          footer={bookingsChange >= 0 ? "Trending up" : "Trending down"}
          description={`${summary.previousTotalBookings} bookings last period`}
        />
        <SummaryCard
          label="Total Impressions"
          value={formatNumber(summary.totalImpressions)}
          badge={{ type: "trend", value: impressionsChange }}
          footer={impressionsChange >= 0 ? "Growing reach" : "Declining reach"}
          description={`${formatNumber(summary.previousTotalImpressions)} last period`}
        />
        <SummaryCard
          label="Total Reach"
          value={formatNumber(summary.reach)}
          badge={{ type: "trend", value: reachChange }}
          footer="Unique viewers"
          description={`${formatNumber(summary.previousReach)} last period`}
        />
      </SummaryCardGrid>

      <SummaryCardGrid>
        <SummaryCard
          label="Avg. Cost/Impression"
          value={`$${summary.avgCostPerImpression.toFixed(3)}`}
          badge={{ type: "trend", value: -cpiChange }}
          footer={cpiChange <= 0 ? "Better efficiency" : "Increasing cost"}
          description="Cost per impression"
        />
        <SummaryCard
          label="Return on Investment"
          value={`${summary.roi.toFixed(1)}x`}
          badge={{ type: "trend", value: roiChange }}
          footer={roiChange >= 0 ? "Improving" : "Declining"}
          description="Revenue generated per dollar spent"
        />
        <SummaryCard
          label="Completion Rate"
          value={`${summary.completionRate.toFixed(0)}%`}
          badge={{ type: "text", text: "Good" }}
          footer="High completion"
          description="Campaigns successfully completed"
          showFooterIcon={false}
        />
        <SummaryCard
          label="Active Campaigns"
          value={summary.totalBookings.toString()}
          badge={{ type: "text", text: "Active" }}
          footer="Across all spaces"
          description="Currently running campaigns"
          showFooterIcon={false}
        />
      </SummaryCardGrid>
    </div>
  );
}
