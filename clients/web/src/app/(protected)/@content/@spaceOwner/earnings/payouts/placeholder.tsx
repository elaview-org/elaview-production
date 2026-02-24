import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import { IconCash, IconFilter, IconAlertCircle } from "@tabler/icons-react";
import type { FilterTabKey } from "./constants";

type Props = {
  tabKey?: FilterTabKey;
};

export default function Placeholder({ tabKey = "all" }: Props) {
  const content = getEmptyContent(tabKey);

  return (
    <Empty className="border py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">{content.icon}</EmptyMedia>
        <EmptyTitle>{content.title}</EmptyTitle>
        <EmptyDescription>{content.description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

function getEmptyContent(tabKey: FilterTabKey) {
  switch (tabKey) {
    case "pending":
      return {
        icon: <IconCash />,
        title: "No pending payouts",
        description: "All your payouts have been processed",
      };
    case "completed":
      return {
        icon: <IconCash />,
        title: "No completed payouts",
        description:
          "Completed payouts will appear here once bookings are verified",
      };
    case "failed":
      return {
        icon: <IconAlertCircle />,
        title: "No failed payouts",
        description: "All your payouts have been processed successfully",
      };
    default:
      return {
        icon: <IconFilter />,
        title: "No payouts found",
        description:
          "Payouts will appear here once advertisers complete bookings on your spaces",
      };
  }
}
