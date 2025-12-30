// PaymentBanners.tsx
import React from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';

interface PaymentBannersProps {
  showPaymentSuccess: boolean;
  isPolling: boolean;
  processingCount: number;
}

export function PaymentBanners({ showPaymentSuccess, isPolling, processingCount }: PaymentBannersProps) {
  if (!showPaymentSuccess && processingCount === 0) return null;

  return (
    <>
      {/* Payment Success Banner */}
      {showPaymentSuccess && (
        <div className="bg-green-500/10 border-2 border-green-500/30 rounded-lg p-4 shadow-lg">
          <div className="flex items-start">
            <CheckCircle className="h-6 w-6 text-green-400 mt-0.5 mr-3 shrink-0" />
            <div className="flex-1">
              <h3 className="text-base font-semibold text-green-400">Payment Received!</h3>
              <p className="text-sm text-green-300 mt-1">
                {isPolling
                  ? "Confirming your booking... This may take a few seconds."
                  : "Your campaign bookings are now confirmed!"}
              </p>
            </div>
            {isPolling && (
              <Loader2 className="h-5 w-5 text-green-400 animate-spin ml-2" />
            )}
          </div>
        </div>
      )}

      {/* Processing Payment Banner */}
      {processingCount > 0 && !showPaymentSuccess && (
        <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-lg p-4 shadow-lg">
          <div className="flex items-start">
            <Loader2 className="h-6 w-6 text-purple-400 animate-spin mt-0.5 mr-3 shrink-0" />
            <div className="flex-1">
              <h3 className="text-base font-semibold text-purple-400">Payment Processing</h3>
              <p className="text-sm text-purple-300 mt-1">
                We're confirming your payment for {processingCount} space{processingCount !== 1 ? 's' : ''}.
                This usually takes less than a minute.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
