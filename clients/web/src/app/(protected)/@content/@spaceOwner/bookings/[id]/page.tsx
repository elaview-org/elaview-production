import api from "@/api/server";
import { graphql } from "@/types/gql";
import { notFound } from "next/navigation";
import { BookingStatus } from "@/types/gql/graphql";
import Header from "./header";
import Timeline from "./timeline";
import SpaceCard from "./space-card";
import CampaignCard from "./campaign-card";
import FinancialSummary from "./financial-summary";
import ProofSection from "./proof-section";
import ProofUpload from "./proof-upload";
import DisputeSection from "./dispute-section";
import ActionsBar from "./actions-bar";

export default async function Page(props: PageProps<"/bookings/[id]">) {
  const { id } = await props.params;

  const booking = await api
    .query({
      query: graphql(`
        query BookingDetail($id: ID!) {
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
            ownerPayoutAmount
            ownerNotes
            advertiserNotes
            rejectionReason
            rejectedAt
            cancellationReason
            cancelledAt
            fileDownloadedAt
            space {
              id
              title
              images
              address
              city
              state
              zipCode
            }
            campaign {
              id
              name
              imageUrl
              advertiserProfile {
                companyName
                user {
                  name
                  avatar
                }
              }
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
            payouts {
              id
              amount
              stage
              status
              processedAt
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
          {!booking.proof && booking.status === BookingStatus.Installed && (
            <ProofUpload bookingId={booking.id as string} />
          )}
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
