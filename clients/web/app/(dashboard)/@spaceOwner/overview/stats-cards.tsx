import SummaryCard, {
  SummaryCardGrid,
} from "@/components/composed/summary-card";
import mock from "./mock.json";

export default function StatsCards() {
  return (
    <SummaryCardGrid>
      {mock.stats.map((stat) => (
        <SummaryCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          badge={stat.change !== 0 ? { type: "trend", value: stat.change } : undefined}
          footer={stat.footer}
          description={stat.description}
        />
      ))}
    </SummaryCardGrid>
  );
}