"use client";

import {
  createSelectColumn,
  imageTextColumn,
  textColumn,
  badgeColumn,
  dateColumn,
  actionsColumn,
} from "@/components/composed/table-view";
import { SPACE_STATUS, SPACE_TYPE } from "@/lib/constants";
import { SpaceStatus, SpaceType } from "@/types/gql/graphql";
import {
  IconEdit,
  IconEye,
  IconToggleLeft,
  IconTrash,
} from "@tabler/icons-react";

export type SpaceRow = {
  id: string;
  title: string;
  city: string;
  state: string;
  images: string[];
  type: SpaceType;
  status: SpaceStatus;
  createdAt: string;
};

export const columns = [
  createSelectColumn<SpaceRow>(),
  imageTextColumn<SpaceRow>({
    key: "space",
    header: "Space",
    image: (row) => row.images[0],
    text: "title",
    href: (row) => `/listings/${row.id}`,
  }),
  textColumn<SpaceRow>({
    key: "location",
    header: "Location",
    value: (row) => `${row.city}, ${row.state}`,
  }),
  textColumn<SpaceRow>({
    key: "type",
    header: "Type",
    value: (row) => SPACE_TYPE.labels[row.type],
  }),
  badgeColumn<SpaceRow, SpaceStatus>({
    key: "status",
    header: "Status",
    value: "status",
    labels: SPACE_STATUS.labels,
    variant: (status) => SPACE_STATUS.variants[status],
  }),
  dateColumn<SpaceRow>({
    key: "createdAt",
    header: "Created",
    value: "createdAt",
    format: "medium",
  }),
  actionsColumn<SpaceRow>({
    items: (row) => [
      {
        label: "View",
        href: () => `/listings/${row.id}`,
        icon: <IconEye className="size-4" />,
      },
      {
        label: "Edit",
        href: () => `/listings/${row.id}/edit`,
        icon: <IconEdit className="size-4" />,
      },
      { separator: true },
      {
        label: "Toggle status",
        onClick: () => {},
        icon: <IconToggleLeft className="size-4" />,
      },
      {
        label: "Delete",
        onClick: () => {},
        icon: <IconTrash className="size-4" />,
        variant: "destructive",
      },
    ],
  }),
];
