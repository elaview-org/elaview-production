"use client";

import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import TableView from "@/components/composed/table-view";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import { columns, type SpaceRow } from "./columns";
import TablePlaceholder from "./placeholder";

export const DiscoverTable_SpaceFragment = graphql(`
  fragment DiscoverTable_SpaceFragment on Space {
    id
    title
    city
    state
    images
    type
    pricePerDay
  }
`);

type Props = {
  data: FragmentType<typeof DiscoverTable_SpaceFragment>[];
};

export default function DiscoverTable({ data }: Props) {
  const spaces: SpaceRow[] = data.map((d) => {
    const space = getFragmentData(DiscoverTable_SpaceFragment, d);
    return {
      id: space.id as string,
      title: space.title,
      city: space.city,
      state: space.state,
      images: space.images as string[],
      type: space.type,
      pricePerDay: Number(space.pricePerDay),
    };
  });

  return (
    <MaybePlaceholder data={data} placeholder={<TablePlaceholder />}>
      <TableView data={spaces} columns={columns} getRowId={(row) => row.id} />
    </MaybePlaceholder>
  );
}
