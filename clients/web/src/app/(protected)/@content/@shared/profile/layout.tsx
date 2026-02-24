import { Separator } from "@/components/primitives/separator";
import UnderConstruction from "@/components/status/under-construction";
import { graphql, UserRole } from "@/types/gql";
import api from "./api";

const ProfileLayout_UserFragment = graphql(`
  fragment ProfileLayout_UserFragment on User {
    role
  }
`);

export default async function Layout(props: LayoutProps<"/profile">) {
  const user = await api.getProfile(ProfileLayout_UserFragment);

  if (user.role !== UserRole.User) {
    return (
      <div className="@container/main flex flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
        <UnderConstruction />
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      <div className="flex flex-col gap-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 lg:flex-row lg:gap-12">
          {props.info}
          {props.about}
        </div>
        <Separator />
        {props.activity}
      </div>
    </div>
  );
}
