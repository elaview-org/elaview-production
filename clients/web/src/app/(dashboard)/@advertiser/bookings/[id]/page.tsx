import api from "@/lib/gql/server";
import { graphql } from "@/types/gql";
import { notFound } from "next/navigation";
import Header from "./header";
import Timeline from "./timeline";
import SpaceCard from "./space-card";
import CampaignCard from "./campaign-card";
import FinancialSummary from "./financial-summary";
import ProofSection from "./proof-section";
import DisputeSection from "./dispute-section";
import ActionsBar from "./actions-bar";

export default async function Page(props: PageProps<"/bookings/[id]">) {
  const { id } = await props.params;

  const booking = await api
    .query({
      query: graphql(`
        query AdvertiserBookingDetail($id: ID!) {
          bookingById(id: $id) {
            id
            status
            startDate
            endDate
            createdAt
            totalDays
            pricePerDay
            subtotalAmount
            installationFee
            platformFeeAmount
            platformFeePercent
            totalAmount
            advertiserNotes
            rejectionReason
            rejectedAt
            cancellationReason
            cancelledAt
            space {
              id
              title
              images
              address
              city
              state
              zipCode
              owner {
                businessName
                user {
                  name
                  avatar
                }
              }
            }
            campaign {
              id
              name
              imageUrl
            }
            proof {
              id
              status
              photos
              submittedAt
              autoApproveAt
              rejectionReason
            }
            dispute {
              id
              issueType
              reason
              photos
              disputedAt
              resolutionAction
              resolutionNotes
              resolvedAt
            }
            payments {
              id
              amount
              status
              createdAt
            }
          }
        }
      `),
      variables: { id },
    })
    .then((res) => res.data?.bookingById);

  if (!booking) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 pb-24">
      <Header booking={booking} />
      <Timeline status={booking.status} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <SpaceCard space={booking.space} />
          <CampaignCard campaign={booking.campaign} booking={booking} />
          {booking.proof && <ProofSection proof={booking.proof} />}
          {booking.dispute && <DisputeSection dispute={booking.dispute} />}
        </div>
        <div className="flex flex-col gap-6">
          <FinancialSummary booking={booking} />
        </div>
      </div>

      <ActionsBar booking={booking} />
    </div>
  );
}
