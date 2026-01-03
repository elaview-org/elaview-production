// src/components/messages/ProofCard.tsx
"use client";

import { useState, useEffect } from "react";
import { format, differenceInHours, differenceInMinutes } from "date-fns";
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  Image as ImageIcon,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  DollarSign,
  Zap,
} from "lucide-react";
// import { toast } from "sonner";
import { ReportIssueForm } from "./ReportIssueForm";
import useMessagesApproveProof from "@/shared/hooks/api/actions/useMessagesApproveProof/useMessagesApproveProof";

interface ProofCardMessage {
  id: string;
  bookingId: string | null;
  content: string;
  attachments: string[];
  createdAt: Date;
  messageType: string;
  proofStatus: string | null;
  proofApprovedAt: Date | null;
  proofApprovedBy: string | null;
  autoApprovedAt: Date | null;
  disputeReason: string | null;
  sender: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface ProofCardProps {
  message: ProofCardMessage;
  booking: {
    id: string;
    totalAmount: number;
    spaceOwnerAmount: number;
    pricePerDay: number;
    totalDays: number;
    proofUploadedAt?: Date | null;
    space: {
      title: string;
      installationFee: number | null;
    };
  };
  isAdvertiser: boolean;
  isOwnMessage: boolean;
}

export function ProofCard({
  message,
  booking,
  isAdvertiser,
  isOwnMessage,
}: ProofCardProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [showReportIssueForm, setShowReportIssueForm] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [urgency, setUrgency] = useState<"normal" | "warning" | "critical">(
    "normal"
  );

  const { approveProof, isPending:approveProofPending } = useMessagesApproveProof();

  const handleApprove = async () => {
    if (!message.bookingId) return;

    // await approveProofMutation.mutateAsync({
    //   messageId: message.id,
    //   bookingId: message.bookingId,
    // });
    await approveProof({ messageId: message.id, bookingId: message.bookingId });
  };

  const photos = message.attachments || [];
  const isPending = message.proofStatus === "PENDING";
  const isApproved = message.proofStatus === "APPROVED";
  const isDisputed =
    message.proofStatus === "DISPUTED" ||
    message.proofStatus === "UNDER_REVIEW";

  // Check if this was auto-approved
  const wasAutoApproved = isApproved && !message.proofApprovedBy;

  // Calculate payment breakdown
  const installationFee = Number(booking.space.installationFee ?? 0);
  const totalRental = Number(booking.pricePerDay) * booking.totalDays;

  // Payment schedule logic (matching backend)
  let firstRentalPayout: number;
  if (booking.totalDays <= 7) {
    firstRentalPayout = totalRental * 0.7;
  } else if (booking.totalDays <= 30) {
    firstRentalPayout = totalRental * 0.5;
  } else {
    firstRentalPayout = totalRental * 0.4;
  }

  const totalPayout = installationFee + firstRentalPayout;

  // Auto-approval countdown timer (48 hours)
  const proofUploadDate = booking.proofUploadedAt
    ? new Date(booking.proofUploadedAt)
    : null;

  useEffect(() => {
    if (!isPending || !proofUploadDate) return;

    const updateTimer = () => {
      const now = new Date();
      const uploadTime = new Date(proofUploadDate);
      const autoApprovalTime = new Date(
        uploadTime.getTime() + 48 * 60 * 60 * 1000
      );

      const minutesRemaining = differenceInMinutes(autoApprovalTime, now);

      if (minutesRemaining <= 0) {
        setTimeRemaining("Auto-approval in progress...");
        setUrgency("normal");
      } else {
        const hours = Math.floor(minutesRemaining / 60);
        const minutes = minutesRemaining % 60;

        // Set urgency level
        if (hours < 6) {
          setUrgency("critical");
        } else if (hours < 24) {
          setUrgency("warning");
        } else {
          setUrgency("normal");
        }

        if (hours > 0) {
          setTimeRemaining(`Auto-approves in ${hours}h ${minutes}m`);
        } else {
          setTimeRemaining(`Auto-approves in ${minutes} minutes`);
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [isPending, proofUploadDate]);

  return (
    <>
      <div
        className={`max-w-2xl rounded-xl border-2 shadow-xl ${
          isPending
            ? "border-yellow-500/50 bg-yellow-500/5"
            : isApproved
            ? "border-green-500/50 bg-green-500/5"
            : isDisputed
            ? "border-red-500/50 bg-red-500/5"
            : "border-slate-700 bg-slate-800/50"
        } p-4`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <ImageIcon
              className={`h-5 w-5 ${
                isPending
                  ? "text-yellow-400"
                  : isApproved
                  ? "text-green-400"
                  : isDisputed
                  ? "text-red-400"
                  : "text-slate-400"
              }`}
            />
            <div>
              <h3 className="font-semibold text-white">Installation Proof</h3>
              <p className="text-xs text-slate-400">{booking.space.title}</p>
            </div>
          </div>

          <div
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border ${
              isPending
                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                : isApproved
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : isDisputed
                ? "bg-red-500/10 text-red-400 border-red-500/20"
                : "bg-slate-500/10 text-slate-400 border-slate-500/20"
            }`}
          >
            {isPending && <Clock className="h-3 w-3" />}
            {isApproved &&
              (wasAutoApproved ? (
                <Zap className="h-3 w-3" />
              ) : (
                <CheckCircle className="h-3 w-3" />
              ))}
            {isDisputed && <AlertTriangle className="h-3 w-3" />}
            <span>
              {isPending && "Pending Review"}
              {isApproved && (wasAutoApproved ? "Auto-Approved" : "Approved")}
              {isDisputed && "Under Review"}
            </span>
          </div>
        </div>

        {message.content &&
          message.content !== "📸 Installation proof submitted" && (
            <p className="text-sm text-slate-300 mb-3">{message.content}</p>
          )}

        {/* Photo Grid */}
        {photos.length > 0 && (
          <div
            className={`grid gap-2 mb-3 ${
              photos.length === 1
                ? "grid-cols-1"
                : photos.length === 2
                ? "grid-cols-2"
                : "grid-cols-3"
            }`}
          >
            {photos.map((url, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className="overflow-hidden rounded-lg border border-slate-700 hover:border-blue-500 transition-colors group"
              >
                <img
                  src={url}
                  alt={`Proof ${index + 1}`}
                  className="h-32 w-full object-cover group-hover:scale-105 transition-transform"
                />
              </button>
            ))}
          </div>
        )}

        {/* ADVERTISER VIEW - PENDING PROOF */}
        {isAdvertiser && isPending && !showReportIssueForm && (
          <div className="space-y-3">
            {/* Auto-approval countdown */}
            {timeRemaining && (
              <div
                className={`pt-3 border-t ${
                  urgency === "critical"
                    ? "border-red-500/30 bg-red-500/5"
                    : urgency === "warning"
                    ? "border-yellow-500/30 bg-yellow-500/5"
                    : "border-yellow-500/20"
                } rounded-lg p-3`}
              >
                <div className="flex items-center justify-between">
                  <p
                    className={`text-sm font-medium flex items-center gap-2 ${
                      urgency === "critical"
                        ? "text-red-400"
                        : urgency === "warning"
                        ? "text-yellow-400"
                        : "text-yellow-400"
                    }`}
                  >
                    <Clock
                      className={`h-4 w-4 ${
                        urgency === "critical" ? "animate-pulse" : ""
                      }`}
                    />
                    {timeRemaining}
                  </p>
                  {urgency === "critical" && (
                    <span className="text-xs text-red-400 animate-pulse">
                      ⚠️ Review soon!
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Installation will be automatically approved if not reviewed
                </p>
              </div>
            )}

            {/* Payment Breakdown */}
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-blue-400" />
                <h4 className="text-sm font-semibold text-white">
                  Payment on Approval
                </h4>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Installation Fee:</span>
                  <span className="font-mono">
                    ${installationFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>
                    First Rental Payout (
                    {booking.totalDays <= 7
                      ? "70%"
                      : booking.totalDays <= 30
                      ? "50%"
                      : "40%"}
                    ):
                  </span>
                  <span className="font-mono">
                    ${firstRentalPayout.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-white font-semibold pt-1 border-t border-slate-700">
                  <span>Total to Space Owner:</span>
                  <span className="font-mono">${totalPayout.toFixed(2)}</span>
                </div>
              </div>
              {booking.totalDays > 7 && (
                <p className="text-xs text-slate-400 mt-2">
                  Remaining balance paid in checkpoints{" "}
                  {booking.totalDays > 30 ? "every 30 days" : "on completion"}
                </p>
              )}
            </div>

            {/* Primary Actions */}
            <div className="flex flex-col gap-2 pt-3 border-t border-yellow-500/20">
              {/* PRIMARY: Approve Proof (Green, Large) */}
              <button
                onClick={handleApprove}
                disabled={approveProofPending}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-base font-semibold text-white hover:bg-green-700 transition-all shadow-lg disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
              >
                {approveProofPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Approve & Release ${totalPayout.toFixed(2)}
                  </>
                )}
              </button>

              {/* SECONDARY: Report Issue */}
              <button
                onClick={() => setShowReportIssueForm(true)}
                disabled={approveProofPending}
                className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-orange-500/30 bg-slate-800 px-4 py-2 text-sm font-medium text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/50 transition-all disabled:opacity-50"
              >
                <AlertTriangle className="h-4 w-4" />
                Report Issue to Support
              </button>

              {/* Help text */}
              <p className="text-xs text-center text-slate-400 mt-2">
                Have questions? Email{" "}
                <a
                  href="mailto:support@elaview.com"
                  className="text-blue-400 hover:underline"
                >
                  support@elaview.com
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Report Issue Form */}
        {isAdvertiser &&
          isPending &&
          showReportIssueForm &&
          message.bookingId && (
            <ReportIssueForm
              booking={booking}
              onSuccess={() => setShowReportIssueForm(false)}
              onCancel={() => setShowReportIssueForm(false)}
            />
          )}

        {/* APPROVED STATE */}
        {isApproved && (
          <div className="pt-3 border-t border-green-500/20 space-y-2">
            <div className="flex items-start gap-2">
              {wasAutoApproved ? (
                <Zap className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-green-300">
                  {wasAutoApproved
                    ? "Automatically approved after advertiser review period"
                    : `Approved by advertiser on ${format(
                        new Date(message.proofApprovedAt!),
                        "MMM d, h:mm a"
                      )}`}
                </p>
                {!isOwnMessage && (
                  <div className="mt-2 bg-green-500/10 rounded-lg p-2 border border-green-500/20">
                    <p className="text-xs font-semibold text-green-400 mb-1">
                      💰 Payment Processed
                    </p>
                    <div className="space-y-0.5 text-xs text-green-300">
                      <div className="flex justify-between">
                        <span>Installation Fee:</span>
                        <span className="font-mono">
                          ${installationFee.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>First Rental Payout:</span>
                        <span className="font-mono">
                          ${firstRentalPayout.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold pt-0.5 border-t border-green-500/20">
                        <span>Total Sent:</span>
                        <span className="font-mono">
                          ${totalPayout.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-green-400/70 mt-1">
                      Funds arrive in 2-7 business days
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DISPUTED STATE */}
        {isDisputed && (
          <div className="pt-3 border-t border-red-500/20">
            <div className="flex items-start gap-2 bg-red-500/10 rounded-lg p-3 border border-red-500/20">
              <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-300">
                  Under Admin Review
                </p>
                <p className="text-xs text-red-400 mt-1">
                  Our support team is reviewing this installation. You'll
                  receive a decision within 24-48 hours.
                </p>
                {message.disputeReason && (
                  <p className="text-xs text-slate-400 mt-2">
                    Issue: {message.disputeReason}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-slate-500 mt-2">
          {format(new Date(message.createdAt), "MMM d, yyyy 'at' h:mm a")}
        </p>
      </div>

      {/* Image Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 rounded-full bg-slate-800/50 p-2 text-white hover:bg-slate-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {selectedImage > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(selectedImage - 1);
              }}
              className="absolute left-4 rounded-full bg-slate-800/50 p-2 text-white hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          <img
            src={photos[selectedImage]}
            alt={`Proof ${selectedImage + 1}`}
            className="max-h-full max-w-full rounded-xl border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          />

          {selectedImage < photos.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(selectedImage + 1);
              }}
              className="absolute right-4 rounded-full bg-slate-800/50 p-2 text-white hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-slate-900/80 px-4 py-2 text-sm text-white">
            {selectedImage + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}
