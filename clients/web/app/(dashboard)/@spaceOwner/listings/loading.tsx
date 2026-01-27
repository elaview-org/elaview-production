import { cookies } from "next/headers";
import { ViewOptions } from "@/types/constants";
import storageKey from "@/lib/storage-keys";
import { GridViewSkeleton } from "@/components/composed/grid-view";
import { TableViewSkeleton } from "@/components/composed/table-view";
import { MapViewSkeleton } from "@/components/composed/map-view";
import { columns } from "./(table)/columns";

export default async function Loading() {
  const cookieStore = await cookies();
  const view = cookieStore.get(storageKey.preferences.listings.view)?.value as ViewOptions | undefined;

  switch (view) {
    case ViewOptions.Table:
      return <TableViewSkeleton columns={columns} rows={8} />;
    case ViewOptions.Map:
      return <MapViewSkeleton height={600} />;
    default:
      return <GridViewSkeleton count={8} columns={4} />;
  }
}