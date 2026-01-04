// src/components/browse/MobileSpaceSheet.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Drawer } from 'vaul';
import {
  MapPin, Star, Calendar, DollarSign, Check, AlertCircle, Loader2, Plus,
  ChevronDown, ChevronRight, Ruler, Eye, TrendingUp, Package, X, Bookmark, Share2
} from 'lucide-react';
import { api } from '../../../../../elaview-mvp/src/trpc/react';
import { DatePickerModal } from '../../ui/DatePickerModal';
import { calculateBookingCost } from '../../../../../elaview-mvp/src/lib/booking-calculations';
import { normalizeToUTCStartOfDay, normalizeToUTCEndOfDay } from '../../../../../elaview-mvp/src/lib/date-utils';
import { ImageCarousel } from '../misc/ImageCarousel';

interface Space {
  id: string;
  title: string;
  description?: string;
  type: string;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  pricePerDay: number;
  installationFee?: number;
  minDuration?: number;
  maxDuration?: number;
  width?: number;
  height?: number;
  dimensionsText?: string;
  traffic?: string;
  availableFrom?: Date;
  availableTo?: Date;
  images: string[];
  owner: {
    id: string;
    name?: string;
    email: string;
  };
  _count: {
    bookings: number;
    reviews: number;
  };
  averageRating?: number;
  totalBookings?: number;
  createdAt?: Date;
}

