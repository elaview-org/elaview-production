import { IconTrophy } from "@tabler/icons-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import SectionCard from "@/components/composed/section-card";

export default function Placeholder() {
  return (
    <SectionCard
      title="Top Performers"
      description="Your best performing spaces and areas that need attention"
    >
      <Empty className="py-8">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconTrophy />
          </EmptyMedia>
          <EmptyTitle>No performers yet</EmptyTitle>
          <EmptyDescription>
            Top performing spaces will appear here once you start campaigns.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </SectionCard>
  );
}
