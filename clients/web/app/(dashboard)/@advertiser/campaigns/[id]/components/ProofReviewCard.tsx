// ProofReviewCard.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, MapPin, Check, AlertTriangle, Eye } from 'lucide-react';
import { addHours, differenceInHours, differenceInMinutes } from 'date-fns';
import { ProofCard } from '../../../../../../../elaview-mvp/src/components/messages/ProofCard';

// Hook to calculate time remaining until auto-approval
function useAutoApprovalCountdown(proofUploadedAt: Date | null) {
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    if (!proofUploadedAt) return;

    const updateCountdown = () => {
      const AUTO_APPROVE_HOURS = 48;
      const now = new Date();
      const approvalDeadline = addHours(new Date(proofUploadedAt), AUTO_APPROVE_HOURS);
      const hoursLeft = differenceInHours(approvalDeadline, now);
      const minutesLeft = differenceInMinutes(approvalDeadline, now) % 60;

      if (hoursLeft < 0) {
        setTimeRemaining('Auto-approved');
        setIsUrgent(false);
        return;
      }

      setIsUrgent(hoursLeft < 12);

      if (hoursLeft < 1) {
        setTimeRemaining(`${minutesLeft} minutes`);
      } else if (hoursLeft < 24) {
        setTimeRemaining(`${hoursLeft} hours, ${minutesLeft} min`);
      } else {
        setTimeRemaining(`${Math.floor(hoursLeft / 24)} days, ${hoursLeft % 24} hours`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [proofUploadedAt]);

  return { timeRemaining, isUrgent };
}

interface ProofReviewCardProps {
  booking: any;
  proofMessage: any;
  onExpand: () => void;
  onReportIssue: () => void;
  isExpanded: boolean;
}

export function ProofReviewCard({
  booking,
  proofMessage,
  onExpand,
  onReportIssue,
  isExpanded
}: ProofReviewCardProps) {
  const router = useRouter();
  const { timeRemaining, isUrgent } = useAutoApprovalCountdown(proofMessage.createdAt);

  return (
    <div className="bg-slate-900/50 border-2 border-amber-500/30 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      {/* Large Image Preview */}
      <div className="aspect-video bg-slate-800 relative group">
        <img
          src={proofMessage.attachments[0]}
          alt="Installation proof"
          className="w-full h-full object-cover"
        />
        {/* Countdown Badge */}
        {timeRemaining && (
          <div className={`absolute top-3 right-3 px-3 py-1.5 backdrop-blur rounded-full ${
            isUrgent ? 'bg-red-600/90 animate-pulse' : 'bg-black/80'
          }`}>
            <Clock className={`h-4 w-4 inline mr-1.5 ${isUrgent ? 'text-white' : 'text-amber-400'}`} />
            <span className="text-sm font-semibold text-white">{timeRemaining}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h4 className="font-semibold text-white text-lg mb-1">{booking.space.title}</h4>
        <p className="text-sm text-slate-400 mb-4">
          <MapPin className="h-3 w-3 inline mr-1" />
          {booking.space.city}, {booking.space.state}
        </p>

        {/* Quick Actions */}
        <div className="space-y-2 mb-2">
          {/* PRIMARY: Approve */}
          <button
            onClick={() => router.push(`/messages/${booking.id}?action=approve-proof`)}
            className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
          >
            <Check className="h-5 w-5" />
            Approve Installation
          </button>

          {/* SECONDARY: Report Issue */}
          <button
            onClick={onReportIssue}
            className="w-full px-4 py-2 border-2 border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/50 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Report Issue to Support
          </button>
        </div>

        <button
          onClick={onExpand}
          className="w-full px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 text-sm transition-colors"
        >
          <Eye className="h-4 w-4 inline mr-1.5" />
          {isExpanded ? 'Hide' : 'View'} Full Details
        </button>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-800">
            <ProofCard
              message={proofMessage}
              booking={{
                id: booking.id,
                totalAmount: Number(booking.totalAmount),
                spaceOwnerAmount: Number(booking.spaceOwnerAmount),
                pricePerDay: Number(booking.pricePerDay),
                totalDays: booking.totalDays,
                proofUploadedAt: booking.proofUploadedAt,
                space: {
                  title: booking.space.title,
                  installationFee: booking.space.installationFee ? Number(booking.space.installationFee) : null,
                }
              }}
              isAdvertiser={true}
              isOwnMessage={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
