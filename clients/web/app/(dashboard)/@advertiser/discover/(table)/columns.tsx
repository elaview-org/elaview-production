"use client";

import {
  actionsColumn,
  currencyColumn,
  imageTextColumn,
  textColumn,
} from "@/components/composed/table-view";
import { SPACE_TYPE } from "@/lib/constants";
import { SpaceType } from "@/types/gql/graphql";
import { IconCalendar, IconEye } from "@tabler/icons-react";

export type SpaceRow = {
  id: string;
  title: string;
  city: string;
  state: string;
  images: string[];
  type: SpaceType;
  pricePerDay: number;
};

export const columns = [
  imageTextColumn<SpaceRow>({
    key: "space",
    header: "Space",
    image: (row) => row.images[0],
    text: "title",
    href: (row) => `/spaces/${row.id}`,
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
  currencyColumn<SpaceRow>({
    key: "pricePerDay",
    header: "Price/Day",
    value: "pricePerDay",
  }),
  actionsColumn<SpaceRow>({
    items: (row) => [
      {
        label: "View Details",
        href: () => `/spaces/${row.id}`,
        icon: <IconEye className="size-4" />,
      },
      {
        label: "Book Now",
        href: () => `/spaces/${row.id}#book`,
        icon: <IconCalendar className="size-4" />,
      },
    ],
  }),
];
