"use client";

import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  DollarSign,
  Image as ImageIcon,
  User,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { ImageModal } from "./ImageModal";
import { ApproveModal } from "./ApproveModal";
import { RejectModal } from "./RejectModal";
import type { Decimal } from "@prisma/client-runtime-utils";
import Image from "next/image";

interface DisputeCardProps {
  booking: {
    id: string;
    totalAmount: Decimal;
    startDate: Date;
    endDate: Date;
    disputeType: string | null;
    disputeReason: string | null;
    disputedAt: Date | null;
    disputePhotos: string[];
    adminNotes: string | null;
    space: {
      title: string;
      owner: {
        id: string;
        name: string | null;
        email: string;
      };
    };
    campaign: {
      name: string;
      advertiser: {
        id: string;
        name: string | null;
        email: string;
      };
    };
    messages: Array<{
      attachments: string[];
    }>;
  };
  onApprove: (notes: string) => void;
  onReject: (notes: string) => void;
  isProcessing: boolean;
}

export function DisputeCard({
  booking,
  onApprove,
  onReject,
  isProcessing,
}: DisputeCardProps) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [modalTitle, setModalTitle] = useState("");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const proofMessage = booking.messages[0];
  const proofPhotos = proofMessage?.attachments ?? [];
  const disputePhotos = booking.disputePhotos ?? [];

  const openImageModal = (
    images: string[],
    startIndex: number,
    title: string
  ) => {
    setModalImages(images);
    setModalImageIndex(startIndex);
    setModalTitle(title);
    setShowImageModal(true);
  };

  const nextImage = () => {
    setModalImageIndex((prev) => (prev + 1) % modalImages.length);
  };

  const prevImage = () => {
    setModalImageIndex(
      (prev) => (prev - 1 + modalImages.length) % modalImages.length
    );
  };

  const disputeAge = booking.disputedAt
    ? Math.floor(
        (new Date().getTime() - new Date(booking.disputedAt).getTime()) /
          (1000 * 60 * 60)
      )
    : 0;

  const urgencyColor =
    disputeAge > 48
      ? "text-red-400"
      : disputeAge > 24
        ? "text-yellow-400"
        : "text-slate-400";

  return (
    <>
      <div className="rounded-lg border-2 border-red-500/30 bg-slate-800 p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <h3 className="text-xl font-semibold text-white">
                {booking.space.title}
              </h3>
              <span className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400">
                {booking.disputeType?.replace(/_/g, " ")}
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Campaign: {booking.campaign.name}
            </p>
            <p className={`text-xs ${urgencyColor} mt-1`}>
              Filed {disputeAge}h ago{" "}
              {disputeAge > 24 && " • ⚠️ Requires urgent attention"}
            </p>
          </div>
        </div>

        {/* Parties */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-slate-900/50 p-3">
            <p className="mb-1 text-xs text-slate-500">ADVERTISER (Disputed)</p>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-white">
                  {booking.campaign.advertiser.name ?? "No name"}
                </p>
                <p className="text-xs text-slate-400">
                  {booking.campaign.advertiser.email}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-slate-900/50 p-3">
            <p className="mb-1 text-xs text-slate-500">SPACE OWNER</p>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-purple-400" />
              <div>
                <p className="text-sm font-medium text-white">
                  {booking.space.owner.name ?? "No name"}
                </p>
                <p className="text-xs text-slate-400">
                  {booking.space.owner.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dispute Details */}
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 p-4">
          <h4 className="mb-2 text-sm font-semibold text-red-300">
            Reported Issue:
          </h4>
          <p className="text-sm text-slate-300">{booking.disputeReason}</p>
        </div>

        {/* Photos Comparison */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Original Proof Photos */}
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
              <ImageIcon className="h-4 w-4" />
              Installation Photos ({proofPhotos.length})
            </h4>
            {proofPhotos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {proofPhotos.map((url: string, index: number) => (
                  <button
                    key={index}
                    onClick={() =>
                      openImageModal(proofPhotos, index, "Installation Photos")
                    }
                    className="group relative"
                  >
                    <Image
                      src={url}
                      alt={`Proof ${index + 1}`}
                      className="h-24 w-full rounded border border-slate-700 object-cover transition-colors hover:border-blue-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center rounded bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      <ImageIcon className="h-6 w-6 text-white" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dispute Photos */}
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              Issue Photos ({disputePhotos.length})
            </h4>
            {disputePhotos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {disputePhotos.map((url, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      openImageModal(disputePhotos, index, "Issue Photos")
                    }
                    className="group relative"
                  >
                    <Image
                      src={url}
                      alt={`Issue ${index + 1}`}
                      className="h-24 w-full rounded border border-red-700 object-cover transition-colors hover:border-red-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center rounded bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      <ImageIcon className="h-6 w-6 text-white" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Financial Details */}
        <div className="mb-4 rounded-lg bg-slate-900/50 p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-400" />
              <span className="text-slate-400">Amount at Stake:</span>
            </div>
            <span className="text-lg font-bold text-white">
              ${Number(booking.totalAmount).toFixed(2)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-400" />
              <span className="text-slate-400">Duration:</span>
            </div>
            <span className="text-white">
              {format(new Date(booking.startDate), "MMM d")} -{" "}
              {format(new Date(booking.endDate), "MMM d, yyyy")}
            </span>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowApproveModal(true)}
            disabled={isProcessing}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
          >
            <CheckCircle className="h-5 w-5" />
            Approve & Pay Space Owner
          </button>
          <button
            onClick={() => setShowRejectModal(true)}
            disabled={isProcessing}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            <XCircle className="h-5 w-5" />
            Reject & Refund Advertiser
          </button>
        </div>

        {booking.adminNotes && (
          <div className="mt-4 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
            <p className="mb-1 text-xs font-medium text-blue-400">
              Previous Admin Notes:
            </p>
            <p className="text-sm text-slate-300">{booking.adminNotes}</p>
          </div>
        )}
      </div>

      <ImageModal
        isOpen={showImageModal}
        images={modalImages}
        currentIndex={modalImageIndex}
        title={modalTitle}
        onClose={() => setShowImageModal(false)}
        onNext={nextImage}
        onPrev={prevImage}
      />

      <ApproveModal
        isOpen={showApproveModal}
        totalAmount={booking.totalAmount}
        isProcessing={isProcessing}
        onClose={() => setShowApproveModal(false)}
        onConfirm={(notes) => {
          onApprove(notes);
          setShowApproveModal(false);
        }}
      />

      <RejectModal
        isOpen={showRejectModal}
        totalAmount={booking.totalAmount}
        isProcessing={isProcessing}
        onClose={() => setShowRejectModal(false)}
        onConfirm={(notes) => {
          onReject(notes);
          setShowRejectModal(false);
        }}
      />
    </>
  );
}
