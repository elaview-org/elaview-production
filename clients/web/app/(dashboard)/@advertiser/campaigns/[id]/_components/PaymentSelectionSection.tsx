// PaymentSelectionSection.tsx
import React from 'react';
import { CreditCard, Info, ChevronDown, ChevronUp, Calendar, MapPin, MessageSquare, X } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { useRouter } from 'next/navigation';

const decimalToNumber = (value: any): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  return Number(value.toString());
};

interface PaymentSelectionSectionProps {
  bookings: any[];
  selectedBookingIds: Set<string>;
  expandedBookings: Set<string>;
  allSelected: boolean;
  onToggleBookingSelection: (bookingId: string) => void;
  onToggleSelectAll: () => void;
  onToggleExpanded: (bookingId: string) => void;
  onDeclineBooking: (bookingId: string) => void;
  selectedPaymentTotal: {
    subtotal: number;
    platformFees: number;
    stripeFees: number;
    total: number;
    count: number;
  };
}

export function PaymentSelectionSection({
  bookings,
  selectedBookingIds,
  expandedBookings,
  allSelected,
  onToggleBookingSelection,
  onToggleSelectAll,
  onToggleExpanded,
  onDeclineBooking,
  selectedPaymentTotal
}: PaymentSelectionSectionProps) {
  const router = useRouter();

  if (bookings.length === 0) return null;

  return (
    <div id="payment-section" className="scroll-mt-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center mb-2">
          <CreditCard className="h-6 w-6 text-blue-400 mr-3" />
          Approved Spaces Ready for Payment
        </h2>
        <p className="text-sm text-slate-400">
          Select which spaces you'd like to activate now. You can pay for others later or decline if your plans changed.
        </p>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
        {/* Select All Header */}
        <div className="p-4 bg-slate-900/50 border-b border-slate-600">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
                className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900 cursor-pointer"
              />
              <span className="text-base font-semibold text-white">
                Select All ({bookings.length} space{bookings.length !== 1 ? 's' : ''})
              </span>
            </label>

            {selectedBookingIds.size > 0 && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-blue-300">{selectedBookingIds.size} selected</div>
                  <div className="text-lg font-bold text-blue-400">
                    ${selectedPaymentTotal.total.toFixed(2)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Booking Cards */}
        <div className="p-4 space-y-3">
          {bookings.map((booking) => {
            const isSelected = selectedBookingIds.has(booking.id);
            const isExpanded = expandedBookings.has(booking.id);
            const daysUntilStart = differenceInDays(new Date(booking.startDate), new Date());
            const isUrgent = daysUntilStart <= 7;

            return (
              <div
                key={booking.id}
                className={`border-2 rounded-lg transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/10'
                    : 'border-slate-600 bg-slate-900/50 hover:border-slate-500'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleBookingSelection(booking.id)}
                      className="mt-1.5 w-5 h-5 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900 cursor-pointer"
                    />

                    {/* Booking Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white text-lg">{booking.space.title}</h4>
                          <p className="text-sm text-slate-400 mt-1">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            {booking.space.address}, {booking.space.city}, {booking.space.state}
                          </p>
                        </div>

                        {isUrgent && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30 whitespace-nowrap">
                            Starts in {daysUntilStart} day{daysUntilStart !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>
                            <Calendar className="h-4 w-4 inline mr-1" />
                            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                          </span>
                          <span className="text-slate-500">•</span>
                          <span>{booking.totalDays} day{booking.totalDays !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-white">
                            ${decimalToNumber(booking.totalAmount).toFixed(2)}
                          </div>
                          <div className="text-xs text-slate-500">
                            + ${decimalToNumber(booking.platformFee).toFixed(2)} platform fee
                          </div>
                          <div className="text-xs text-slate-500">
                            + ${decimalToNumber(booking.stripeFee || 0).toFixed(2)} processing fee
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => onToggleExpanded(booking.id)}
                          className="inline-flex items-center px-3 py-1.5 text-xs border border-slate-600 text-slate-300 rounded hover:bg-slate-700 transition-colors"
                        >
                          <Info className="h-3 w-3 mr-1.5" />
                          {isExpanded ? 'Hide' : 'View'} Details
                          {isExpanded ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                        </button>

                        <button
                          onClick={() => router.push(`/messages/${booking.id}`)}
                          className="inline-flex items-center px-3 py-1.5 text-xs border border-slate-600 text-slate-300 rounded hover:bg-slate-700 transition-colors"
                        >
                          <MessageSquare className="h-3 w-3 mr-1.5" />
                          Message
                        </button>

                        <button
                          onClick={() => onDeclineBooking(booking.id)}
                          className="inline-flex items-center px-3 py-1.5 text-xs border border-red-500/30 text-red-400 rounded hover:bg-red-500/10 transition-colors"
                        >
                          <X className="h-3 w-3 mr-1.5" />
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <div className="text-slate-400 mb-1 text-xs">Space Type</div>
                          <div className="text-white font-medium">{booking.space.type.replace('_', ' ')}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1 text-xs">Daily Rate</div>
                          <div className="text-white font-medium">${decimalToNumber(booking.pricePerDay).toFixed(2)}/day</div>
                        </div>
                        {booking.space.dimensionsText && (
                          <div>
                            <div className="text-slate-400 mb-1 text-xs">Dimensions</div>
                            <div className="text-white font-medium">{booking.space.dimensionsText}</div>
                          </div>
                        )}
                        <div>
                          <div className="text-slate-400 mb-1 text-xs">Payment Type</div>
                          <div className="text-white font-medium">
                            {booking.paymentType === 'DEPOSIT' ? 'Deposit Required' : 'Full Payment'}
                          </div>
                        </div>
                      </div>

                      {booking.space.images && booking.space.images.length > 0 && (
                        <div className="mb-4">
                          <div className="text-slate-400 text-xs mb-2">Space Images</div>
                          <div className="flex gap-2 overflow-x-auto">
                            {booking.space.images.slice(0, 3).map((img: string, idx: number) => (
                              <img
                                key={idx}
                                src={img}
                                alt={`${booking.space.title} ${idx + 1}`}
                                className="w-24 h-24 object-cover rounded-lg border border-slate-700 shrink-0"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-600">
                        <div className="text-xs font-semibold text-slate-400 mb-2">Payment Breakdown</div>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Rental ({booking.totalDays} days × ${decimalToNumber(booking.pricePerDay)})</span>
                            <span className="text-white font-medium">${(decimalToNumber(booking.pricePerDay) * booking.totalDays).toFixed(2)}</span>
                          </div>
                          {(booking.space).installationFee && decimalToNumber((booking.space).installationFee) > 0 && (
                            <div className="flex justify-between">
                              <span className="text-slate-400">Installation Fee</span>
                              <span className="text-white font-medium">${decimalToNumber((booking.space).installationFee).toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between border-t border-slate-700 pt-1.5 mt-1.5">
                            <span className="text-slate-400">Subtotal</span>
                            <span className="text-white font-semibold">${decimalToNumber(booking.totalAmount).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Platform Fee (10% of rental)</span>
                            <span className="text-white font-medium">${decimalToNumber(booking.platformFee).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Processing Fee</span>
                            <span className="text-white font-medium">${decimalToNumber(booking.stripeFee || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between border-t border-slate-700 pt-1.5 mt-1.5">
                            <span className="text-white font-semibold">Total</span>
                            <span className="text-blue-400 font-bold text-base">${(decimalToNumber(booking.totalAmount) + decimalToNumber(booking.platformFee) + decimalToNumber(booking.stripeFee || 0)).toFixed(2)}</span>
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

        {/* Helper Text */}
        {selectedBookingIds.size === 0 && (
          <div className="p-4 bg-blue-500/5 border-t border-blue-500/20">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-300">
                <strong>Tip:</strong> Select the spaces you want to activate now. You can return later to pay for others, or decline bookings if your plans changed.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
