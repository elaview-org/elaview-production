import SectionCard from "@/components/composed/section-card";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import PayoutCard from "./payout-card";
import Placeholder from "./placeholder";
import { graphql } from "@/types/gql";
import api from "../api";

const OverviewUpcomingPayouts_QueryFragment = graphql(`
  fragment OverviewUpcomingPayouts_QueryFragment on Query {
    upcomingPayouts: myPayouts(
      first: 5
      where: { status: { in: [PENDING, PROCESSING] } }
      order: [{ createdAt: ASC }]
    ) {
      nodes {
        ...OverviewUpcomingPayoutsPayoutCard_PayoutFragment
      }
    }
  }
`);

export default async function Page() {
  const payouts = await api
    .getMyOverview(OverviewUpcomingPayouts_QueryFragment)
    .then((res) => res.upcomingPayouts?.nodes ?? []);

  return (
    <SectionCard
      title="Upcoming Payouts"
      description="Payouts pending processing"
      count={payouts.length}
      viewAllHref="/payouts"
    >
      <MaybePlaceholder data={payouts} placeholder={<Placeholder />}>
        <div className="flex flex-col gap-3">
          {payouts.slice(0, 5).map((payout, index) => (
            <PayoutCard key={index} data={payout} />
          ))}
        </div>
      </MaybePlaceholder>
    </SectionCard>
  );
}
