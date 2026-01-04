// src/app/requests/page.tsx
"use client";

import { useState } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  DollarSign,
  MapPin,
  Building,
  AlertCircle,
  User,
  Briefcase,
  X,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { differenceInDays, subDays, format } from "date-fns";
import { ImageLightbox } from "@/shared/components/ui/ImageLightbox";
import useSpacesOwnerRequests from "@/shared/hooks/api/getters/useSpacesOwnerRequests/useSpacesOwnerRequests";
import useBookingApproveRequest from "@/shared/hooks/api/actions/useBookingApproveRequest/useBookingApproveRequest";
import useBookingsRejectRequest from "@/shared/hooks/api/actions/useBookingsRejectRequest/useBookingsRejectRequest";

type RequestTab = "pending" | "approved" | "rejected" | "all";

// Helper function to get proof submission status
function getProofSubmissionStatus(booking: any) {
  if (!["CONFIRMED", "PENDING_BALANCE"].includes(booking.status)) {
    return null;
  }

  const INSTALLATION_WINDOW_DAYS = 7;
  const daysUntilStart = differenceInDays(booking.startDate, new Date());
  const windowOpenDate = subDays(booking.startDate, INSTALLATION_WINDOW_DAYS);

  if (booking.proofStatus === "PENDING") {
    return {
      message: "Proof submitted - awaiting approval",
      variant: "info" as const,
      icon: "⏳",
    };
  }

  if (booking.proofStatus === "APPROVED") {
    return {
      message: "Proof approved - payment processed",
      variant: "success" as const,
      icon: "✅",
    };
  }

  if (daysUntilStart > INSTALLATION_WINDOW_DAYS) {
    return {
      message: `Installation window opens ${format(windowOpenDate, "MMM d")}`,
      variant: "info" as const,
      icon: "📅",
    };
  }

  if (daysUntilStart < 0) {
    return {
      message: "OVERDUE - Submit proof immediately!",
      variant: "error" as const,
      icon: "🚨",
    };
  }

  if (daysUntilStart <= 1) {
    return {
      message: "LAST DAY to submit proof!",
      variant: "warning" as const,
      icon: "⚠️",
    };
  }

  return {
    message: `Ready to install (${daysUntilStart} days until start)`,
    variant: "success" as const,
    icon: "✅",
  };
}

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState<RequestTab>("pending");
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string>("");
  const [lightboxAlt, setLightboxAlt] = useState<string>("");
  const [rejectingRequest, setRejectingRequest] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const { requests, isLoading, refetch } = useSpacesOwnerRequests();
  const { approveBookingRequest, isPending: approveMutationPending } =
    useBookingApproveRequest();
