"use client";

import {
  IconCircleCheckFilled,
  IconClock,
  IconPlayerPlay,
  IconSend,
  IconEdit,
} from "@tabler/icons-react";
import TableView, {
  actionsColumn,
  badgeColumn,
  createSelectColumn,
  currencyColumn,
  dateRangeColumn,
  imageTextColumn,
  numberColumn,
  TableViewSkeleton,
} from "@/components/composed/table-view";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import {
  CampaignStatus,
  FragmentType,
  getFragmentData,
  graphql,
} from "@/types/gql";
import type { CampaignsTable_CampaignFragmentFragment } from "@/types/gql/graphql";
import { CAMPAIGN_STATUS } from "@/lib/constants";
import { type FilterTabKey } from "../constants";
import Placeholder from "./placeholder";

export const CampaignsTable_CampaignFragment = graphql(`
  fragment CampaignsTable_CampaignFragment on Campaign {
    id
    name
    description
    status
    startDate
    endDate
    totalBudget
    imageUrl
    bookings {
      nodes {
        id
      }
    }
  }
`);

type Props = {
  data: FragmentType<typeof CampaignsTable_CampaignFragment>[];
  tabKey: FilterTabKey;
};

export default function CampaignsTable({ data, tabKey }: Props) {
  const campaigns = getFragmentData(CampaignsTable_CampaignFragment, data);

  return (
    <MaybePlaceholder data={data} placeholder={<Placeholder tabKey={tabKey} />}>
      <TableView
        data={campaigns}
        columns={columns}
        getRowId={(row) => row.id as string}
      />
    </MaybePlaceholder>
  );
}

export function CampaignsTableSkeleton() {
  return <TableViewSkeleton columns={columns} rows={5} />;
}

type CampaignData = CampaignsTable_CampaignFragmentFragment;

function StatusIcon({ status }: { status: CampaignStatus }) {
  switch (status) {
    case CampaignStatus.Completed:
      return (
        <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
      );
    case CampaignStatus.Active:
      return <IconPlayerPlay className="text-green-500" />;
    case CampaignStatus.Submitted:
      return <IconSend className="text-blue-500" />;
    case CampaignStatus.Draft:
      return <IconEdit className="text-muted-foreground" />;
    default:
      return <IconClock className="text-muted-foreground" />;
  }
}

const columns = [
  createSelectColumn<CampaignData>(),
  imageTextColumn<CampaignData>({
    key: "campaign",
    header: "Campaign",
    image: (row) => row.imageUrl,
    text: (row) => row.name,
  }),
  dateRangeColumn<CampaignData>({
    key: "duration",
    header: "Duration",
    start: (row) => row.startDate as string,
    end: (row) => row.endDate as string,
  }),
  currencyColumn<CampaignData>({
    key: "budget",
    header: "Budget",
    value: (row) => row.totalBudget,
  }),
  numberColumn<CampaignData>({
    key: "bookings",
    header: "Bookings",
    value: (row) => row.bookings?.nodes?.length ?? 0,
  }),
  badgeColumn<CampaignData, CampaignStatus>({
    key: "status",
    header: "Status",
    value: (row) => row.status,
    labels: CAMPAIGN_STATUS.labels,
    icon: (status) => <StatusIcon status={status} />,
  }),
  actionsColumn<CampaignData>({
    items: (row) => {
      const status = row.status;
      const baseItems = [
        { label: "View Details", href: () => `/campaigns/${row.id}` },
        { separator: true as const },
      ];

      if (status === CampaignStatus.Draft) {
        return [
          ...baseItems,
          { label: "Edit Campaign" },
          { label: "Submit for Review" },
          { label: "Delete", variant: "destructive" as const },
        ];
      }

      if (status === CampaignStatus.Active) {
        return [
          ...baseItems,
          { label: "View Bookings" },
          { label: "Pause Campaign" },
        ];
      }

      if (status === CampaignStatus.Submitted) {
        return [...baseItems, { label: "Cancel Submission" }];
      }

      return baseItems.slice(0, -1);
    },
  }),
];
