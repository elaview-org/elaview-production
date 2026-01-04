// src/components/ui/DatePickerModal.tsx
"use client";

import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import { X, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (start: Date | null, end: Date | null) => void;
  minDate?: Date;
  filterDate?: (date: Date) => boolean;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isOpen,
  onClose,
  startDate,
  endDate,
  onDateChange,
  minDate,
  filterDate,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Handle range selection
  const handleChange = useCallback((dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    onDateChange(start, end);
    
    // Auto-close when both dates selected
    if (start && end) {
      setTimeout(() => onClose(), 300);
    }
  }, [onDateChange, onClose]);

  // Custom header
  const CustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: any) => (
    <div className="flex items-center justify-between px-4 py-3 bg-slate-800 rounded-t-lg border-b border-slate-600">
      <button
        type="button"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="p-2 rounded-lg hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="h-5 w-5 text-slate-200" />
      </button>
      
      <span className="text-lg font-semibold text-white">
        {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </span>
      
      <button
        type="button"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className="p-2 rounded-lg hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="h-5 w-5 text-slate-200" />
      </button>
    </div>
  );

  // Day content renderer
  const renderDayContents = useCallback((day: number, date: Date) => {
    const isUnavailable = filterDate ? !filterDate(date) : false;
    const isToday = date.toDateString() === today.toDateString();

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span className={isUnavailable ? 'line-through opacity-50' : ''}>{day}</span>
        {isUnavailable && (
          <div className="absolute bottom-1 w-1.5 h-1.5 bg-red-400 rounded-full" />
        )}
      </div>
    );
  }, [filterDate, today]);

  // Day className
  const getDayClassName = useCallback((date: Date) => {
    const baseClasses = 'relative text-sm font-semibold rounded-lg transition-all duration-200';
    const isUnavailable = filterDate ? !filterDate(date) : false;
    const isToday = date.toDateString() === today.toDateString();
    
    const classes = [baseClasses];
    
    if (isUnavailable) {
      classes.push('text-slate-600 bg-slate-900/50 cursor-not-allowed opacity-40');
    } else {
      classes.push('text-white bg-slate-700 hover:bg-slate-600 hover:scale-105 cursor-pointer shadow-sm hover:shadow-md');
    }
    
    if (isToday && !isUnavailable) {
      classes.push('ring-2 ring-blue-400 ring-inset');
    }
    
    return classes.join(' ');
  }, [filterDate, today]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="bg-slate-900 rounded-lg shadow-2xl border border-slate-600 overflow-hidden max-w-md w-full">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Select Campaign Dates</h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <X className="h-5 w-5 text-slate-300" />
                </button>
              </div>

              {/* Calendar */}
              <div className="p-4">
                <DatePicker
                  selected={startDate}
                  onChange={handleChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  inline
                  minDate={minDate}
                  filterDate={filterDate}
                  renderCustomHeader={CustomHeader}
                  renderDayContents={renderDayContents}
                  dayClassName={getDayClassName}
                  calendarClassName="!bg-slate-900 !border-0"
                />
              </div>

              {/* Footer with legend */}
              <div className="flex gap-4 px-4 py-3 bg-slate-800 border-t border-slate-600 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-blue-400/50" />
                  <span className="text-slate-200 font-medium">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="text-slate-200 font-medium">Booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-blue-400 bg-transparent" />
                  <span className="text-slate-200 font-medium">Today</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Global Styles */}
          <style jsx global>{`
            .react-datepicker {
              font-family: inherit !important;
              background-color: #1e293b !important;
              border: none !important;
              border-radius: 0 !important;
              padding: 0 !important;
            }

            .react-datepicker__header {
              background-color: transparent !important;
              border-bottom: none !important;
              padding: 0 !important;
            }

            .react-datepicker__current-month {
              display: none !important;
            }

            .react-datepicker__day-names {
              display: flex !important;
              justify-content: space-around !important;
              padding: 0.75rem !important;
              background-color: #334155 !important;
              border-bottom: 1px solid #475569 !important;
            }

            .react-datepicker__day-name {
              color: #cbd5e1 !important;
              font-size: 0.75rem !important;
              font-weight: 700 !important;
              text-transform: uppercase !important;
              letter-spacing: 0.05em !important;
              width: 2.75rem !important;
              line-height: 2.75rem !important;
              margin: 0 !important;
            }

            .react-datepicker__month {
              margin: 0.75rem !important;
              padding: 0 !important;
            }

            .react-datepicker__week {
              display: flex !important;
              justify-content: space-around !important;
              margin-bottom: 0.25rem !important;
            }

            .react-datepicker__day {
              width: 2.75rem !important;
              height: 2.75rem !important;
              line-height: 2.75rem !important;
              margin: 0.125rem !important;
              border-radius: 0.5rem !important;
              color: #ffffff !important;
              font-weight: 600 !important;
            }

            .react-datepicker__day--disabled {
              color: #64748b !important;
              opacity: 0.4 !important;
            }

            .react-datepicker__day:hover:not(.react-datepicker__day--disabled) {
              color: #ffffff !important;
            }

            .react-datepicker__day--selected,
            .react-datepicker__day--keyboard-selected {
              background-color: #3b82f6 !important;
              color: #ffffff !important;
              font-weight: 700 !important;
              box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3) !important;
              transform: scale(1.05) !important;
            }

            .react-datepicker__day--selected:hover {
              background-color: #2563eb !important;
              transform: scale(1.08) !important;
            }

            .react-datepicker__day--in-range {
              background-color: rgba(59, 130, 246, 0.2) !important;
              color: #bfdbfe !important;
            }

            .react-datepicker__day--range-start,
            .react-datepicker__day--range-end {
              background-color: #3b82f6 !important;
              color: #ffffff !important;
              font-weight: 700 !important;
              box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3) !important;
            }

            .react-datepicker__day--outside-month {
              color: #94a3b8 !important;
              opacity: 0.35 !important;
              pointer-events: none !important;
            }

            .react-datepicker__navigation {
              display: none !important;
            }

            .react-datepicker__month-container {
              float: none !important;
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
};