// CampaignModals.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { ReportIssueForm } from '../../../../../../../elaview-mvp/src/components/messages/ReportIssueForm';

interface CampaignModalsProps {
  // Report Issue Modal
  reportIssueBookingId: string | null;
  reportIssueBooking: any;
  onReportIssueSuccess: () => void;
  onReportIssueCancel: () => void;

  // Decline Booking Modal
  declineModalBookingId: string | null;
  declineReason: string;
  isDeclineProcessing: boolean;
  onDeclineReasonChange: (reason: string) => void;
  onDeclineConfirm: () => void;
  onDeclineCancel: () => void;

  // Delete Campaign Modal
  showDeleteModal: boolean;
  campaignName: string;
  isDeleteProcessing: boolean;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}

export function CampaignModals({
  reportIssueBookingId,
  reportIssueBooking,
  onReportIssueSuccess,
  onReportIssueCancel,
  declineModalBookingId,
  declineReason,
  isDeclineProcessing,
  onDeclineReasonChange,
  onDeclineConfirm,
  onDeclineCancel,
  showDeleteModal,
  campaignName,
  isDeleteProcessing,
  onDeleteConfirm,
  onDeleteCancel
}: CampaignModalsProps) {
  return (
    <>
      {/* REPORT ISSUE MODAL */}
      {reportIssueBookingId && reportIssueBooking && (
        <ReportIssueForm
          booking={reportIssueBooking}
          onSuccess={onReportIssueSuccess}
          onCancel={onReportIssueCancel}
        />
      )}

      {/* DECLINE BOOKING MODAL */}
      {declineModalBookingId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-orange-400 mr-3" />
              <h2 className="text-xl font-bold text-white">Decline Booking</h2>
            </div>

            <p className="text-slate-400 mb-4">
              Are you sure you want to decline this approved booking? The space owner will be notified.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Reason (optional)
              </label>
              <textarea
                value={declineReason}
                onChange={(e) => onDeclineReasonChange(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="e.g., Budget changed, plans shifted, found different location..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onDeclineCancel}
                className="px-4 py-2 text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onDeclineConfirm}
                disabled={isDeclineProcessing}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
              >
                {isDeclineProcessing ? 'Declining...' : 'Decline Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CAMPAIGN MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-400 mr-3" />
              <h2 className="text-xl font-bold text-white">Delete Campaign</h2>
            </div>
            <p className="text-slate-400 mb-6">
              Are you sure you want to delete "{campaignName}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onDeleteCancel}
                className="px-4 py-2 text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onDeleteConfirm}
                disabled={isDeleteProcessing}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isDeleteProcessing ? 'Deleting...' : 'Delete Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
