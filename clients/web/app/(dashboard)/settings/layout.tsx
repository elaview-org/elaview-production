import UnderConstruction from "@/components/status/under-construction";
import { graphql, UserRole } from "@/types/gql";
import SettingsShell from "./settings-shell";
import api from "./api";

const SettingsLayout_UserFragment = graphql(`
  fragment SettingsLayout_UserFragment on User {
    role
  }
`);

export default async function Layout(props: LayoutProps<"/settings">) {
  const user = await api.getSettingsUser(SettingsLayout_UserFragment);

  if (user.role !== UserRole.User) {
    return (
      <div className="@container/main flex flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
        <UnderConstruction />
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      <SettingsShell>
        {props.profile}
        {props.business}
        {props.payout}
        {props.notifications}
        {props.account}
      </SettingsShell>
    </div>
  );
}
