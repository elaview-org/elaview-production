import { BarChart3 } from "lucide-react";
import UpcommingFeatureNotice from "@/shared/components/molecules/UpcommingFeatureNotice/UpcommingFeatureNotice";

export default function MarketingAnalyticsPage() {
  return (
    <UpcommingFeatureNotice
      status="Coming Soon"
      title="Analytics dashboard"
      description="Track performance of your marketing campaigns"
      icon={BarChart3}
    />
  );
}