interface ConfirmedBooking {
  id: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

interface MobileSpaceSheetProps {
  space: Space | null;
  campaignId: string | null;
  isInCart: boolean;
  cartDates?: {
    startDate: Date;
    endDate: Date;
  };
  onClose: () => void;
  onSuccess: () => void;
  onCreateCampaign?: () => void;
  isPublicView?: boolean;
  onAuthRequired?: () => void;
  onNavigateToCreatives?: () => void;
  collapseToMin?: boolean;
}

const SPACE_TYPE_LABELS: Record<string, string> = {
  BILLBOARD: 'Billboard',
  STOREFRONT: 'Storefront',
  TRANSIT: 'Transit Advertising',
  DIGITAL_DISPLAY: 'Digital Display',
  WINDOW_DISPLAY: 'Window Display',
  VEHICLE_WRAP: 'Vehicle Wrap',
  OTHER: 'Other',
};

// Google Maps-style snap points: 65% and 90% of viewport (using fractions)
const SNAP_POINTS = [0.65, 0.9] as [number, number];

export const MobileSpaceSheet: React.FC<MobileSpaceSheetProps> = ({
  space,
  campaignId,
  isInCart,
  cartDates,
  onClose,
  onSuccess,
  onCreateCampaign,
  isPublicView = false,
  onAuthRequired,
  onNavigateToCreatives,
  collapseToMin = false,
}) => {
  const [snap, setSnap] = useState<number | string | null>(0.65);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Calendar nested drawer state
  const [isCalendarDrawerOpen, setIsCalendarDrawerOpen] = useState(false);

  // Scroll position tracking for dismissal behavior
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    if (collapseToMin) {
      setSnap(SNAP_POINTS[0]); // Collapse to 0.65 (65%)
    }
  }, [collapseToMin]);

  const [dateError, setDateError] = useState<string>('');
  const [creativeError, setCreativeError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: confirmedBookings, isLoading: loadingBookings } = api.spaces.getConfirmedBookings.useQuery({
    spaceId: space?.id ?? '',
  }, {
    enabled: !!space?.id,
  });

  // Initialize dates from cart
  useEffect(() => {
    setCreativeError(null);
    if (cartDates) {
      setStartDate(cartDates.startDate);
      setEndDate(cartDates.endDate);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  }, [cartDates, campaignId]);

  // Reset when space changes - start at 0.65 (65%)
  useEffect(() => {
    if (space) {
      setSnap(0.65);
      setIsAtTop(true); // Reset scroll position tracking
    }
  }, [space?.id]);

  // Handle scroll to track position for dismissal behavior
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const scrollTop = scrollContainerRef.current.scrollTop;
      setIsAtTop(scrollTop <= 5); // Allow 5px threshold for better UX
    }
  }, []);

  // Attach scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Date validation
  const isDateAvailable = (date: Date): boolean => {
    if (!space) return false;
    const normalizedDate = normalizeToUTCStartOfDay(date);
    if (space.availableFrom) {
      const availFrom = normalizeToUTCStartOfDay(space.availableFrom);
      if (normalizedDate < availFrom) return false;
    }
    if (space.availableTo) {
      const availTo = normalizeToUTCEndOfDay(space.availableTo);
      if (normalizedDate > availTo) return false;
    }
    const today = normalizeToUTCStartOfDay(new Date());
    if (normalizedDate < today) return false;
    const isBooked = confirmedBookings?.some((booking: ConfirmedBooking) => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      bookingStart.setHours(0, 0, 0, 0);
      bookingEnd.setHours(23, 59, 59, 999);
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      return checkDate >= bookingStart && checkDate <= bookingEnd;
    });
    return !isBooked;
  };

  // Validate selected dates
  useEffect(() => {
    if (!startDate || !endDate || !space) {
      setDateError('Both dates are required');
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
      setDateError('Start date must be in the future');
      return;
    }
    if (endDate <= startDate) {
      setDateError('End date must be after start date');
      return;
    }
    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (space.minDuration && duration < space.minDuration) {
      setDateError(`Minimum booking duration is ${space.minDuration} days`);
      return;
    }
    if (space.maxDuration && duration > space.maxDuration) {
      setDateError(`Maximum booking duration is ${space.maxDuration} days`);
      return;
    }
    const hasOverlap = confirmedBookings?.some((booking: ConfirmedBooking) => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      return (
        (startDate >= bookingStart && startDate <= bookingEnd) ||
        (endDate >= bookingStart && endDate <= bookingEnd) ||
        (startDate <= bookingStart && endDate >= bookingEnd)
      );
    });
    if (hasOverlap) {
      setDateError('Selected dates overlap with existing bookings');
      return;
    }
    setDateError('');
  }, [startDate, endDate, confirmedBookings, space]);

  const calculateDuration = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateSquareFootage = () => {
    if (space?.width && space?.height) {
      return (space.width * space.height).toFixed(1);
    }
    return null;
  };

  const duration = calculateDuration();

  const breakdown = React.useMemo(() => {
    if (!startDate || !endDate || !space?.pricePerDay || duration === 0) {
      return null;
    }
    const pricePerDay = typeof space.pricePerDay === 'number'
      ? space.pricePerDay
      : Number(space.pricePerDay);
    const installationFee = space.installationFee
      ? (typeof space.installationFee === 'number' ? space.installationFee : Number(space.installationFee))
      : 0;
    return calculateBookingCost(pricePerDay, duration, installationFee);
  }, [space, duration, startDate, endDate]);

  const addToCartMutation = api.cart.addToCart.useMutation({
    onSuccess: () => {
      setCreativeError(null);
      onSuccess();
    },
    onError: (error) => {
      if (error.message.includes('creative uploaded')) {
        setCreativeError(error.message);
      }
    },
  });

  const handleAddToCart = () => {
    if (!space) return;
    if (!startDate || !endDate) return;
    if (dateError) return;
    if (!campaignId) return;
    addToCartMutation.mutate({
      spaceId: space.id,
      campaignId,
      startDate,
      endDate,
    });
  };

  const isAddDisabled = !campaignId || !!dateError || !startDate || !endDate || isInCart || loadingBookings;
  const squareFootage = calculateSquareFootage();
  const datesNotSelected = !startDate || !endDate;

  const isFullyExpanded = snap === 0.9;

  // Visibility badge logic (Phase 1: Booking-based)
  const getVisibilityBadge = () => {
    if (!space) return null;

    const totalBookings = space.totalBookings ?? space._count?.bookings ?? 0;

    if (totalBookings >= 10) {
      return { label: 'Popular', color: 'green', bgColor: 'bg-green-500/10', textColor: 'text-green-400', borderColor: 'border-green-500/20' };
    }

    if (totalBookings >= 5) {
      return { label: 'Trending', color: 'blue', bgColor: 'bg-blue-500/10', textColor: 'text-blue-400', borderColor: 'border-blue-500/20' };
    }

    // Check if space is new (created within 30 days)
    if (space.createdAt) {
      const daysOld = (Date.now() - new Date(space.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysOld <= 30) {
        return { label: 'New', color: 'gray', bgColor: 'bg-slate-500/10', textColor: 'text-slate-400', borderColor: 'border-slate-500/20' };
      }
    }

    return null;
  };

  const visibilityBadge = getVisibilityBadge();

  // Handle share action
  const handleShare = async () => {
    if (!space) return;

    const shareData = {
      title: space.title,
      text: `Check out this advertising space in ${space.city}, ${space.state}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error - copy to clipboard as fallback
        await navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      <Drawer.Root
        open={!!space}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
        snapPoints={SNAP_POINTS}
        activeSnapPoint={snap}
        setActiveSnapPoint={setSnap}
        dismissible={isAtTop}
        modal={true}
        fadeFromIndex={1}
        scrollLockTimeout={100}
      >
        <Drawer.Portal>
          <Drawer.Content
            className="fixed bottom-0 left-0 right-0 h-full flex flex-col bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-[9999] rounded-t-2xl shadow-[0_-10px_50px_-10px_rgba(0,0,0,0.3)]"
            style={{ maxHeight: '100vh' }}
          >
            <Drawer.Title className="sr-only">
              {space?.title ?? 'Space Details'}
            </Drawer.Title>

            <Drawer.Description className="sr-only">
              View details and book this advertising space
            </Drawer.Description>

            {/* Drag Handle - Google Maps style */}
            <div className="relative">
              <div className="flex justify-center py-3">
                <div
                  className="h-1 w-12 rounded-full bg-slate-300 dark:bg-slate-700"
                  data-testid="drawer-handle"
                />
              </div>
            </div>

            {space && (
              <div
                ref={scrollContainerRef}
                className={`flex-1 min-h-0 ${isFullyExpanded ? 'overflow-y-auto' : 'overflow-hidden'}`}
                data-vaul-no-drag={!isAtTop}
              >

                {/* HEADER SECTION - Google Maps Style */}
                <div className="px-4 pt-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h2 className="text-2xl font-bold leading-tight flex-1 text-slate-900 dark:text-white">
                      {space.title}
                    </h2>
                    <div className="flex items-center gap-2">
                      {/* Bookmark button - 44px touch target */}
                      <button
                        className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Bookmark space"
                      >
                        <Bookmark className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      </button>
                      {/* Share button - 44px touch target */}
                      <button
                        onClick={handleShare}
                        className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Share space"
                      >
                        <Share2 className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      </button>
                      {/* Close button - 44px touch target */}
                      <button
                        onClick={onClose}
                        className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Close"
                      >
                        <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      </button>
                    </div>
                  </div>

                  {/* Quick info row */}
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 flex-wrap">
                    {/* Rating or "New listing" */}
                    {space.averageRating ? (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                        <span className="font-semibold">{space.averageRating.toFixed(1)}</span>
                      </div>
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400 text-xs">New listing</span>
                    )}
                    <span className="text-slate-400">•</span>
                    {/* Price */}
                    <span className="font-semibold text-green-700 dark:text-green-400">
                      ${Number(space.pricePerDay).toFixed(0)}/day
                    </span>
                    <span className="text-slate-400">•</span>
                    {/* Type */}
                    <span>{SPACE_TYPE_LABELS[space.type] || space.type}</span>
                  </div>

                  {/* Location and visibility badge */}
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                      <MapPin className="h-4 w-4" />
                      <span>{space.city}, {space.state}</span>
                    </div>
                    {visibilityBadge && (
                      <span className={`px-2 py-1 ${visibilityBadge.bgColor} ${visibilityBadge.textColor} text-xs rounded-full border ${visibilityBadge.borderColor} font-medium`}>
                        {visibilityBadge.label}
                      </span>
                    )}
                  </div>
                </div>

                {/* IMAGE CAROUSEL */}
                <div className="px-4 py-4" data-testid="image-gallery">
                  <ImageCarousel
                    images={space.images.length > 0 ? space.images : ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800']}
                    alt={space.title}
                    height="h-64"
                  />
                </div>

                {/* KEY DETAILS - Clean section */}
                <div className="px-4 py-4 bg-slate-50 dark:bg-slate-800/50 mx-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h3 className="text-base font-semibold mb-3 text-slate-900 dark:text-white flex items-center gap-2">
                    <Package className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    Key Details
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    {space.minDuration && (
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Minimum booking: {space.minDuration} days</span>
                      </li>
                    )}
                    {space.installationFee && Number(space.installationFee) > 0 ? (
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Installation included (${Number(space.installationFee)} fee)</span>
                      </li>
                    ) : (
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Self-installation required</span>
                      </li>
                    )}
                    {space.traffic && (
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>{space.traffic} daily impressions</span>
                      </li>
                    )}
                    {(space.width && space.height) && (
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>{space.width}' × {space.height}' ({squareFootage} sq ft)</span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* BOOKING SECTION - Only if authenticated and has campaign */}
                {!isPublicView && campaignId && (
                  <div className="px-4 py-4 space-y-3">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">Book This Space</h3>

                    {/* Date Selection Button */}
                    <button
                      onClick={() => {
                        setIsCalendarDrawerOpen(true);
                        setCreativeError(null);
                      }}
                      disabled={isInCart || loadingBookings}
                      className={`w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-2 rounded-xl transition-all disabled:opacity-50 min-h-[60px] ${
                        datesNotSelected ? 'border-red-300 dark:border-red-500' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          datesNotSelected ? 'bg-red-500/10' : 'bg-slate-100 dark:bg-slate-700'
                        }`}>
                          <Calendar className={`h-5 w-5 ${datesNotSelected ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">Campaign Dates</p>
                          {startDate && endDate ? (
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              {' - '}
                              {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                          ) : (
                            <p className="text-xs text-red-600 dark:text-red-400">Tap to select dates</p>
                          )}
                        </div>
                      </div>
                      {!isInCart && <ChevronRight className="h-5 w-5 text-slate-400" />}
                    </button>

                    {/* Duration requirements */}
                    {(space.minDuration || space.maxDuration) && (
                      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {space.minDuration && space.maxDuration
                            ? `Required: ${space.minDuration}-${space.maxDuration} days`
                            : space.minDuration
                            ? `Minimum: ${space.minDuration} days`
                            : `Maximum: ${space.maxDuration} days`}
                        </span>
                      </div>
                    )}

                    {/* Selected duration confirmation */}
                    {startDate && endDate && !dateError && (
                      <div className="text-xs text-center text-green-600 dark:text-green-400 font-medium">
                        ✓ {duration} {duration === 1 ? 'day' : 'days'} selected
                      </div>
                    )}

                    {/* Date error */}
                    {dateError && startDate && endDate && (
                      <div className="flex items-start gap-2 p-3 text-xs text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{dateError}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* COST BREAKDOWN */}
                {!isPublicView && breakdown && !dateError && campaignId && startDate && endDate && (
                  <div className="px-4 pb-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-2 border border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">{duration} days × ${(breakdown.rentalCost / duration).toFixed(0)}</span>
                        <span className="font-semibold text-slate-900 dark:text-white">${breakdown.rentalCost.toFixed(2)}</span>
                      </div>
                      {breakdown.installationFee > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Installation</span>
                          <span className="font-semibold text-slate-900 dark:text-white">${breakdown.installationFee.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm pt-2 border-t border-slate-200 dark:border-slate-700">
                        <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                        <span className="font-semibold text-slate-900 dark:text-white">${breakdown.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Platform fee (10%)</span>
                        <span className="font-semibold text-slate-900 dark:text-white">${breakdown.platformFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Processing fee</span>
                        <span className="font-semibold text-slate-900 dark:text-white">${breakdown.stripeFee.toFixed(2)}</span>
                      </div>
                      <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">Total</span>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                          ${breakdown.totalWithFees.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* CREATIVE ERROR */}
                {creativeError && (
                  <div className="px-4 pb-4">
                    <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-red-900 dark:text-red-400 mb-1">Creative Required</p>
                          <p className="text-xs text-red-700 dark:text-red-300">
                            You need to upload a creative design for your campaign before adding spaces
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setCreativeError(null);
                          onClose();
                          if (onNavigateToCreatives) onNavigateToCreatives();
                        }}
                        className="w-full px-4 py-3 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-all font-medium"
                      >
                        Upload Creative
                      </button>
                    </div>
                  </div>
                )}

                {/* PRIMARY CTA */}
                <div className="px-4 pb-32">
                  {isPublicView ? (
                    <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 text-center">
                      <AlertCircle className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-400 mb-1">Sign in to book</p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">Create a free account to start</p>
                      <button
                        onClick={onAuthRequired}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium flex items-center justify-center min-h-[44px]"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Sign In to Add
                      </button>
                    </div>
                  ) : !campaignId ? (
                    <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 text-center">
                      <AlertCircle className="h-8 w-8 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-amber-900 dark:text-amber-400 mb-1">Create a campaign first</p>
                      <p className="text-xs text-amber-700 dark:text-amber-300 mb-3">You need a campaign to book spaces</p>
                      <button
                        onClick={() => {
                          onClose();
                          onCreateCampaign?.();
                        }}
                        className="w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all font-medium flex items-center justify-center text-sm min-h-[44px]"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Campaign
                      </button>
                    </div>
                  ) : isInCart ? (
                    <div className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 rounded-xl min-h-[44px]">
                      <Check className="h-5 w-5" />
                      <span className="font-semibold">In Cart</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      disabled={isAddDisabled || addToCartMutation.isPending}
                      className={`w-full px-4 py-3 rounded-xl font-semibold flex items-center justify-between min-h-[44px] transition-all ${
                        (isAddDisabled || addToCartMutation.isPending)
                          ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                      }`}
                    >
                      {addToCartMutation.isPending ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <span>Add to Cart</span>
                          <span className="text-green-300 dark:text-green-400 font-bold">
                            ${Number(space.pricePerDay).toFixed(0)}/day
                          </span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      {/* NESTED DRAWER FOR CALENDAR - Slides from right */}
      <Drawer.Root
        open={isCalendarDrawerOpen}
        onOpenChange={setIsCalendarDrawerOpen}
        direction="right"
        modal={true}
        nested
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[10000]" />
          <Drawer.Content
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 z-[10001] flex flex-col outline-none"
          >
            <div className="flex-1 overflow-auto">
              <DatePickerModal
                isOpen={isCalendarDrawerOpen}
                onClose={() => setIsCalendarDrawerOpen(false)}
                startDate={startDate}
                endDate={endDate}
                onDateChange={(start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }}
                minDate={new Date()}
                filterDate={isDateAvailable}
              />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
};
