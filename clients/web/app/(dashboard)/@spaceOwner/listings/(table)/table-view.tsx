"use client";

import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import TableView from "@/components/composed/table-view";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import { columns, type SpaceRow } from "./columns";
import TablePlaceholder from "./placeholder";

export const TableView_SpaceFragment = graphql(`
  fragment TableView_SpaceFragment on Space {
    id
    title
    city
    state
    images
    type
    status
    createdAt
  }
`);

type Props = {
  data: FragmentType<typeof TableView_SpaceFragment>[];
};

export default function ListingsTableView({ data }: Props) {
  const spaces: SpaceRow[] = data.map((d) => {
    const space = getFragmentData(TableView_SpaceFragment, d);
    return {
      id: space.id as string,
      title: space.title,
      city: space.city,
      state: space.state,
      images: space.images as string[],
      type: space.type,
      status: space.status,
      createdAt: space.createdAt as string,
    };
  });

  return (
    <MaybePlaceholder data={data} placeholder={<TablePlaceholder />}>
      <TableView data={spaces} columns={columns} getRowId={(row) => row.id} />
    </MaybePlaceholder>
  );
}