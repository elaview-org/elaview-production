import SettingsSection from "@/components/composed/settings-section";
import { IconCreditCard } from "@tabler/icons-react";
import { graphql, ProfileType } from "@/types/gql";
import PaymentSettingsForm from "./payment-settings-form";
import api from "../api";

const PaymentSettings_UserFragment = graphql(`
  fragment PaymentSettings_UserFragment on User {
    activeProfileType
  }
`);

export default async function Page() {
  const user = await api.getSettingsUser(PaymentSettings_UserFragment);

  if (user.activeProfileType !== ProfileType.Advertiser) {
    return null;
  }

  const paymentMethods = await api.getPaymentMethods();

  return (
    <SettingsSection
      value="payment"
      icon={<IconCreditCard className="text-muted-foreground size-5" />}
      title="Payment Methods"
      description="Manage your saved payment methods"
    >
      <PaymentSettingsForm paymentMethods={paymentMethods} />
    </SettingsSection>
  );
}
