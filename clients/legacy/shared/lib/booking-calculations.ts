// src/lib/booking-calculations.ts
import { PAYMENT_CONFIG } from './payment-config';

/**
 * OPTION A1: Platform fee + Stripe fee ADDED ON TOP
 * Advertiser pays: subtotal + platform fee + Stripe fee
 * Space owner gets: subtotal (full rental + installation)
 */
type Decimal = undefined;
export interface BookingCostBreakdown {
  rentalCost: number;        // pricePerDay × totalDays
  installationFee: number;   // one-time fee (pass-through)
  subtotal: number;          // rental + installation
  platformFee: number;       // 10% of RENTAL ONLY (not installation)
  stripeFee: number;         // 2.9% + $0.30 of (subtotal + platformFee)
  totalWithFees: number;     // What advertiser pays
  spaceOwnerAmount: number;  // What space owner receives (= subtotal)
}

/**
 * Calculate booking costs with platform fee + Stripe fee
 * CRITICAL: Always use this server-side, never trust client calculations
 */

export function calculateBookingCost(
  pricePerDay: number | Decimal,
  totalDays: number,
  installationFee: number | Decimal = 0
): BookingCostBreakdown {
  // Convert Decimal to number if needed
  const dailyRate = typeof pricePerDay === 'number' ? pricePerDay : Number(pricePerDay);
  const installFee = typeof installationFee === 'number' ? installationFee : Number(installationFee);

  // Validate inputs
  if (dailyRate <= 0) {
    throw new Error('Daily rate must be greater than 0');
  }
  if (totalDays <= 0) {
    throw new Error('Total days must be greater than 0');
  }
  if (installFee < 0) {
    throw new Error('Installation fee cannot be negative');
  }

  // Calculate costs
  const rentalCost = dailyRate * totalDays;
  const subtotal = rentalCost + installFee;
  
  // Validate minimum booking amount (prevents platform losses on micro-transactions)
  if (subtotal < PAYMENT_CONFIG.MIN_BOOKING_SUBTOTAL) {
    throw new Error(
      `Minimum booking amount is $${PAYMENT_CONFIG.MIN_BOOKING_SUBTOTAL.toFixed(2)}. ` +
      `Your current total is $${subtotal.toFixed(2)}. ` +
      `Please increase the campaign duration or select a different space.`
    );
  }
  
  // Platform fee ONLY on rental (not installation) - OPTION A1
  const platformFee = rentalCost * PAYMENT_CONFIG.PLATFORM_FEE_PERCENTAGE;
  
  // Stripe fee on amount charged (subtotal + platform fee)
  const amountBeforeStripe = subtotal + platformFee;
  const stripeFee = (amountBeforeStripe * PAYMENT_CONFIG.STRIPE_FEE_PERCENTAGE) + PAYMENT_CONFIG.STRIPE_FEE_FIXED;
  
  // Total advertiser pays (subtotal + both fees)
  const totalWithFees = amountBeforeStripe + stripeFee;
  
  // Space owner gets full subtotal (no deductions)
  const spaceOwnerAmount = subtotal;

  return {
    rentalCost: round(rentalCost),
    installationFee: round(installFee),
    subtotal: round(subtotal),
    platformFee: round(platformFee),
    stripeFee: round(stripeFee),
    totalWithFees: round(totalWithFees),
    spaceOwnerAmount: round(spaceOwnerAmount),
  };
}

/**
 * Calculate days between two dates
 */
export function calculateDaysBetween(startDate: Date, endDate: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffMs = endDate.getTime() - startDate.getTime();
  const days = Math.ceil(diffMs / msPerDay);
  
  if (days <= 0) {
    throw new Error('End date must be after start date');
  }
  
  return days;
}

/**
 * Verify booking amount matches calculated amount
 * CRITICAL: Use this to prevent payment tampering
 */
export function verifyBookingAmount(
  booking: {
    pricePerDay: number | Decimal;
    totalDays: number;
    totalAmount: number | Decimal;
    platformFee: number | Decimal;
    stripeFee?: number | Decimal | null;
    spaceOwnerAmount: number | Decimal;
  },
  installationFee: number | Decimal = 0
): { isValid: boolean; expected: BookingCostBreakdown; error?: string } {
  try {
    const calculated = calculateBookingCost(
      booking.pricePerDay,
      booking.totalDays,
      installationFee
    );

    const totalAmount = Number(booking.totalAmount);
    const platformFee = Number(booking.platformFee);
    const stripeFee = booking.stripeFee ? Number(booking.stripeFee) : 0;
    const spaceOwnerAmount = Number(booking.spaceOwnerAmount);

    // Allow for small rounding differences (0.01)
    const tolerance = 0.01;

    const totalAmountMatch = Math.abs(totalAmount - calculated.subtotal) < tolerance;
    const platformFeeMatch = Math.abs(platformFee - calculated.platformFee) < tolerance;
    const stripeFeeMatch = Math.abs(stripeFee - calculated.stripeFee) < tolerance;
    const spaceOwnerMatch = Math.abs(spaceOwnerAmount - calculated.spaceOwnerAmount) < tolerance;

    if (!totalAmountMatch) {
      return {
        isValid: false,
        expected: calculated,
        error: `Total amount mismatch: expected ${calculated.subtotal}, got ${totalAmount}`
      };
    }

    if (!platformFeeMatch) {
      return {
        isValid: false,
        expected: calculated,
        error: `Platform fee mismatch: expected ${calculated.platformFee}, got ${platformFee}`
      };
    }

    if (!stripeFeeMatch) {
      return {
        isValid: false,
        expected: calculated,
        error: `Stripe fee mismatch: expected ${calculated.stripeFee}, got ${stripeFee}`
      };
    }

    if (!spaceOwnerMatch) {
      return {
        isValid: false,
        expected: calculated,
        error: `Space owner amount mismatch: expected ${calculated.spaceOwnerAmount}, got ${spaceOwnerAmount}`
      };
    }

    return { isValid: true, expected: calculated };
  } catch (error: unknown) {
    return {
      isValid: false,
      expected: calculateBookingCost(0, 0, 0),
      error: 'error'
    };
  }
}

/**
 * Round to 2 decimal places
 */
function round(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Format amount for Stripe (convert to cents)
 */
export function formatAmountForStripe(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Format amount from Stripe (convert from cents)
 */
export function formatAmountFromStripe(amountInCents: number): number {
  return round(amountInCents / 100);
}