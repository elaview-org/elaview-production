// src/components/browse/SpaceDetailsSidebar.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X, MapPin, Star, Calendar, DollarSign, Check, AlertCircle, Loader2, Plus,
  ChevronDown, ChevronRight, Ruler, Eye, TrendingUp, Package
} from 'lucide-react';
import { api } from '../../../../../elaview-mvp/src/trpc/react';
import { DatePickerModal } from '../../ui/DatePickerModal';
import { ImageLightbox } from '../../ui/ImageLightbox';
import { calculateBookingCost } from '../../../../../elaview-mvp/src/lib/booking-calculations';
import { normalizeToUTCStartOfDay, normalizeToUTCEndOfDay } from '../../../../../elaview-mvp/src/lib/date-utils';

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
}

interface ConfirmedBooking {
  id: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

interface SpaceDetailsSidebarProps {
  space: Space;
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

export const SpaceDetailsSidebar: React.FC<SpaceDetailsSidebarProps> = ({
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
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [dateError, setDateError] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [highlightDates, setHighlightDates] = useState(false);
  const [highlightError, setHighlightError] = useState(false);
  const [shakeButton, setShakeButton] = useState(false);
  const [creativeError, setCreativeError] = useState<string | null>(null);
  const [isImageLightboxOpen, setIsImageLightboxOpen] = useState(false);

  const { data: confirmedBookings, isLoading: loadingBookings } = api.spaces.getConfirmedBookings.useQuery({
    spaceId: space.id,
  });

  // Initialize dates - ONLY from cart, no defaults
  useEffect(() => {
    // Clear creative error when campaign changes
    setCreativeError(null);
    
    if (cartDates) {
      console.log('📅 SpaceDetailsSidebar: Setting dates from cart', cartDates);
      setStartDate(cartDates.startDate);
      setEndDate(cartDates.endDate);
    } else {
      // ✅ NO DEFAULT DATES - Start with null
      console.log('📅 SpaceDetailsSidebar: No default dates - user must select');
      setStartDate(null);
      setEndDate(null);
    }
  }, [cartDates, campaignId]);

  // Date validation - use UTC normalization for consistency with server
  const isDateAvailable = (date: Date): boolean => {
    // Normalize the date being checked to UTC start of day
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
    // Clear highlight when dates are selected
    if (startDate && endDate) {
      setHighlightDates(false);
      setHighlightError(false);
      setShakeButton(false);
    }

    if (!startDate || !endDate) {
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

    console.log('✅ SpaceDetailsSidebar: Dates validated successfully');
    setDateError('');
  }, [startDate, endDate, confirmedBookings, space.minDuration, space.maxDuration]);

  const calculateDuration = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateSquareFootage = () => {
    if (space.width && space.height) {
      return (space.width * space.height).toFixed(1);
    }
    return null;
  };

  const duration = calculateDuration();

  // Calculate pricing using centralized function - OPTION A1
  const breakdown = React.useMemo(() => {
    if (!startDate || !endDate || !space.pricePerDay || duration === 0) {
      return null;
    }

    const pricePerDay = typeof space.pricePerDay === 'number'
      ? space.pricePerDay
      : Number(space.pricePerDay);
    const installationFee = space.installationFee
      ? (typeof space.installationFee === 'number' ? space.installationFee : Number(space.installationFee))
      : 0;

    return calculateBookingCost(pricePerDay, duration, installationFee);
  }, [space.pricePerDay, space.installationFee, duration, startDate, endDate]);

  const addToCartMutation = api.cart.addToCart.useMutation({
    onSuccess: () => {
      console.log('✅ SpaceDetailsSidebar: Space added to cart');
      setCreativeError(null);
      onSuccess();
    },
    onError: (error) => {
      console.error('❌ SpaceDetailsSidebar: Failed to add to cart', error);
      
      if (error.message.includes('creative uploaded')) {
        setCreativeError(error.message);
      }
    },
  });

  const handleAddToCart = () => {
    if (!startDate || !endDate) {
      console.log('⚠️ SpaceDetailsSidebar: Missing dates - highlighting date selector');
      setHighlightDates(true);
      setShakeButton(true);
      setTimeout(() => {
        setHighlightDates(false);
        setShakeButton(false);
      }, 2000);
      return;
    }

    if (dateError) {
      console.log('⚠️ SpaceDetailsSidebar: Date validation error - highlighting');
      setHighlightDates(true);
      setHighlightError(true);
      setShakeButton(true);
      setTimeout(() => {
        setHighlightDates(false);
        setHighlightError(false);
        setShakeButton(false);
      }, 2500);
      return;
    }

    if (!campaignId) {
      console.log('⚠️ SpaceDetailsSidebar: Cannot add to cart - missing campaign');
      return;
    }

    console.log('🛒 SpaceDetailsSidebar: Adding to cart', {
      spaceId: space.id,
      campaignId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    addToCartMutation.mutate({
      spaceId: space.id,
      campaignId,
      startDate,
      endDate,
    });
  };

  const isAddDisabled = !campaignId || !!dateError || !startDate || !endDate || isInCart || loadingBookings;
  const squareFootage = calculateSquareFootage();

  // ✅ Check if dates are not selected
  const datesNotSelected = !startDate || !endDate;

  return (
    <>
      {/* Floating Card Sidebar */}
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ 
          type: 'spring', 
          damping: 30, 
          stiffness: 300,
          opacity: { duration: 0.2 }
        }}
        className="absolute top-4 right-4 bottom-4 w-md bg-slate-900/95 backdrop-blur-xl shadow-2xl border border-slate-800 rounded-xl overflow-y-auto z-50"
      >
        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-slate-800 rounded-lg shadow-md hover:bg-slate-700 transition-colors border border-slate-700"
        >
          <X className="h-5 w-5 text-slate-300" />
        </motion.button>

        {/* Image Gallery */}
        <div className="relative h-56 bg-slate-800 cursor-pointer group" onClick={() => setIsImageLightboxOpen(true)}>
          <motion.img
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            src={space.images?.[currentImageIndex] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'}
            alt={space.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800';
            }}
          />

          {/* Hover indicator */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Eye className="h-8 w-8 text-white drop-shadow-lg" />
            </div>
          </div>

          {space.images.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
              {space.images.map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'w-6 bg-white'
                      : 'w-1.5 bg-white/60 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="p-6 space-y-5"
        >
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-xl font-bold text-white leading-tight pr-8">
                {space.title}
              </h2>
              {space.averageRating && (
                <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 rounded-md border border-amber-500/20 shrink-0">
                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-semibold text-amber-400">{space.averageRating.toFixed(1)}</span>
                </div>
              )}
            </div>

            <div className="flex items-start gap-2 text-sm text-slate-400 mb-3">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{space.city}, {space.state}</span>
            </div>

            {/* KEY STATS - Grid Layout */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {/* Dimensions */}
              {(space.width && space.height) && (
                <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                  <div className="flex items-center gap-2 mb-1">
                    <Ruler className="h-4 w-4 text-blue-400" />
                    <span className="text-xs font-medium text-slate-400">Dimensions</span>
                  </div>
                  <p className="text-sm font-bold text-white">{space.width}' × {space.height}'</p>
                  {squareFootage && (
                    <p className="text-xs text-slate-500 mt-0.5">{squareFootage} sq ft</p>
                  )}
                </div>
              )}

              {/* Traffic/Impressions */}
              {space.traffic && (
                <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="h-4 w-4 text-purple-400" />
                    <span className="text-xs font-medium text-slate-400">Visibility</span>
                  </div>
                  <p className="text-sm font-bold text-white">{space.traffic}</p>
                </div>
              )}

              {/* Type */}
              <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="h-4 w-4 text-green-400" />
                  <span className="text-xs font-medium text-slate-400">Type</span>
                </div>
                <p className="text-sm font-bold text-white">
                  {SPACE_TYPE_LABELS[space.type] || space.type}
                </p>
              </div>

              {/* Total Bookings */}
              <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-orange-400" />
                  <span className="text-xs font-medium text-slate-400">Bookings</span>
                </div>
                <p className="text-sm font-bold text-white">{space._count.bookings}</p>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <DollarSign className="h-6 w-6 text-green-400" />
              <span className="text-3xl font-bold text-green-400">{Number(space.pricePerDay).toFixed(0)}</span>
              <span className="text-sm text-green-300 font-medium">/day</span>
              {space.installationFee && Number(space.installationFee) > 0 && (
                <span className="ml-auto text-xs text-green-400">
                  +${Number(space.installationFee)} installation
                </span>
              )}
            </div>
          </div>

          {/* Date Selection Button - Only show if NOT in public view */}
          {!isPublicView && campaignId && (
            <div className="space-y-2">
              <motion.button
                onClick={() => {
                  setIsDateModalOpen(true);
                  setCreativeError(null);
                }}
                disabled={isInCart || loadingBookings}
                animate={highlightDates ? {
                  borderColor: ['#334155', '#3b82f6', '#3b82f6', '#334155'],
                  scale: [1, 1.02, 1.02, 1]
                } : {}}
                transition={{ duration: 0.6 }}
                className={`w-full flex items-center justify-between p-4 bg-slate-800 border-2 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group ${
                  highlightDates 
                    ? 'border-blue-500' 
                    : datesNotSelected 
                    ? 'border-red-500 hover:border-red-400' 
                    : 'border-slate-700 hover:border-blue-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                    datesNotSelected 
                      ? 'bg-red-500/10 group-hover:bg-red-500/20' 
                      : 'bg-blue-500/10 group-hover:bg-blue-500/20'
                  }`}>
                    <Calendar className={`h-5 w-5 ${datesNotSelected ? 'text-red-400' : 'text-blue-400'}`} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">Campaign Dates</p>
                    {startDate && endDate ? (
                      <p className="text-xs text-slate-400">
                        {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {' - '}
                        {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    ) : (
                      <p className={`text-xs ${datesNotSelected ? 'text-red-400' : 'text-slate-400'}`}>
                        Click to select dates
                      </p>
                    )}
                  </div>
                </div>
                {!isInCart && (
                  <ChevronRight className={`h-5 w-5 transition-colors ${
                    datesNotSelected 
                      ? 'text-red-400 group-hover:text-red-300' 
                      : 'text-slate-400 group-hover:text-blue-400'
                  }`} />
                )}
              </motion.button>

              {/* Duration Requirements and Selected Duration */}
              <div className="space-y-1">
                {/* Show duration requirements */}
                {(space.minDuration || space.maxDuration) && (
                  <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {space.minDuration && space.maxDuration 
                        ? `Required: ${space.minDuration}-${space.maxDuration} days`
                        : space.minDuration 
                        ? `Minimum: ${space.minDuration} days`
                        : `Maximum: ${space.maxDuration} days`
                      }
                    </span>
                  </div>
                )}
                
                {/* Show selected duration if valid */}
                {startDate && endDate && !dateError && (
                  <div className="text-xs text-center text-green-400">
                    ✓ {duration} {duration === 1 ? 'day' : 'days'} selected
                  </div>
                )}
              </div>

              {/* Date Error Message */}
              {dateError && startDate && endDate && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={highlightError ? {
                    opacity: 1,
                    y: 0,
                    scale: [1, 1.03, 1.03, 1],
                    borderColor: ['#7f1d1d', '#dc2626', '#dc2626', '#7f1d1d']
                  } : {
                    opacity: 1,
                    y: 0
                  }}
                  transition={{ duration: highlightError ? 0.6 : 0.2 }}
                  className="flex items-start gap-2 p-2.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{dateError}</span>
                </motion.div>
              )}

              {/* Missing Dates Warning */}
              {highlightDates && datesNotSelected && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 p-2.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>Please select campaign dates to continue</span>
                </motion.div>
              )}
            </div>
          )}

          {/* Cost Breakdown - Only show if NOT in public view AND dates are selected */}
          {!isPublicView && breakdown && !dateError && campaignId && startDate && endDate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-blue-500/10 rounded-lg p-4 space-y-2 border border-blue-500/20"
            >
              <div className="flex justify-between text-sm">
                <span className="text-blue-300">{duration} days × ${(breakdown.rentalCost / duration).toFixed(0)}</span>
                <span className="font-semibold text-blue-400">${breakdown.rentalCost.toFixed(2)}</span>
              </div>

              {breakdown.installationFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-blue-300">Installation</span>
                  <span className="font-semibold text-blue-400">${breakdown.installationFee.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm pt-2 border-t border-blue-500/20">
                <span className="text-blue-300">Subtotal</span>
                <span className="font-semibold text-blue-400">${breakdown.subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-blue-300">Platform fee (10% of rental)</span>
                <span className="font-semibold text-blue-400">${breakdown.platformFee.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-blue-300">Processing fee</span>
                <span className="font-semibold text-blue-400">${breakdown.stripeFee.toFixed(2)}</span>
              </div>

              <div className="pt-2 mt-2 border-t border-blue-500/20 flex justify-between items-baseline">
                <span className="text-sm font-semibold text-blue-400">Total</span>
                <span className="text-2xl font-bold text-blue-400">
                  ${breakdown.totalWithFees.toFixed(2)}
                </span>
              </div>
            </motion.div>
          )}

          {/* Primary CTA */}
          <div className="space-y-2">
            {/* Creative Upload Error */}
            {creativeError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"
              >
                <div className="flex items-start gap-3 mb-3">
                  <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-400 mb-1">
                      Creative Required
                    </p>
                    <p className="text-xs text-red-300">
                      You need to upload a creative design for your campaign before adding spaces
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCreativeError(null);
                    onClose();
                    if (onNavigateToCreatives) {
                      onNavigateToCreatives();
                    }
                  }}
                  className="w-full px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-all font-medium"
                >
                  Upload Creative
                </button>
              </motion.div>
            )}

            {isPublicView ? (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
                <AlertCircle className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-blue-400 mb-1">
                  Sign in to book this space
                </p>
                <p className="text-xs text-blue-300 mb-3">
                  Create a free account to start building campaigns
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onAuthRequired}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium flex items-center justify-center shadow-sm hover:shadow-md"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Sign In to Add to Campaign
                </motion.button>
              </div>
            ) : !campaignId ? (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-center">
                <AlertCircle className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-amber-400 mb-1">
                  Create a campaign first
                </p>
                <p className="text-xs text-amber-300 mb-3">
                  You need a campaign to book spaces
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onClose();
                    onCreateCampaign?.();
                  }}
                  className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all font-medium flex items-center justify-center shadow-sm hover:shadow-md text-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </motion.button>
              </div>
            ) : isInCart ? (
              <div className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg">
                <Check className="h-5 w-5" />
                <span className="font-semibold">In Cart</span>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: (isAddDisabled || addToCartMutation.isPending) ? 1 : 1.02 }}
                whileTap={{ scale: (isAddDisabled || addToCartMutation.isPending) ? 1 : 0.98 }}
                animate={shakeButton ? {
                  x: [0, -10, 10, -10, 10, 0],
                  transition: { duration: 0.5 }
                } : {}}
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending}
                className={`w-full px-4 py-3 rounded-lg transition-all font-semibold flex items-center justify-center shadow-md ${
                  (isAddDisabled || addToCartMutation.isPending)
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed hover:bg-slate-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                }`}
              >
                {addToCartMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Adding...
                  </>
                ) : (
                  'Add to Cart'
                )}
              </motion.button>
            )}
          </div>

