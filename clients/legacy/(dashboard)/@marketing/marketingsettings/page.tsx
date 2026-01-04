import { Settings } from "lucide-react";
import UpcommingFeatureNotice from "@/shared/components/molecules/UpcommingFeatureNotice/UpcommingFeatureNotice";

export default function MarketingSettingsPage() {
  return (
    <UpcommingFeatureNotice
    status="Coming Soon"
    title="Settings features"
    description="Configure your marketing tools and integrations"
    icon={Settings}
    />
  );
}

