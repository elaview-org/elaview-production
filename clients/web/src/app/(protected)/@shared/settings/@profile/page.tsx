import SettingsSection from "@/components/composed/settings-section";
import { IconUser } from "@tabler/icons-react";
import { graphql, ProfileType } from "@/types/gql";
import ProfileSettingsForm from "./profile-settings-form";
import api from "../api";

const ProfileSettings_UserFragment = graphql(`
  fragment ProfileSettings_UserFragment on User {
    name
    email
    phone
    avatar
    activeProfileType
  }
`);

export default async function Page() {
  const user = await api.getSettingsUser(ProfileSettings_UserFragment);
  const description =
    user.activeProfileType === ProfileType.SpaceOwner
      ? "Your personal details visible to advertisers"
      : "Your personal details visible to space owners";

  return (
    <SettingsSection
      value="profile"
      icon={<IconUser className="text-muted-foreground size-5" />}
      title="Profile Information"
      description={description}
    >
      <ProfileSettingsForm
        name={user.name}
        email={user.email}
        phone={user.phone}
        avatar={user.avatar}
      />
    </SettingsSection>
  );
}
