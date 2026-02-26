import SectionCard from "@/components/composed/section-card";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import PaymentCard from "./payment-card";
import Placeholder from "./placeholder";
import { graphql } from "@/types/gql";
import api from "../api";

const AdvertiserOverviewPendingPayments_QueryFragment = graphql(`
  fragment AdvertiserOverviewPendingPayments_QueryFragment on Query {
    pendingPayments: myBookingsAsAdvertiser(
      first: 5
      where: { status: { eq: APPROVED } }
      order: [{ createdAt: ASC }]
    ) {
      nodes {
        ...AdvertiserOverviewPendingPaymentsPaymentCard_BookingFragment
      }
    }
  }
`);

export default async function Page() {
  const bookings = await api
    .getAdvertiserOverview(AdvertiserOverviewPendingPayments_QueryFragment)
    .then((res) => res.pendingPayments?.nodes ?? []);

  return (
    <SectionCard
      title="Pending Payments"
      description="Approved bookings awaiting payment"
      count={bookings.length}
      viewAllHref="/bookings?status=approved"
    >
      <MaybePlaceholder data={bookings} placeholder={<Placeholder />}>
        <div className="grid grid-cols-1 gap-4 @lg/main:grid-cols-2 @3xl/main:grid-cols-3">
          {bookings.slice(0, 3).map((booking, index) => (
            <PaymentCard key={index} data={booking} />
          ))}
        </div>
      </MaybePlaceholder>
    </SectionCard>
  );
}
