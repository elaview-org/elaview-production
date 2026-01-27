import { Button } from "@/components/primitives/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import { IconMap, IconPlus } from "@tabler/icons-react";
import Link from "next/link";

export default function MapPlaceholder() {
  return (
    <Empty className="border py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconMap />
        </EmptyMedia>
        <EmptyTitle>No spaces yet</EmptyTitle>
        <EmptyDescription>
          Create your first listing to see it on the map
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link href="/listings/new">
            <IconPlus />
            Create Listing
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}