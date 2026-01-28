import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import { SPACE_STATUS } from "@/lib/constants";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import { IconChevronLeft } from "@tabler/icons-react";
import Link from "next/link";

export const Header_SpaceFragment = graphql(`
  fragment Header_SpaceFragment on Space {
    title
    status
  }
`);

type Props = {
  data: FragmentType<typeof Header_SpaceFragment>;
};

export default function Header({ data }: Props) {
  const space = getFragmentData(Header_SpaceFragment, data);

  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" asChild>
        <Link href="/listings">
          <IconChevronLeft className="size-5" />
        </Link>
      </Button>
      <h1 className="text-2xl font-semibold">{space.title}</h1>
      <Badge variant={SPACE_STATUS.variants[space.status]}>
        {SPACE_STATUS.labels[space.status]}
      </Badge>
    </div>
  );
}
