import UpcommingFeatureNotice from "@/shared/components/molecules/UpcommingFeatureNotice/UpcommingFeatureNotice";
import { UserCircle } from "lucide-react";

export default function AudiencesPage() {
  return (
    <UpcommingFeatureNotice
      status="Coming Soon"
      title="Audience Segments"
      description="Create and manage user segments for targeted campaigns"
      icon={UserCircle}
    />
  );
}
