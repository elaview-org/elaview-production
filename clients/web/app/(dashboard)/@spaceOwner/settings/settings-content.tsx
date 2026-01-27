"use client";

import { Accordion } from "@/components/primitives/accordion";
import SettingsSection from "@/components/composed/settings-section";
import ProfileSettingsForm from "./profile-settings-form";
import BusinessSettingsForm from "./business-settings-form";
import PayoutSettingsForm from "./payout-settings-form";
import NotificationSettingsForm from "./notification-settings-form";
import AccountSettingsForm from "./account-settings-form";
import type { SpaceOwnerSettingsQuery } from "@/types/gql/graphql";
import {
  IconBell,
  IconBuilding,
  IconCreditCard,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";

type Props = {
  user: NonNullable<SpaceOwnerSettingsQuery["me"]>;
  notificationPreferences: SpaceOwnerSettingsQuery["myNotificationPreferences"];
};

export default function SettingsContent({
  user,
  notificationPreferences,
}: Props) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <Accordion
        type="multiple"
        defaultValue={["profile"]}
        className="flex flex-col gap-4"
      >
        <SettingsSection
          value="profile"
          icon={IconUser}
          title="Profile Information"
          description="Your personal details and contact info"
        >
          <ProfileSettingsForm user={user} />
        </SettingsSection>

        <SettingsSection
          value="business"
          icon={IconBuilding}
          title="Business Information"
          description="Your business details and payout schedule"
        >
          <BusinessSettingsForm user={user} />
        </SettingsSection>

        <SettingsSection
          value="payout"
          icon={IconCreditCard}
          title="Payout Settings"
          description="Stripe Connect and bank account"
        >
          <PayoutSettingsForm user={user} />
        </SettingsSection>

        <SettingsSection
          value="notifications"
          icon={IconBell}
          title="Notification Preferences"
          description="Email, push, and in-app notifications"
        >
          <NotificationSettingsForm preferences={notificationPreferences} />
        </SettingsSection>

        <SettingsSection
          value="account"
          icon={IconSettings}
          title="Account Settings"
          description="Security, password, and account management"
        >
          <AccountSettingsForm user={user} />
        </SettingsSection>
      </Accordion>
    </div>
  );
}
