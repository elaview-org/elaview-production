import { Zap } from "lucide-react";
import UpcommingFeatureNotice from "@/shared/components/molecules/UpcommingFeatureNotice/UpcommingFeatureNotice";

export default function AutomationPage() {
  return (
    <UpcommingFeatureNotice
    status="Coming Soon"
    title="Automation workflow"
    description="Set up automated campaign workflows and triggers"
    icon={Zap}
    />
  );
}

