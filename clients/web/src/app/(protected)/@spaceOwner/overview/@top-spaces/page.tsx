import SectionCard from "@/components/composed/section-card";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import SpaceCard from "./space-card";
import Placeholder from "./placeholder";
import { graphql } from "@/types/gql";
import api from "../api";

const OverviewTopSpaces_QueryFragment = graphql(`
  fragment OverviewTopSpaces_QueryFragment on Query {
    me {
      spaceOwnerProfile {
        spaces(first: 5, order: { totalRevenue: DESC }) {
          nodes {
            ...OverviewTopSpacesSpaceCard_SpaceFragment
          }
        }
      }
    }
  }
`);

export default async function Page() {
  const spaces = await api
    .getMyOverview(OverviewTopSpaces_QueryFragment)
    .then((res) => res.me?.spaceOwnerProfile?.spaces?.nodes ?? []);

  return (
    <SectionCard
      title="Top Spaces"
      description="Your best performing spaces"
      viewAllHref="/listings"
    >
      <MaybePlaceholder data={spaces} placeholder={<Placeholder />}>
        <div className="grid grid-cols-1 gap-3 @md/main:grid-cols-2 @lg/main:grid-cols-1 @2xl/main:grid-cols-2 @4xl/main:grid-cols-3">
          {spaces.slice(0, 5).map((space, index) => (
            <SpaceCard key={index} data={space} rank={index + 1} />
          ))}
        </div>
      </MaybePlaceholder>
    </SectionCard>
  );
}
