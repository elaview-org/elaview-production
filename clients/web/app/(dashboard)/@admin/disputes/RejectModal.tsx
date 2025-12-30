"use client";

import { XCircle } from "lucide-react";
import { useAdminNotes } from "./useAdminNotes";
import type { Decimal } from "@prisma/client-runtime-utils";

interface RejectModalProps {
  isOpen: boolean;
  totalAmount: Decimal;
  isProcessing: boolean;
  onClose: () => void;
  onConfirm: (notes: string) => void;
}

export function RejectModal({
  isOpen,
  totalAmount,
  isProcessing,
  onClose,
  onConfirm,
}: RejectModalProps) {
  const { adminNotes, setAdminNotes, handleConfirm, handleClose } =
    useAdminNotes();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <XCircle className="h-5 w-5 text-red-400" />
          Reject Installation
        </h2>
        <p className="mb-4 text-sm text-slate-300">
          This will refund ${Number(totalAmount).toFixed(2)} to the advertiser
          and mark the dispute as resolved in favor of the advertiser.
        </p>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Admin Notes * (min 10 chars)
          </label>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-red-500"
            placeholder="Explain why this installation was rejected..."
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleClose(onClose)}
            className="flex-1 rounded-lg border border-slate-700 px-4 py-2 text-slate-300 transition-colors hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={() => handleConfirm(onConfirm)}
            disabled={isProcessing || adminNotes.length < 10}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Confirm Rejection"}
          </button>
        </div>
      </div>
    </div>
  );
}
