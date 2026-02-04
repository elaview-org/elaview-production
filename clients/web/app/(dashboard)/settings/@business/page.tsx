import SettingsSection from "@/components/composed/settings-section";
import { IconBuilding } from "@tabler/icons-react";
import { graphql, ProfileType } from "@/types/gql";
import SpaceOwnerBusinessForm from "./space-owner-business-form";
import AdvertiserBusinessForm from "./advertiser-business-form";
import api from "../api";

const BusinessSettings_UserFragment = graphql(`
  fragment BusinessSettings_UserFragment on User {
    activeProfileType
    spaceOwnerProfile {
      businessName
      businessType
      payoutSchedule
    }
    advertiserProfile {
      companyName
      industry
      website
    }
  }
`);

export default async function Page() {
  const user = await api.getSettingsUser(BusinessSettings_UserFragment);

  if (user.activeProfileType === ProfileType.SpaceOwner) {
    const profile = user.spaceOwnerProfile!;

    return (
      <SettingsSection
        value="business"
        icon={IconBuilding}
        title="Business Information"
        description="Your business details and payout schedule"
      >
        <SpaceOwnerBusinessForm
          businessName={profile.businessName}
          businessType={profile.businessType}
          payoutSchedule={profile.payoutSchedule}
        />
      </SettingsSection>
    );
  }

  const profile = user.advertiserProfile!;

  return (
    <SettingsSection
      value="business"
      icon={IconBuilding}
      title="Business Information"
      description="Your company details and industry"
    >
      <AdvertiserBusinessForm
        companyName={profile.companyName}
        industry={profile.industry}
        website={profile.website}
      />
    </SettingsSection>
  );
}
