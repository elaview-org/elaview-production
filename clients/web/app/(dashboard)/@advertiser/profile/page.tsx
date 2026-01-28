import { Separator } from "@/components/primitives/separator";
import AboutSection from "./about-section";
import ProfileCard from "./profile-card";
import CampaignsSection from "./campaigns-section";
import mock from "./mock.json";

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 lg:flex-row lg:gap-12">
        <ProfileCard />
        <AboutSection />
      </div>
      <Separator />
      <CampaignsSection userName={mock.user.name} />
    </div>
  );
}
