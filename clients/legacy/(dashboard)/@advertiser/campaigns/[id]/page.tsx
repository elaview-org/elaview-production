// src/app/(advertiser)/campaigns/[id]/page.tsx - REFACTORED VERSION
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { api } from "../../../../../../elaview-mvp/src/trpc/react";
import { type Decimal } from "@prisma/client-runtime-utils";
import { AlertCircle, Loader2 } from "lucide-react";
import { addHours, differenceInHours } from "date-fns";
import type { CampaignStatus } from "@prisma/client";

// Component imports
import { CampaignHeader } from "./components/CampaignHeader";
import { PaymentBanners } from "./components/PaymentBanners";
import { PriorityAlert } from "./components/PriorityAlert";
import { ProofReviewSection } from "./components/ProofReviewSection";
import { PaymentSelectionSection } from "./components/PaymentSelectionSection";
import { CampaignDetails } from "./components/CampaignDetails";
import { BookingsList } from "./components/BookingsList";
import { CampaignSidebar } from "./components/CampaignSidebar";
import { PaymentSummaryFooter } from "./components/PaymentSummaryFooter";
import { CampaignModals } from "./components/CampaignModals";

// Type definitions
interface Space {
  title: string;
  [key: string]: unknown;
}

interface Booking {
  id: string;
  status: string;
  proofStatus: string | null;
  totalAmount: Decimal | number;
  platformFee: Decimal | number;
  stripeFee: Decimal | number | null;
  space: Space;
  [key: string]: unknown;
}

interface Campaign {
  id: string;
  name: string;
  bookings: Booking[];
  description?: string | null;
  status: CampaignStatus;
  targetAudience?: string | null;
  goals?: string | null;
  totalBudget: number | Decimal;
  imageUrl: string;
  startDate?: string | null | Date;
  endDate?: string | null | Date;
  createdAt: string | Date;

  _count: {
    bookings: number;
  };
  [key: string]: unknown;
}

interface Message {
  messageType: string;
  bookingId: string | null;
  createdAt: Date | string;
  [key: string]: unknown;
}

const decimalToNumber = (
  value: Decimal | number | null | undefined
): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  return Number(value.toString());
};

