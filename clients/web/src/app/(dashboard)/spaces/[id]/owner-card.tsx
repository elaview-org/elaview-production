import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/primitives/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { getInitials } from "@/lib/utils";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";

export const OwnerCard_SpaceFragment = graphql(`
  fragment OwnerCard_SpaceFragment on Space {
    spaceOwnerProfile {
      businessName
      user {
        name
        avatar
      }
    }
  }
`);

type Props = {
  data: FragmentType<typeof OwnerCard_SpaceFragment>;
};

export default function OwnerCard({ data }: Props) {
  const space = getFragmentData(OwnerCard_SpaceFragment, data);
  const { user, businessName } = space.spaceOwnerProfile;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Space Owner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{user.name}</p>
            {businessName && (
              <p className="text-muted-foreground text-xs">{businessName}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