          {/* Progressive Disclosure - Description */}
          {space.description && (
            <button
              onClick={() => setShowDescription(!showDescription)}
              className="w-full text-left"
            >
              <div className="flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700">
                <span className="text-sm font-medium text-white">About this space</span>
                <motion.div
                  animate={{ rotate: showDescription ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </motion.div>
              </div>
              {showDescription && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 p-3 text-sm text-slate-300 leading-relaxed bg-slate-800 rounded-lg border border-slate-700"
                >
                  {space.description}
                </motion.div>
              )}
            </button>
          )}

          {/* Progressive Disclosure - Additional Details */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full text-left"
          >
            <div className="flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700">
              <span className="text-sm font-medium text-white">Additional details</span>
              <motion.div
                animate={{ rotate: showDetails ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </motion.div>
            </div>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-2 p-3 space-y-2 text-sm bg-slate-800 rounded-lg border border-slate-700"
              >
                <div className="flex justify-between">
                  <span className="text-slate-400">Full address</span>
                  <span className="font-medium text-white text-right">{space.address}</span>
                </div>
                {space.minDuration && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Min duration</span>
                    <span className="font-medium text-white">{space.minDuration} days</span>
                  </div>
                )}
                {space.maxDuration && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Max duration</span>
                    <span className="font-medium text-white">{space.maxDuration} days</span>
                  </div>
                )}
                {space._count.reviews > 0 && (
                  <div className="flex justify-between pt-2 border-t border-slate-700">
                    <span className="text-slate-400">Reviews</span>
                    <span className="font-medium text-white">{space._count.reviews}</span>
                  </div>
                )}
              </motion.div>
            )}
          </button>
        </motion.div>
      </motion.div>

      {/* Date Picker Modal */}
      <DatePickerModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        startDate={startDate}
        endDate={endDate}
        onDateChange={(start, end) => {
          setStartDate(start);
          setEndDate(end);
        }}
        minDate={new Date()}
        filterDate={isDateAvailable}
      />

      {/* Image Lightbox for full-size space photos */}
      <ImageLightbox
        images={space.images}
        alt={space.title}
        isOpen={isImageLightboxOpen}
        onClose={() => setIsImageLightboxOpen(false)}
        initialIndex={currentImageIndex}
        onIndexChange={(index) => setCurrentImageIndex(index)}
      />
    </>
  );
};