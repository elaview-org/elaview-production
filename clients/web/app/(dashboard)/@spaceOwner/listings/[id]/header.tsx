import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import { SpaceStatus } from "@/types/gql/graphql";
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

const STATUS_LABELS: Record<SpaceStatus, string> = {
  [SpaceStatus.Active]: "Active",
  [SpaceStatus.Inactive]: "Inactive",
  [SpaceStatus.PendingApproval]: "Pending",
  [SpaceStatus.Rejected]: "Rejected",
  [SpaceStatus.Suspended]: "Suspended",
};

const STATUS_VARIANTS: Record<SpaceStatus, "default" | "secondary" | "destructive" | "outline"> = {
  [SpaceStatus.Active]: "default",
  [SpaceStatus.Inactive]: "secondary",
  [SpaceStatus.PendingApproval]: "outline",
  [SpaceStatus.Rejected]: "destructive",
  [SpaceStatus.Suspended]: "destructive",
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
      <Badge variant={STATUS_VARIANTS[space.status]}>
        {STATUS_LABELS[space.status]}
      </Badge>
    </div>
  );
}