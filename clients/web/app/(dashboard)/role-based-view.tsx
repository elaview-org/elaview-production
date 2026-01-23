import {
  type FragmentType,
  getFragmentData,
  graphql,
  ProfileType,
  UserRole,
} from "@/types/gql";
import { ReactNode } from "react";

const RoleBasedView_UserFragment = graphql(`
  fragment RoleBasedView_UserFragment on User {
    role
    activeProfileType
  }
`);

export default function RoleBasedView(props: {
  me: FragmentType<typeof RoleBasedView_UserFragment>;
  admin: ReactNode;
  marketing: ReactNode;
  spaceOwner: ReactNode;
  advertiser: ReactNode;
}) {
  const { role, activeProfileType } = getFragmentData(
    RoleBasedView_UserFragment,
    props.me
  );

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      {(() => {
        switch (role) {
          case UserRole.Admin:
            return props.admin;
          case UserRole.Marketing:
            return props.marketing;
          case UserRole.User: {
            return activeProfileType === ProfileType.SpaceOwner
              ? props.spaceOwner
              : props.advertiser;
          }
        }
      })()}
    </div>
  );
}
