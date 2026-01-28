import { IconAd } from "@tabler/icons-react";
import ProfileCardBase from "@/components/composed/profile-card";
import { formatCurrency } from "@/lib/utils";
import mock from "./mock.json";

export default function ProfileCard() {
  const { user, campaigns } = mock;
  const profile = user.advertiserProfile;

  const yearsAdvertising = Math.max(
    1,
    Math.floor(
      (new Date().getTime() - new Date(profile.createdAt).getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
    )
  );
  const totalCampaigns = campaigns.length;
  const totalSpend = campaigns.reduce((sum, c) => sum + c.totalSpend, 0);

  return (
    <ProfileCardBase
      name={user.name}
      avatar={user.avatar}
      badge="Advertiser"
      badgeIcon={<IconAd className="size-3" />}
      verified
      stats={[
        { value: totalCampaigns, label: "Campaigns" },
        { value: formatCurrency(totalSpend), label: "Total Spend" },
        {
          value: yearsAdvertising,
          label: yearsAdvertising === 1 ? "Year" : "Years",
        },
      ]}
    />
  );
}