export default function CampaignDetailPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const campaignId = params.id;

  // State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [expandedProofBookingId, setExpandedProofBookingId] = useState<
    string | null
  >(null);
  const [reportIssueBookingId, setReportIssueBookingId] = useState<
    string | null
  >(null);
  const [processingBookingIds, setProcessingBookingIds] = useState<string[]>(
    []
  );
  const [selectedBookingIds, setSelectedBookingIds] = useState<Set<string>>(
    new Set()
  );
  const [expandedBookings, setExpandedBookings] = useState<Set<string>>(
    new Set()
  );
  const [declineModalBookingId, setDeclineModalBookingId] = useState<
    string | null
  >(null);
  const [declineReason, setDeclineReason] = useState("");

  // Queries
  const campaignQuery = api.campaigns.getById.useQuery(
    { id: campaignId },
    {
      enabled: isLoaded && !!user,
      refetchOnWindowFocus: true,
    }
  );
  const campaign = campaignQuery.data as Campaign | undefined;
  const campaignError = campaignQuery.error as { message: string };
  const campaignLoading = campaignQuery.isLoading;
  const refetchCampaign = campaignQuery.refetch;

  const { data: messages } = api.messages.getConversation.useQuery(
    { campaignId },
    { enabled: !!campaign }
  ) as {
    data: Message[];
  };

  const utils = api.useUtils();

  // Mutations
  const declineBooking = api.bookings.declineApprovedBooking.useMutation({
    onSuccess: () => {
      void utils.campaigns.getById.invalidate({ id: campaignId });
      setDeclineModalBookingId(null);
      setDeclineReason("");
      setSelectedBookingIds((prev) => {
        const newSet = new Set(prev);
        if (declineModalBookingId) {
          newSet.delete(declineModalBookingId);
        }
        return newSet;
      });
    },
    onError: (error) => {
      alert(error.message || "Failed to decline booking");
    },
  });

  const createCheckoutSession = api.bookings.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      alert(error.message || "Failed to create payment session");
    },
  });

  const deleteCampaign = api.campaigns.delete.useMutation({
    onSuccess: () => {
      router.push("/campaigns");
    },
    onError: (error) => {
      alert(error.message || "Failed to delete campaign");
    },
  });

  // Payment success polling effect
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const bookingIdsParam = searchParams.get("bookingIds");

    if (paymentStatus === "success" && bookingIdsParam) {
      const bookingIds = bookingIdsParam.split(",");
      setProcessingBookingIds(bookingIds);
      setShowPaymentSuccess(true);
      setIsPolling(true);

      let pollCount = 0;
      const maxPolls = 15;

      const pollInterval = setInterval(() => {
        void (async () => {
          pollCount++;
          const result = await refetchCampaign();
          const resultCampaign = result?.data as Campaign | undefined;

          const allConfirmed = bookingIds.every((bookingId) => {
            const booking = resultCampaign?.bookings?.find(
              (b) => b.id === bookingId
            );
            return (
              booking &&
              ["CONFIRMED", "PENDING_BALANCE"].includes(booking.status)
            );
          });

          if (allConfirmed || pollCount >= maxPolls) {
            clearInterval(pollInterval);
            setIsPolling(false);
            setProcessingBookingIds([]);

            setTimeout(() => {
              setShowPaymentSuccess(false);
              router.replace(`/campaigns/${campaignId}`);
            }, 2000);
          }
        })();
      }, 2000);

      return () => clearInterval(pollInterval);
    }
  }, [searchParams, campaignId, router, refetchCampaign]);

  // Computed data
  const proofMessages = useMemo(() => {
    const proofMap = new Map<string, Message>();
    messages
      .filter((m: Message) => m.messageType === "PROOF_SUBMISSION")
      .forEach((m: Message) => {
        if (m.bookingId) {
          proofMap.set(m.bookingId, m);
        }
      });
    return proofMap;
  }, [messages]);

  const bookingsByStatus = useMemo(() => {
    if (!campaign?.bookings)
      return {
        needsProofReview: [] as Booking[],
        needsPayment: [] as Booking[],
        processing: [] as Booking[],
        paid: [] as Booking[],
        pending: [] as Booking[],
        rejected: [] as Booking[],
        canMessage: false,
      };

    const bookings: Booking[] = campaign.bookings;

    const bookingsWithProofPending = bookings.filter(
      (b: Booking) => b.proofStatus === "PENDING" && proofMessages.has(b.id)
    );

    const approvedBookings = bookings.filter(
      (b: Booking) => b.status === "APPROVED"
    );
    const processingBookings = approvedBookings.filter((b: Booking) =>
      processingBookingIds.includes(b.id)
    );
    const needsPaymentBookings = approvedBookings.filter(
      (b: Booking) => !processingBookingIds.includes(b.id)
    );

    return {
      needsProofReview: bookingsWithProofPending,
      needsPayment: needsPaymentBookings,
      processing: processingBookings,
      paid: bookings.filter((b: Booking) =>
        ["CONFIRMED", "PENDING_BALANCE", "ACTIVE", "COMPLETED"].includes(
          b.status
        )
      ),
      pending: bookings.filter((b: Booking) => b.status === "PENDING_APPROVAL"),
      rejected: bookings.filter(
        (b: Booking) => b.status === "REJECTED" || b.status === "CANCELLED"
      ),
      canMessage: bookings.some((b: Booking) =>
        [
          "APPROVED",
          "CONFIRMED",
          "PENDING_BALANCE",
          "ACTIVE",
          "COMPLETED",
        ].includes(b.status)
      ),
    };
  }, [campaign?.bookings, proofMessages, processingBookingIds]);

  const selectedPaymentTotal = useMemo(() => {
    const selected = bookingsByStatus.needsPayment.filter((b: Booking) =>
      selectedBookingIds.has(b.id)
    );
    const subtotal = selected.reduce(
      (sum: number, b: Booking) => sum + decimalToNumber(b.totalAmount),
      0
    );
    const platformFees = selected.reduce(
      (sum: number, b: Booking) => sum + decimalToNumber(b.platformFee),
      0
    );
    const stripeFees = selected.reduce(
      (sum: number, b: Booking) => sum + decimalToNumber(b.stripeFee ?? 0),
      0
    );
    return {
      subtotal,
      platformFees,
      stripeFees,
      total: subtotal + platformFees + stripeFees,
      count: selected.length,
      bookings: selected,
    };
  }, [bookingsByStatus.needsPayment, selectedBookingIds]);

  // Handlers
  const toggleBookingSelection = (bookingId: string) => {
    setSelectedBookingIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bookingId)) {
        newSet.delete(bookingId);
      } else {
        newSet.add(bookingId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedBookingIds.size === bookingsByStatus.needsPayment.length) {
      setSelectedBookingIds(new Set());
    } else {
      setSelectedBookingIds(
        new Set(bookingsByStatus.needsPayment.map((b: Booking) => b.id))
      );
    }
  };

  const toggleExpanded = (bookingId: string) => {
    setExpandedBookings((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bookingId)) {
        newSet.delete(bookingId);
      } else {
        newSet.add(bookingId);
      }
      return newSet;
    });
  };

  const handlePaySelected = () => {
    if (selectedBookingIds.size === 0) return;
    createCheckoutSession.mutate({
      bookingIds: Array.from(selectedBookingIds),
    });
  };

  const handleDeclineBooking = () => {
    if (!declineModalBookingId || !declineReason.trim()) return;
    declineBooking.mutate({
      bookingId: declineModalBookingId,
      reason: declineReason.trim(),
    });
  };

  // Calculate campaign health
  const calculateCampaignHealth = () => {
    if (!campaign) return { percentage: 0, status: "empty", color: "slate" };

    const total = campaign._count.bookings;
    if (total === 0) return { percentage: 0, status: "empty", color: "slate" };

    const confirmed = bookingsByStatus.paid.length;
    const percentage = (confirmed / total) * 100;

    if (percentage === 100)
      return { percentage, status: "complete", color: "green" };
    if (percentage >= 50)
      return { percentage, status: "healthy", color: "blue" };
    if (percentage > 0)
      return { percentage, status: "in-progress", color: "amber" };
    return { percentage: 0, status: "pending", color: "slate" };
  };

  // Get page priority
  const getPagePriority = () => {
    if (bookingsByStatus.needsProofReview.length > 0) {
      const urgentProofs = bookingsByStatus.needsProofReview.filter(
        (b: Booking) => {
          const proof = proofMessages.get(b.id);
          if (!proof) return false;
          const proofCreatedAt = proof.createdAt;
          const hoursLeft = differenceInHours(
            addHours(new Date(proofCreatedAt), 48),
            new Date()
          );
          return hoursLeft < 12;
        }
      );

      if (urgentProofs.length > 0) {
        return {
          level: "urgent" as const,
          title: "🚨 Urgent: Proof Review Needed",
          message: `${urgentProofs.length} proof${urgentProofs.length !== 1 ? "s" : ""} will auto-approve in less than 12 hours`,
          action: "Review Now",
          sectionId: "proof-review-section",
        };
      }

      return {
        level: "warning" as const,
        title: "Action Needed: Review Installation Proof",
        message: `${bookingsByStatus.needsProofReview.length} space${bookingsByStatus.needsProofReview.length !== 1 ? "s" : ""} awaiting your approval`,
        action: "Review Proof",
        sectionId: "proof-review-section",
      };
    }

    if (bookingsByStatus.needsPayment.length > 0) {
      return {
        level: "action" as const,
        title: "Ready to Launch",
        message: `${bookingsByStatus.needsPayment.length} approved space${bookingsByStatus.needsPayment.length !== 1 ? "s are" : " is"} ready to activate`,
        action: "Select & Pay",
        sectionId: "payment-section",
      };
    }

    return null;
  };

  // Loading state
  if (!isLoaded || campaignLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Error state
  if (campaignError || !campaign) {
    return (
      <div className="py-12 text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
        <h2 className="mb-2 text-lg font-semibold text-white">
          Campaign Not Found
        </h2>
        <p className="mb-4 text-slate-400">
          {campaignError?.message ??
            "The campaign you're looking for doesn't exist or you don't have permission to view it."}
        </p>
        <button
          onClick={() => router.push("/campaigns")}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Back to Campaigns
        </button>
      </div>
    );
  }

  const allSelected =
    selectedBookingIds.size > 0 &&
    selectedBookingIds.size === bookingsByStatus.needsPayment.length;
  const health = calculateCampaignHealth();
  const priority = getPagePriority();

  // Get booking for report issue modal
  const reportIssueBooking = reportIssueBookingId
    ? {
        id: reportIssueBookingId,
        space: {
          title:
            bookingsByStatus.needsProofReview.find(
              (b: Booking) => b.id === reportIssueBookingId
            )?.space.title ?? "Space",
        },
      }
    : null;

  return (
    <>
      <div className="h-full w-full p-4">
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
          {/* Header */}
          <CampaignHeader
            campaign={campaign}
            onDelete={() => setShowDeleteModal(true)}
          />

          {/* Content - Scrollable */}
          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            {/* Payment Banners */}
            <PaymentBanners
              showPaymentSuccess={showPaymentSuccess}
              isPolling={isPolling}
              processingCount={bookingsByStatus.processing.length}
            />

            {/* Priority Alert */}
            <PriorityAlert priority={priority} />

            {/* Proof Review Section */}
            <ProofReviewSection
              bookings={bookingsByStatus.needsProofReview}
              proofMessages={proofMessages}
              expandedProofBookingId={expandedProofBookingId}
              onExpandProof={setExpandedProofBookingId}
              onReportIssue={setReportIssueBookingId}
            />

            {/* Payment Selection Section */}
            <PaymentSelectionSection
              bookings={bookingsByStatus.needsPayment}
              selectedBookingIds={selectedBookingIds}
              expandedBookings={expandedBookings}
              allSelected={allSelected}
              onToggleBookingSelection={toggleBookingSelection}
              onToggleSelectAll={toggleSelectAll}
              onToggleExpanded={toggleExpanded}
              onDeclineBooking={setDeclineModalBookingId}
              selectedPaymentTotal={selectedPaymentTotal}
            />

            {/* Campaign Overview */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Main Content */}
              <div className="space-y-6 lg:col-span-2">
                <CampaignDetails campaign={campaign} />
                <BookingsList
                  campaign={campaign}
                  bookingsByStatus={bookingsByStatus}
                  proofMessages={proofMessages}
                />
              </div>

              {/* Sidebar */}
              <CampaignSidebar
                campaign={campaign}
                bookingsByStatus={bookingsByStatus}
                health={health}
              />
            </div>
          </div>

          {/* Payment Summary Footer */}
          <PaymentSummaryFooter
            selectedBookingIds={selectedBookingIds}
            selectedPaymentTotal={selectedPaymentTotal}
            isProcessing={createCheckoutSession.isPending}
            onClearSelection={() => setSelectedBookingIds(new Set())}
            onPaySelected={handlePaySelected}
          />
        </div>
      </div>

      {/* Modals */}
      <CampaignModals
        reportIssueBookingId={reportIssueBookingId}
        reportIssueBooking={reportIssueBooking}
        onReportIssueSuccess={() => {
          setReportIssueBookingId(null);
          void refetchCampaign();
        }}
        onReportIssueCancel={() => setReportIssueBookingId(null)}
        declineModalBookingId={declineModalBookingId}
        declineReason={declineReason}
        isDeclineProcessing={declineBooking.isPending}
        onDeclineReasonChange={setDeclineReason}
        onDeclineConfirm={handleDeclineBooking}
        onDeclineCancel={() => {
          setDeclineModalBookingId(null);
          setDeclineReason("");
        }}
        showDeleteModal={showDeleteModal}
        campaignName={campaign.name}
        isDeleteProcessing={deleteCampaign.isPending}
        onDeleteConfirm={() => {
          setShowDeleteModal(false);
          deleteCampaign.mutate({ id: campaignId });
        }}
        onDeleteCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}