const {rejectBookingRequest,isPending:rejectMutationPending} = useBookingsRejectRequest();


  const handleApprove = (bookingId: string) => {
    if (
      confirm(
        "Approve this campaign request? The advertiser will be notified and can proceed with payment."
      )
    ) {
      approveBookingRequest();
      //   approveMutation.mutate({ bookingId });
    }
  };

  const handleRejectClick = (bookingId: string) => {
    setRejectingRequest(bookingId);
    setRejectionReason("");
  };

  const handleRejectSubmit = () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    if (rejectingRequest) {
        rejectBookingRequest();
    //   rejectMutation.mutate({
    //     bookingId: rejectingRequest,
    //     reason: rejectionReason.trim(),
    //   });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_APPROVAL":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            <Clock className="mr-1.5 h-3 w-3" />
            Pending Review
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
            <CheckCircle className="mr-1.5 h-3 w-3" />
            Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="mr-1.5 h-3 w-3" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const pendingCount =
    requests?.filter((r) => r.status === "PENDING_APPROVAL").length || 0;
  const approvedCount =
    requests?.filter((r) => r.status === "APPROVED").length || 0;
  const rejectedCount =
    requests?.filter((r) => r.status === "REJECTED").length || 0;

  if (isLoading) {
    return (
      <div className="h-full w-full p-4">
        <div className="h-full bg-slate-900 border border-slate-800 rounded-xl shadow-xl flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-green-500" />
            <p className="text-sm text-slate-400">Loading requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-4">
      <div className="h-full bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-6 border-b border-slate-700">
          <h1 className="text-3xl font-bold text-white">Campaign Requests</h1>
          <p className="text-slate-400 mt-2">
            Review and approve advertising campaigns for your spaces.
          </p>
        </div>

        {/* Tabs - Fixed */}
        <div className="flex-shrink-0 border-b border-slate-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("pending")}
              className={`${
                activeTab === "pending"
                  ? "border-green-500 text-green-400"
                  : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
            >
              <Clock className="mr-2 h-4 w-4" />
              Pending
              {pendingCount > 0 && (
                <span className="ml-2 bg-green-500/10 text-green-400 border border-green-500/20 py-0.5 px-2 rounded-full text-xs font-medium">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`${
                activeTab === "approved"
                  ? "border-green-500 text-green-400"
                  : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approved ({approvedCount})
            </button>
            <button
              onClick={() => setActiveTab("rejected")}
              className={`${
                activeTab === "rejected"
                  ? "border-green-500 text-green-400"
                  : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Rejected ({rejectedCount})
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`${
                activeTab === "all"
                  ? "border-green-500 text-green-400"
                  : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              All Requests
            </button>
          </nav>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Empty State */}
          {!requests || requests.length === 0 ? (
            <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg p-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-700 mx-auto mb-4">
                <Building className="h-7 w-7 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                No requests found
              </h3>
              <p className="text-slate-400">
                {activeTab === "pending"
                  ? "You don't have any pending approval requests at the moment."
                  : `No ${activeTab} requests to display.`}
              </p>
            </div>
          ) : (
            /* Requests List */
            <div className="space-y-6">
              {requests.map((request) => {
                const ownerRevenue = Number(request.totalAmount);
                const platformFee = Number(request.platformFee);

                return (
                  <div
                    key={request.id}
                    className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden hover:border-slate-600 transition-all"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">
                            {request.campaign.name}
                          </h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-400">
                            ${ownerRevenue.toFixed(2)}
                          </div>
                          <div className="text-xs text-slate-500">
                            You receive
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Campaign Creative */}
                        <div className="lg:col-span-1">
                          <h4 className="text-sm font-semibold text-white mb-3">
                            Campaign Creative
                          </h4>
                          {request.campaign.imageUrl ? (
                            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border-2 border-slate-600 bg-slate-700 cursor-pointer group">
                              <Image
                                src={request.campaign.imageUrl}
                                alt={request.campaign.name}
                                fill
                                className="object-contain bg-slate-800"
                              />
                              <button
                                onClick={() => {
                                  setLightboxImageUrl(
                                    request.campaign.imageUrl
                                  );
                                  setLightboxAlt(request.campaign.name);
                                  setIsLightboxOpen(true);
                                }}
                                className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all flex items-center justify-center"
                              >
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-3">
                                  <Eye className="h-6 w-6 text-slate-900" />
                                </div>
                              </button>
                            </div>
                          ) : (
                            <div className="w-full aspect-[4/3] rounded-lg bg-slate-700 flex items-center justify-center border-2 border-dashed border-slate-600">
                              <div className="text-center">
                                <AlertCircle className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                                <p className="text-sm text-slate-400">
                                  No creative uploaded
                                </p>
                              </div>
                            </div>
                          )}

                          {request.campaign.description && (
                            <div className="mt-3">
                              <p className="text-xs text-slate-500 font-medium mb-1">
                                Description
                              </p>
                              <p className="text-sm text-slate-300 line-clamp-3">
                                {request.campaign.description}
                              </p>
                            </div>
                          )}

                          {request.campaign.targetAudience && (
                            <div className="mt-3">
                              <p className="text-xs text-slate-500 font-medium mb-1">
                                Target Audience
                              </p>
                              <p className="text-sm text-slate-300">
                                {request.campaign.targetAudience}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Middle Column - Request Details */}
                        <div className="lg:col-span-2 space-y-4">
                          {/* Advertiser Info */}
                          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                            <h4 className="text-sm font-semibold text-white mb-3">
                              Advertiser Information
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm">
                                <User className="h-4 w-4 text-slate-500 mr-2" />
                                <span className="text-slate-400">Name:</span>
                                <span className="ml-2 font-medium text-white">
                                  {request.campaign.advertiser.name ||
                                    "Not provided"}
                                </span>
                              </div>
                              {request.campaign.advertiser.advertiserProfile
                                ?.companyName && (
                                <div className="flex items-center text-sm">
                                  <Briefcase className="h-4 w-4 text-slate-500 mr-2" />
                                  <span className="text-slate-400">
                                    Company:
                                  </span>
                                  <span className="ml-2 font-medium text-white">
                                    {
                                      request.campaign.advertiser
                                        .advertiserProfile.companyName
                                    }
                                  </span>
                                </div>
                              )}
                              {request.campaign.advertiser.advertiserProfile
                                ?.industry && (
                                <div className="flex items-center text-sm">
                                  <Briefcase className="h-4 w-4 text-slate-500 mr-2" />
                                  <span className="text-slate-400">
                                    Industry:
                                  </span>
                                  <span className="ml-2 font-medium text-white">
                                    {
                                      request.campaign.advertiser
                                        .advertiserProfile.industry
                                    }
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Space & Date Info */}
                          <div className="space-y-3">
                            <div className="flex items-start">
                              <MapPin className="h-5 w-5 text-slate-500 mr-3 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-semibold text-white">
                                  {request.space.title}
                                </p>
                                <p className="text-sm text-slate-400">
                                  {request.space.address}, {request.space.city},{" "}
                                  {request.space.state}
                                </p>
                                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-slate-700 text-slate-300 rounded border border-slate-600">
                                  {request.space.type.replace("_", " ")}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <Calendar className="h-5 w-5 text-slate-500 mr-3 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-white">
                                  <span className="font-medium">
                                    {new Date(
                                      request.startDate
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </span>
                                  {" → "}
                                  <span className="font-medium">
                                    {new Date(
                                      request.endDate
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </span>
                                </p>
                                <p className="text-sm text-slate-400">
                                  {request.totalDays} days total
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <DollarSign className="h-5 w-5 text-slate-500 mr-3 mt-0.5 flex-shrink-0" />
                              <div className="text-sm w-full">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-slate-400">
                                    Campaign cost:
                                  </span>
                                  <span className="font-medium text-white">
                                    ${ownerRevenue.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-slate-400">
                                    Platform fee (10%):
                                  </span>
                                  <span className="font-medium text-white">
                                    ${platformFee.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-slate-600">
                                  <span className="text-slate-400">
                                    Daily rate:
                                  </span>
                                  <span className="font-medium text-white">
                                    ${Number(request.pricePerDay).toFixed(2)}
                                    /day
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Advertiser Notes */}
                          {request.advertiserNotes && (
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                              <p className="text-xs font-semibold text-blue-400 mb-1">
                                ADVERTISER NOTES
                              </p>
                              <p className="text-sm text-blue-300">
                                {request.advertiserNotes}
                              </p>
                            </div>
                          )}

                          {/* Rejection Reason */}
                          {request.status === "REJECTED" &&
                            request.ownerNotes && (
                              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                <p className="text-xs font-semibold text-red-400 mb-1">
                                  REJECTION REASON
                                </p>
                                <p className="text-sm text-red-300">
                                  {request.ownerNotes}
                                </p>
                              </div>
                            )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {request.status === "PENDING_APPROVAL" && (
                        <div className="mt-6 flex gap-3 pt-6 border-t border-slate-700">
                          <button
                            onClick={() => handleApprove(request.id)}
                            disabled={approveMutationPending}
                            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-slate-600 disabled:text-slate-400 font-semibold flex items-center justify-center transition-all shadow-lg shadow-green-600/20"
                          >
                            {approveMutationPending ? (
                              <>
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                Approving...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Approve Campaign
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleRejectClick(request.id)}
                            disabled={rejectMutationPending}
                            className="flex-1 bg-slate-700 text-red-400 border-2 border-red-500/20 px-6 py-3 rounded-lg hover:bg-red-500/10 hover:border-red-500/30 disabled:bg-slate-700 disabled:text-slate-500 font-semibold flex items-center justify-center transition-all"
                          >
                            <XCircle className="h-5 w-5 mr-2" />
                            Reject
                          </button>
                        </div>
                      )}

                      {request.status === "APPROVED" && (
                        <div className="mt-6 pt-6 border-t border-slate-700">
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                            <div className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-green-400 mb-1">
                                  Campaign Approved
                                </h4>
                                <p className="text-sm text-green-300 mt-1">
                                  The advertiser has been notified and will
                                  complete payment to confirm the booking.
                                  You'll be notified once payment is received.
                                </p>

                                {/* Installation Window Status - shown for confirmed bookings */}
                                {(() => {
                                  const proofStatus =
                                    getProofSubmissionStatus(request);
                                  if (!proofStatus) return null;

                                  return (
                                    <div
                                      className={`mt-3 px-3 py-2 rounded-lg inline-flex items-center gap-2 ${
                                        proofStatus.variant === "error"
                                          ? "bg-red-500/10 border border-red-500/20"
                                          : proofStatus.variant === "warning"
                                          ? "bg-yellow-500/10 border border-yellow-500/20"
                                          : proofStatus.variant === "success"
                                          ? "bg-green-500/10 border border-green-500/20"
                                          : "bg-blue-500/10 border border-blue-500/20"
                                      }`}
                                    >
                                      <span className="text-lg">
                                        {proofStatus.icon}
                                      </span>
                                      <span
                                        className={`text-sm font-medium ${
                                          proofStatus.variant === "error"
                                            ? "text-red-300"
                                            : proofStatus.variant === "warning"
                                            ? "text-yellow-300"
                                            : proofStatus.variant === "success"
                                            ? "text-green-300"
                                            : "text-blue-300"
                                        }`}
                                      >
                                        {proofStatus.message}
                                      </span>
                                    </div>
                                  );
                                })()}

                                <p className="text-sm text-green-300 mt-2 font-medium">
                                  Next step:{" "}
                                  {request.proofStatus
                                    ? "Wait for advertiser approval"
                                    : "Upload proof photos after campaign goes live"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Image Lightbox for Campaign Creatives */}
      <ImageLightbox
        images={lightboxImageUrl}
        alt={lightboxAlt}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />

      {/* Rejection Modal */}
      {rejectingRequest && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Reject Campaign Request
              </h3>
              <button
                onClick={() => {
                  setRejectingRequest(null);
                  setRejectionReason("");
                }}
                className="text-slate-400 hover:text-white transition-colors rounded-lg p-2 hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-slate-400 mb-4">
              Please provide a reason for rejecting this campaign. The
              advertiser will see this message.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., Content doesn't align with our space guidelines..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 min-h-[100px] text-sm transition-all"
              autoFocus
            />

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => {
                  setRejectingRequest(null);
                  setRejectionReason("");
                }}
                className="flex-1 px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={!rejectionReason.trim() || rejectMutationPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-slate-700 disabled:text-slate-500 font-medium flex items-center justify-center transition-all"
              >
                {rejectMutationPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Rejecting...
                  </>
                ) : (
                  "Confirm Rejection"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
