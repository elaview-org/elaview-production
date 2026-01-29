"use client";

import { useState } from "react";
import StatusTimeline from "./status-timeline";
import SpaceInfo from "./space-info";
import InstallationReviews from "./installation-review";
import PaymentSummary from "./payment-summary";
import { BookingHeader } from "./booking-header";
import { CampaignInfoCard } from "./campaign-info-card";
import { CreativePreviewCard } from "./creative-preview-card";
import { ActionsPanelCard } from "./actions-panel-card";
import { ActivityTimelineCard } from "./activity-timeline-card";
import ConfirmModal from "./confirm-modal";
import DisputeModal from "./dispute-modal";
import type { BookingDetailsData } from "./booking-queries";

interface BookingDetailsWrapperProps {
  bookingId: string;
  initialData: BookingDetailsData;
}

export default function BookingDetailsWrapper({
  bookingId,
  initialData,
}: BookingDetailsWrapperProps) {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openDisputeModal, setOpenDisputeModal] = useState(false);

  const { booking, timelineEvents } = initialData;

  const handleApproveInstallation = () => {
    // TODO: Implement approval logic with bookingId
    console.log("Approving installation for booking:", bookingId);
  };

  const handleSubmitDispute = (reason: string, details?: string) => {
    // TODO: Implement dispute submission logic with bookingId
    console.log("Submitting dispute for booking:", bookingId, {
      reason,
      details,
    });
  };

  const handleCancelBooking = () => {
    // TODO: Implement cancel logic
    console.log("Cancelling booking:", bookingId);
  };

  const getStatusStep = (status: string): number => {
    const statusMap: Record<string, number> = {
      PENDING_APPROVAL: 1,
      ACCEPTED: 1,
      PAID: 2,
      FILE_DOWNLOADED: 2,
      INSTALLED: 3,
      VERIFIED: 4,
      COMPLETED: 5,
      DISPUTED: 4,
      CANCELLED: 1,
    };
    return statusMap[status] || 1;
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* Header Section */}
      <BookingHeader
        bookingId={booking.id}
        startDate={booking.dateRange.startDate}
        endDate={booking.dateRange.endDate}
        status={booking.status}
        onCancelClick={handleCancelBooking}
      />

      {/* Status Timeline */}
      <StatusTimeline currentStep={getStatusStep(booking.status)} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          <SpaceInfo space={booking.space} bookingId={booking.id} />
          <CampaignInfoCard campaign={booking.campaign} />
          <InstallationReviews verification={booking.verification} />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          <PaymentSummary booking={booking} payment={booking.payment} />
          <CreativePreviewCard
            creativeFileUrl={booking.creativeFileUrl}
            creativeFileName={booking.creativeFileName}
            creativeFileSize={booking.creativeFileSize}
            width={booking.space.width}
            height={booking.space.height}
            dimensionUnit={booking.space.dimensionUnit}
          />
          <ActionsPanelCard
            status={booking.status}
            bookingId={booking.id}
            onApproveClick={() => setOpenConfirmModal(true)}
            onDisputeClick={() => setOpenDisputeModal(true)}
            onCancelClick={handleCancelBooking}
          />
        </div>
      </div>

      {/* Activity Timeline (Full Width) */}
      <ActivityTimelineCard events={timelineEvents} />

      {/* Modals */}
      <ConfirmModal
        isOpen={openConfirmModal}
        handleOpenChange={setOpenConfirmModal}
        onConfirm={handleApproveInstallation}
      />
      <DisputeModal
        isOpen={openDisputeModal}
        handleOpenChange={setOpenDisputeModal}
        onSubmit={handleSubmitDispute}
      />
    </div>
  );
}
