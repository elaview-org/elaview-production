import UpcommingFeatureNotice from "@/shared/components/molecules/UpcommingFeatureNotice/UpcommingFeatureNotice";
import { FileText } from "lucide-react";

export default function TemplatesPage() {
  return (
    <UpcommingFeatureNotice
      status="Coming Soon"
      title=" Email & SMS Templates"
      description="Reusable templates for your marketing campaigns"
      icon={FileText}
    />
  );
}
