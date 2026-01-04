// BookingsList.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { BookingCard } from './BookingCard';

interface BookingsListProps {
  campaign: {
    id: string;
    status: string;
    bookings: any[];
  };
  bookingsByStatus: {
    processing: any[];
    paid: any[];
    pending: any[];
    rejected: any[];
  };
  proofMessages: Map<string, any>;
}

export function BookingsList({ campaign, bookingsByStatus, proofMessages }: BookingsListProps) {
  const router = useRouter();

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Advertising Spaces</h2>
          {campaign.status === 'DRAFT' && (
            <button
              onClick={() => router.push('/browse')}
              className="inline-flex items-center px-4 py-2 border border-blue-600 rounded-lg text-sm font-medium text-blue-400 hover:bg-blue-600/10 transition-colors"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Add Spaces
            </button>
          )}
        </div>

        {!campaign.bookings || campaign.bookings.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No spaces selected</h3>
            <p className="text-slate-400 mb-4">
              Add advertising spaces to this campaign to get started.
            </p>
            {campaign.status === 'DRAFT' && (
              <button
                onClick={() => router.push('/browse')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Browse Spaces
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Processing Bookings */}
            {bookingsByStatus.processing.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-purple-400 mb-3 flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Payment Processing ({bookingsByStatus.processing.length})
                </h3>
                <div className="space-y-3">
                  {bookingsByStatus.processing.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      campaignId={campaign.id}
                      hasProofPending={proofMessages.has(booking.id)}
                      overrideStatus="PAYMENT_PROCESSING"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Confirmed Bookings */}
            {bookingsByStatus.paid.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-green-400 mb-3 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmed ({bookingsByStatus.paid.length})
                </h3>
                <div className="space-y-3">
                  {bookingsByStatus.paid.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      campaignId={campaign.id}
                      hasProofPending={proofMessages.has(booking.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Pending Bookings */}
            {bookingsByStatus.pending.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-yellow-400 mb-3 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Pending Approval ({bookingsByStatus.pending.length})
                </h3>
                <div className="space-y-3">
                  {bookingsByStatus.pending.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      campaignId={campaign.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Rejected Bookings */}
            {bookingsByStatus.rejected.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-red-400 mb-3 flex items-center">
                  <XCircle className="h-4 w-4 mr-2" />
                  Rejected ({bookingsByStatus.rejected.length})
                </h3>
                <div className="space-y-3">
                  {bookingsByStatus.rejected.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      campaignId={campaign.id}
                      showRejectionReason
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
