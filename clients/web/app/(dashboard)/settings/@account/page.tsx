import SettingsSection from "@/components/composed/settings-section";
import { IconSettings } from "@tabler/icons-react";
import { graphql } from "@/types/gql";
import AccountSettingsForm from "./account-settings-form";
import api from "../api";

const AccountSettings_UserFragment = graphql(`
  fragment AccountSettings_UserFragment on User {
    createdAt
    lastLoginAt
    activeProfileType
  }
`);

export default async function Page() {
  const user = await api.getSettingsUser(AccountSettings_UserFragment);

  return (
    <SettingsSection
      value="account"
      icon={<IconSettings className="text-muted-foreground size-5" />}
      title="Account Settings"
      description="Security, password, and account management"
    >
      <AccountSettingsForm
        createdAt={user.createdAt}
        lastLoginAt={user.lastLoginAt}
        activeProfileType={user.activeProfileType}
      />
    </SettingsSection>
  );
}
