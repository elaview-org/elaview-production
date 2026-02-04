import SettingsSection from "@/components/composed/settings-section";
import { IconCreditCard } from "@tabler/icons-react";
import { graphql, ProfileType } from "@/types/gql";
import PayoutSettingsForm from "./payout-settings-form";
import api from "../api";

const PayoutSettings_UserFragment = graphql(`
  fragment PayoutSettings_UserFragment on User {
    activeProfileType
    spaceOwnerProfile {
      stripeAccountId
      stripeAccountStatus
    }
  }
`);

export default async function Page() {
  const user = await api.getSettingsUser(PayoutSettings_UserFragment);

  if (user.activeProfileType !== ProfileType.SpaceOwner) {
    return null;
  }

  return (
    <SettingsSection
      value="payout"
      icon={<IconCreditCard className="text-muted-foreground size-5" />}
      title="Payout Settings"
      description="Stripe Connect and bank account"
    >
      <PayoutSettingsForm
        stripeAccountId={user.spaceOwnerProfile?.stripeAccountId}
        stripeAccountStatus={user.spaceOwnerProfile?.stripeAccountStatus}
      />
    </SettingsSection>
  );
}
