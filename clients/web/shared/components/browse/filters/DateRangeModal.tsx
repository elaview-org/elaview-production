// src/components/browse/DateRangeModal.tsx
"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, DollarSign, Loader2 } from 'lucide-react';
import { DateRangePicker } from '../../ui/DateRangePicker';
import { createPortal } from 'react-dom';

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  minDate?: Date;
  filterDate?: (date: Date) => boolean;
  isLoading?: boolean;
  pricePerDay: number;
  installationFee?: number;
  dateError?: string;
}

export const DateRangeModal: React.FC<DateRangeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minDate,
  filterDate,
  isLoading = false,
  pricePerDay,
  installationFee = 0,
  dateError,
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Calculate costs
  const calculateDuration = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const duration = calculateDuration();
  const rentalCost = duration * pricePerDay;
  const platformFee = (rentalCost + installationFee) * 0.08;
  const total = rentalCost + installationFee + platformFee;

  const hasValidDates = startDate && endDate && !dateError;
  const canConfirm = hasValidDates && duration > 0;

  // Render modal content
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <Calendar className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Select Campaign Dates</h2>
                    <p className="text-xs text-slate-400">Choose your advertising period</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Date Picker */}
                <div>
                  <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={onStartDateChange}
                    onEndDateChange={onEndDateChange}
                    minDate={minDate}
                    filterDate={filterDate}
                    isLoading={isLoading}
                    showLegend={true}
                    preventEndBeforeStart={true}
                  />
                </div>

                {/* Selected Range Display */}
                {startDate && endDate && !dateError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg"
                  >
                    <Calendar className="h-4 w-4 text-blue-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-blue-300">
                        {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {' → '}
                        {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-blue-400 mt-0.5">
                        {duration} {duration === 1 ? 'day' : 'days'} selected
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Error Display */}
                {dateError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20 flex-shrink-0 mt-0.5">
                      <span className="text-xs text-red-400 font-bold">!</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-red-400">Date Selection Error</p>
                      <p className="text-xs text-red-300 mt-0.5">{dateError}</p>
                    </div>
                  </motion.div>
                )}

                {/* Cost Breakdown */}
                {duration > 0 && !dateError && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="h-4 w-4 text-green-400" />
                      <h3 className="text-sm font-bold text-white">Estimated Cost</h3>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">
                          {duration} {duration === 1 ? 'day' : 'days'} × ${pricePerDay.toFixed(0)}
                        </span>
                        <span className="font-semibold text-white">${rentalCost.toFixed(2)}</span>
                      </div>

                      {installationFee > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">Installation fee</span>
                          <span className="font-semibold text-white">${installationFee.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Platform fee (8%)</span>
                        <span className="font-semibold text-white">${platformFee.toFixed(2)}</span>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-700 flex justify-between items-baseline">
                        <span className="text-sm font-bold text-green-400">Total</span>
                        <span className="text-2xl font-bold text-green-400">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 px-6 py-4 flex items-center gap-3 rounded-b-2xl">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={!canConfirm || isLoading}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4" />
                      Confirm Dates
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  // Use portal to render at document root level
  if (typeof window === 'undefined') return null;
  return createPortal(modalContent, document.body);
};