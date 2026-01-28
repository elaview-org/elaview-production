import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import { IconMapSearch } from "@tabler/icons-react";

export default function MapPlaceholder() {
  return (
    <Empty className="border py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconMapSearch />
        </EmptyMedia>
        <EmptyTitle>No spaces found</EmptyTitle>
        <EmptyDescription>
          Try adjusting your filters or search in a different area
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
