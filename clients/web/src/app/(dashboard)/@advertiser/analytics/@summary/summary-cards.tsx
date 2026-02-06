import SummaryCard, {
  SummaryCardGrid,
} from "@/components/composed/summary-card";
import { calculateTrend, formatCurrency, formatNumber } from "@/lib/utils";
import type { AdvertiserSummary } from "@/types/gql";

type Props = {
  data: AdvertiserSummary;
};

export default function SummaryCards({ data }: Props) {
  const spendChange = calculateTrend(
    Number(data.totalSpend ?? 0),
    Number(data.previousTotalSpend ?? 0)
  );
  const bookingsChange = calculateTrend(
    data.totalBookings,
    data.previousTotalBookings
  );
  const impressionsChange = calculateTrend(
    Number(data.totalImpressions),
    Number(data.previousTotalImpressions)
  );
  const reachChange = calculateTrend(data.reach, data.previousReach);
  const cpiChange = calculateTrend(
    Number(data.avgCostPerImpression ?? 0),
    Number(data.previousAvgCostPerImpression ?? 0)
  );
  const roiChange = calculateTrend(
    Number(data.roi ?? 0),
    Number(data.previousRoi ?? 0)
  );

  return (
    <div className="flex flex-col gap-4">
      <SummaryCardGrid>
        <SummaryCard
          label="Total Spend"
          value={formatCurrency(Number(data.totalSpend ?? 0))}
          badge={{ type: "trend", value: spendChange }}
          footer={spendChange >= 0 ? "Increased spend" : "Reduced spend"}
          description={`${formatCurrency(Number(data.previousTotalSpend ?? 0))} last period`}
        />
        <SummaryCard
          label="Total Bookings"
          value={data.totalBookings.toString()}
          badge={{ type: "trend", value: bookingsChange }}
          footer={bookingsChange >= 0 ? "Trending up" : "Trending down"}
          description={`${data.previousTotalBookings} bookings last period`}
        />
        <SummaryCard
          label="Total Impressions"
          value={formatNumber(Number(data.totalImpressions))}
          badge={{ type: "trend", value: impressionsChange }}
          footer={impressionsChange >= 0 ? "Growing reach" : "Declining reach"}
          description={`${formatNumber(Number(data.previousTotalImpressions))} last period`}
        />
        <SummaryCard
          label="Total Reach"
          value={formatNumber(data.reach)}
          badge={{ type: "trend", value: reachChange }}
          footer="Unique viewers"
          description={`${formatNumber(data.previousReach)} last period`}
        />
      </SummaryCardGrid>

      <SummaryCardGrid>
        <SummaryCard
          label="Avg. Cost/Impression"
          value={`$${Number(data.avgCostPerImpression ?? 0).toFixed(3)}`}
          badge={{ type: "trend", value: -cpiChange }}
          footer={cpiChange <= 0 ? "Better efficiency" : "Increasing cost"}
          description="Cost per impression"
        />
        <SummaryCard
          label="Return on Investment"
          value={`${Number(data.roi ?? 0).toFixed(1)}x`}
          badge={{ type: "trend", value: roiChange }}
          footer={roiChange >= 0 ? "Improving" : "Declining"}
          description="Revenue generated per dollar spent"
        />
        <SummaryCard
          label="Completion Rate"
          value={`${Number(data.completionRate ?? 0).toFixed(0)}%`}
          badge={{ type: "text", text: "Good" }}
          footer="High completion"
          description="Campaigns successfully completed"
          showFooterIcon={false}
        />
        <SummaryCard
          label="Active Campaigns"
          value={data.totalBookings.toString()}
          badge={{ type: "text", text: "Active" }}
          footer="Across all spaces"
          description="Currently running campaigns"
          showFooterIcon={false}
        />
      </SummaryCardGrid>
    </div>
  );
}
