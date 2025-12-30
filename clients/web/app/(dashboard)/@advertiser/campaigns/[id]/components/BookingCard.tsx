// BookingCard.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, DollarSign, Camera, MessageSquare } from 'lucide-react';

const decimalToNumber = (value: any): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  return Number(value.toString());
};

const BOOKING_STATUS_CONFIG = {
  PENDING_APPROVAL: {
    label: 'Pending Approval',
    color: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    description: 'Waiting for space owner review'
  },
  APPROVED: {
    label: 'Approved - Ready to Pay',
    color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    description: 'Select spaces to activate'
  },
  PAYMENT_PROCESSING: {
    label: 'Payment Processing',
    color: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    description: 'Payment received, confirming booking...'
  },
  CONFIRMED: {
    label: 'Payment Confirmed',
    color: 'bg-green-500/10 text-green-400 border border-green-500/20',
    description: 'Payment received, awaiting campaign start'
  },
  PENDING_BALANCE: {
    label: 'Balance Due Soon',
    color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    description: 'Deposit paid, balance will be charged before start date'
  },
  ACTIVE: {
    label: 'Active',
    color: 'bg-green-500/10 text-green-400 border border-green-500/20',
    description: 'Campaign is live'
  },
  COMPLETED: {
    label: 'Completed',
    color: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
    description: 'Campaign finished'
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-red-500/10 text-red-400 border border-red-500/20',
    description: 'Booking cancelled'
  },
  REJECTED: {
    label: 'Rejected',
    color: 'bg-red-500/10 text-red-400 border border-red-500/20',
    description: 'Space owner rejected request'
  },
  DISPUTED: {
    label: 'Under Review',
    color: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    description: 'Admin reviewing dispute'
  }
} as const;

interface BookingCardProps {
  booking: any;
  campaignId: string;
  showRejectionReason?: boolean;
  hasProofPending?: boolean;
  overrideStatus?: string;
}

export function BookingCard({
  booking,
  campaignId,
  showRejectionReason,
  hasProofPending,
  overrideStatus
}: BookingCardProps) {
  const router = useRouter();
  const displayStatus = overrideStatus || booking.status;
  const statusConfig = BOOKING_STATUS_CONFIG[displayStatus as keyof typeof BOOKING_STATUS_CONFIG];

  const canMessage = ['APPROVED', 'CONFIRMED', 'PENDING_BALANCE', 'ACTIVE', 'COMPLETED'].includes(booking.status);

  return (
    <div className="border border-slate-600 rounded-lg p-4 bg-slate-900/50 hover:bg-slate-900/70 hover:border-slate-500 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white">{booking.space.title}</h3>
            {hasProofPending && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Camera className="h-3 w-3 mr-1" />
                Proof Ready
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400">
            <MapPin className="h-3 w-3 inline mr-1" />
            {booking.space.address}, {booking.space.city}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canMessage && (
            <button
              onClick={() => router.push(`/messages/${booking.id}`)}
              className="inline-flex items-center px-2 py-1 text-xs border border-slate-600 text-slate-300 rounded hover:bg-slate-700 transition-colors"
              title="Message space owner"
            >
              <MessageSquare className="h-3 w-3" />
            </button>
          )}
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig?.color || 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
            {statusConfig?.label || displayStatus}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4 text-sm text-slate-400 mt-3">
        <span>
          <Calendar className="h-4 w-4 inline mr-1" />
          {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
        </span>
        <span>
          <DollarSign className="h-4 w-4 inline mr-1" />
          ${decimalToNumber(booking.totalAmount).toFixed(2)}
        </span>
      </div>

      {showRejectionReason && booking.ownerNotes && (
        <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-400">
          <strong>Rejection reason:</strong> {booking.ownerNotes}
        </div>
      )}

      {statusConfig?.description && (
        <p className="text-xs text-slate-500 mt-2">{statusConfig.description}</p>
      )}
    </div>
  );
}
