import SettingsSection from "@/components/composed/settings-section";
import { IconBell } from "@tabler/icons-react";
import { graphql, ProfileType } from "@/types/gql";
import NotificationSettingsForm from "./notification-settings-form";
import api from "../api";
import {
  SPACE_OWNER_NOTIFICATIONS,
  SPACE_OWNER_NOTIFICATION_LABELS,
  ADVERTISER_NOTIFICATIONS,
  ADVERTISER_NOTIFICATION_LABELS,
} from "../constants";

const NotificationSettings_UserFragment = graphql(`
  fragment NotificationSettings_UserFragment on User {
    activeProfileType
  }
`);

export default async function Page() {
  const user = await api.getSettingsUser(NotificationSettings_UserFragment);
  const preferences = await api.getNotificationPreferences();
  const isSpaceOwner =
    user.activeProfileType === ProfileType.SpaceOwner;

  return (
    <SettingsSection
      value="notifications"
      icon={IconBell}
      title="Notification Preferences"
      description="Email, push, and in-app notifications"
    >
      <NotificationSettingsForm
        preferences={preferences}
        notificationTypes={
          isSpaceOwner ? SPACE_OWNER_NOTIFICATIONS : ADVERTISER_NOTIFICATIONS
        }
        notificationLabels={
          isSpaceOwner
            ? SPACE_OWNER_NOTIFICATION_LABELS
            : ADVERTISER_NOTIFICATION_LABELS
        }
      />
    </SettingsSection>
  );
}
