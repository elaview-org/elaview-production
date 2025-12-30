// ProofReviewSection.tsx
import React from 'react';
import { Camera, Clock } from 'lucide-react';
import { ProofReviewCard } from './ProofReviewCard';

interface ProofReviewSectionProps {
  bookings: any[];
  proofMessages: Map<string, any>;
  expandedProofBookingId: string | null;
  onExpandProof: (bookingId: string | null) => void;
  onReportIssue: (bookingId: string) => void;
}

export function ProofReviewSection({
  bookings,
  proofMessages,
  expandedProofBookingId,
  onExpandProof,
  onReportIssue
}: ProofReviewSectionProps) {
  if (bookings.length === 0) return null;

  return (
    <div id="proof-review-section" className="scroll-mt-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Camera className="h-6 w-6 text-amber-400 mr-3" />
            Installation Proof Review
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Space owners have submitted proof of installation. Review and approve to release payment.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/30">
          <Clock className="h-4 w-4 text-amber-300" />
          <span className="text-sm font-medium text-amber-200">
            Auto-approves in 48 hours
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookings.map((booking) => {
          const proofMessage = proofMessages.get(booking.id);
          if (!proofMessage) return null;

          return (
            <ProofReviewCard
              key={booking.id}
              booking={booking}
              proofMessage={proofMessage}
              isExpanded={expandedProofBookingId === booking.id}
              onExpand={() => onExpandProof(
                expandedProofBookingId === booking.id ? null : booking.id
              )}
              onReportIssue={() => onReportIssue(booking.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
