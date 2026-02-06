"use client";

import { useCallback, useState } from "react";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import TableView from "@/components/composed/table-view";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import { columns, type SpaceRow } from "./columns";
import TablePlaceholder from "./placeholder";
import BulkActions from "../bulk-actions";

export const ListingsTable_SpaceFragment = graphql(`
  fragment ListingsTable_SpaceFragment on Space {
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
  data: FragmentType<typeof ListingsTable_SpaceFragment>[];
};

export default function ListingsTable({ data }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [tableKey, setTableKey] = useState(0);

  const spaces: SpaceRow[] = data.map((d) => {
    const space = getFragmentData(ListingsTable_SpaceFragment, d);
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

  const handleClearSelection = useCallback(() => {
    setSelectedIds([]);
    setTableKey((k) => k + 1);
  }, []);

  return (
    <MaybePlaceholder data={data} placeholder={<TablePlaceholder />}>
      <div className="flex flex-col gap-4">
        <BulkActions
          selectedIds={selectedIds}
          onClearSelection={handleClearSelection}
        />
        <TableView
          key={tableKey}
          data={spaces}
          columns={columns}
          getRowId={(row) => row.id}
          onSelectionChange={setSelectedIds}
        />
      </div>
    </MaybePlaceholder>
  );
}
