import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import {
  IconCreditCard,
  IconFilter,
  IconAlertCircle,
} from "@tabler/icons-react";
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
        icon: <IconCreditCard />,
        title: "No pending payments",
        description: "All your payments have been processed",
      };
    case "succeeded":
      return {
        icon: <IconCreditCard />,
        title: "No completed payments",
        description:
          "Completed payments will appear here once bookings are paid",
      };
    case "failed":
      return {
        icon: <IconAlertCircle />,
        title: "No failed payments",
        description: "All your payments have been processed successfully",
      };
    case "refunded":
      return {
        icon: <IconCreditCard />,
        title: "No refunded payments",
        description: "Refunded payments will appear here",
      };
    default:
      return {
        icon: <IconFilter />,
        title: "No payments found",
        description: "Payments will appear here once you book ad spaces",
      };
  }
}
