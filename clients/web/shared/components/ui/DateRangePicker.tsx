// src/components/ui/DateRangePicker.tsx
"use client";

import React, { useState, useCallback, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import { Calendar, ChevronLeft, ChevronRight, Info, Loader2 } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  minDate?: Date;
  filterDate?: (date: Date) => boolean;
  disabled?: boolean;
  isLoading?: boolean;
  showLegend?: boolean;
  className?: string;
  preventEndBeforeStart?: boolean;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minDate,
  filterDate,
  disabled = false,
  isLoading = false,
  showLegend = true,
  className = '',
  preventEndBeforeStart = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Cache today's date calculation
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  // Unified date range handler
  const handleDateRangeChange = useCallback((dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    
    console.log('📅 DateRangePicker: Range selection', { 
      start: start?.toISOString(), 
      end: end?.toISOString() 
    });
    
    // Update start date
    onStartDateChange(start);
    
    // Handle end date with validation
    if (preventEndBeforeStart && end && start && end < start) {
      console.log('⚠️ DateRangePicker: End date before start date prevented');
      return;
    }
    
    onEndDateChange(end);
    
    // Auto-close calendar when both dates are selected
    if (start && end) {
      console.log('✅ DateRangePicker: Range complete, closing calendar');
      setTimeout(() => setIsOpen(false), 200);
    }
  }, [preventEndBeforeStart, onStartDateChange, onEndDateChange]);

  // Custom header component
  const CustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: any) => (
    <div className="flex items-center justify-between px-4 py-3 bg-slate-800 rounded-t-lg border-b border-slate-700">
      <button
        type="button"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="p-2 rounded-lg hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous month"
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
        aria-label="Next month"
      >
        <ChevronRight className="h-5 w-5 text-slate-200" />
      </button>
    </div>
  );

  // Memoized day content renderer
  const renderDayContents = useCallback((day: number, date: Date) => {
    const isUnavailable = filterDate ? !filterDate(date) : false;
    const isToday = date.toDateString() === today.toDateString();

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span className={isUnavailable ? 'line-through opacity-50' : ''}>{day}</span>
        {/* Red dot for unavailable dates */}
        {isUnavailable && (
          <div className="absolute bottom-1 w-1.5 h-1.5 bg-red-400 rounded-full" />
        )}
        {/* Screen reader text */}
        <span className="sr-only">
          {isToday && ', today'}
          {isUnavailable && ', unavailable'}
        </span>
      </div>
    );
  }, [filterDate, today]);

  // Memoized day className generator with MUCH better contrast
  const getDayClassName = useCallback((date: Date) => {
    const baseClasses = 'relative text-sm font-semibold rounded-lg transition-all duration-200';
    const isUnavailable = filterDate ? !filterDate(date) : false;
    const isToday = date.toDateString() === today.toDateString();
    
    // Build classes array
    const classes = [baseClasses];
    
    if (isUnavailable) {
      // Unavailable: clearly disabled with low opacity and dark appearance
      classes.push('text-slate-600 bg-slate-900/50 cursor-not-allowed opacity-40');
    } else {
      // Available: bright, readable text with clear hover state
      classes.push('text-white bg-slate-700 hover:bg-slate-600 hover:scale-105 cursor-pointer shadow-sm hover:shadow-md');
    }
    
    if (isToday && !isUnavailable) {
      // Today: bright blue ring for visibility
      classes.push('ring-2 ring-blue-400 ring-inset');
    }
    
    return classes.join(' ');
  }, [filterDate, today]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center rounded-lg z-10 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
            <span className="text-sm text-slate-200 font-medium">Loading availability...</span>
          </div>
        </div>
      )}

      {/* Info Banner - Improved contrast */}
      <div className="flex items-start gap-2 p-3 bg-blue-500/15 border border-blue-400/30 rounded-lg">
        <Info className="h-4 w-4 text-blue-300 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-200 leading-relaxed">
          Select your campaign dates below. Unavailable dates are marked and cannot be selected.
        </p>
      </div>

      {/* Single Date Range Input */}
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-2">
          Select Campaign Dates
        </label>
        <div className="relative">
          <DatePicker
            selected={startDate}
            onChange={handleDateRangeChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            minDate={minDate}
            filterDate={filterDate}
            disabled={disabled || isLoading}
            placeholderText="Select date range"
            dateFormat="MMM d, yyyy"
            open={isOpen}
            onClickOutside={() => setIsOpen(false)}
            onFocus={() => setIsOpen(true)}
            renderCustomHeader={CustomHeader}
            renderDayContents={renderDayContents}
            dayClassName={getDayClassName}
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:bg-slate-800 disabled:cursor-not-allowed transition-all cursor-pointer"
            calendarClassName="bg-slate-900 border border-slate-600 rounded-lg shadow-2xl"
            wrapperClassName="w-full"
            popperClassName="z-[9999]"
            aria-label="Select date range for booking"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none" />
        </div>
        
        {/* Display selected range below input */}
        {startDate && endDate && (
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            <span>
              {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              {' → '}
              {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        )}
      </div>

      {/* Legend - Improved contrast and clarity */}
      {showLegend && (
        <div className="flex flex-wrap gap-4 p-3 bg-slate-800 rounded-lg border border-slate-600 text-xs">
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
      )}

      {/* Global Styles - IMPROVED CONTRAST & READABILITY */}
      <style jsx global>{`
        /* DatePicker Container - Lighter background for better contrast */
        .react-datepicker {
          font-family: inherit !important;
          background-color: #1e293b !important; /* Lighter slate-800 instead of slate-950 */
          border: 1px solid #475569 !important; /* Visible border */
          border-radius: 0.75rem !important;
          padding: 0 !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2) !important;
        }

        /* Calendar Header */
        .react-datepicker__header {
          background-color: transparent !important;
          border-bottom: none !important;
          padding: 0 !important;
        }

        .react-datepicker__current-month {
          display: none !important;
        }

        /* Day Names - Brighter and clearer */
        .react-datepicker__day-names {
          display: flex !important;
          justify-content: space-around !important;
          padding: 0.75rem !important;
          background-color: #334155 !important; /* Lighter slate-700 */
          border-bottom: 1px solid #475569 !important;
        }

        .react-datepicker__day-name {
          color: #cbd5e1 !important; /* Bright slate-300 */
          font-size: 0.75rem !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          width: 2.5rem !important;
          line-height: 2.5rem !important;
          margin: 0 !important;
        }

        /* Month Container */
        .react-datepicker__month {
          margin: 0.75rem !important;
          padding: 0 !important;
        }

        /* Week */
        .react-datepicker__week {
          display: flex !important;
          justify-content: space-around !important;
          margin-bottom: 0.25rem !important;
        }

        /* Day Cells - Larger touch targets with WHITE text */
        .react-datepicker__day {
          width: 2.75rem !important;
          height: 2.75rem !important;
          line-height: 2.75rem !important;
          margin: 0.125rem !important;
          border-radius: 0.5rem !important;
          color: #ffffff !important; /* Force white text for all days */
          font-weight: 600 !important;
        }
        
        /* Disabled/unavailable dates - darker text */
        .react-datepicker__day--disabled {
          color: #64748b !important; /* Slate-500 for disabled */
          opacity: 0.4 !important;
        }

        /* Mobile: Even larger touch targets */
        @media (max-width: 640px) {
          .react-datepicker__day {
            width: 3rem !important;
            height: 3rem !important;
            line-height: 3rem !important;
          }
          
          .react-datepicker__day-name {
            width: 3rem !important;
            line-height: 3rem !important;
          }
        }
        
        /* Hover state - ensure white text */
        .react-datepicker__day:hover:not(.react-datepicker__day--disabled):not(.react-datepicker__day--outside-month) {
          color: #ffffff !important;
        }

        /* Selected Date - Bright and obvious */
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background-color: #3b82f6 !important; /* Brighter blue-500 */
          color: #ffffff !important;
          font-weight: 700 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3) !important;
          transform: scale(1.05) !important;
        }

        .react-datepicker__day--selected:hover {
          background-color: #2563eb !important; /* blue-600 */
          transform: scale(1.08) !important;
        }

        /* Date Range - Clear visual range */
        .react-datepicker__day--in-range {
          background-color: rgba(59, 130, 246, 0.2) !important; /* More visible */
          color: #bfdbfe !important; /* Lighter blue-200 */
        }

        .react-datepicker__day--in-selecting-range:not(.react-datepicker__day--in-range) {
          background-color: rgba(59, 130, 246, 0.15) !important;
        }

        .react-datepicker__day--range-start,
        .react-datepicker__day--range-end {
          background-color: #3b82f6 !important; /* Bright blue */
          color: #ffffff !important;
          font-weight: 700 !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3) !important;
        }

        /* Outside Month - Clearly different */
        .react-datepicker__day--outside-month {
          color: #94a3b8 !important; /* Slate-400 - visible but muted */
          opacity: 0.35 !important;
          pointer-events: none !important;
        }

        /* Navigation (handled by custom header) */
        .react-datepicker__navigation {
          display: none !important;
        }

        /* Month Container */
        .react-datepicker__month-container {
          float: none !important;
        }

        /* Triangle (pointer) */
        .react-datepicker__triangle {
          display: none !important;
        }

        /* Portal for mobile */
        @media (max-width: 640px) {
          .react-datepicker-popper {
            position: fixed !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: calc(100% - 2rem) !important;
            max-width: 26rem !important;
          }
        }
      `}</style>
    </div>
  );
};