// PaymentSummaryFooter.tsx
import React from 'react';
import { X, CreditCard, Loader2 } from 'lucide-react';

interface PaymentSummaryFooterProps {
  selectedBookingIds: Set<string>;
  selectedPaymentTotal: {
    subtotal: number;
    platformFees: number;
    stripeFees: number;
    total: number;
    count: number;
  };
  isProcessing: boolean;
  onClearSelection: () => void;
  onPaySelected: () => void;
}

export function PaymentSummaryFooter({
  selectedBookingIds,
  selectedPaymentTotal,
  isProcessing,
  onClearSelection,
  onPaySelected
}: PaymentSummaryFooterProps) {
  if (selectedBookingIds.size === 0) return null;

  return (
    <div className="flex-shrink-0 border-t border-slate-700 bg-slate-900 p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-white text-lg">Payment Summary</h4>
        <button
          onClick={onClearSelection}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-400">
            <span>{selectedPaymentTotal.count} space{selectedPaymentTotal.count !== 1 ? 's' : ''}</span>
            <span>${selectedPaymentTotal.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Platform fees</span>
            <span>${selectedPaymentTotal.platformFees.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Processing fees</span>
            <span>${selectedPaymentTotal.stripeFees.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-white text-base border-t border-slate-700 pt-2">
            <span>Total</span>
            <span className="text-blue-400">${selectedPaymentTotal.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col justify-end">
          <button
            onClick={onPaySelected}
            disabled={isProcessing}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-blue-600/30"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5 inline mr-2" />
                Pay ${selectedPaymentTotal.total.toFixed(2)}
              </>
            )}
          </button>

          <p className="text-xs text-center text-slate-500 mt-2">
            🔒 Secure payment via Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
