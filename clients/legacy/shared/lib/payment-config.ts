// src/lib/payment-config.ts

/**
 * Payment and booking configuration constants
 * OPTION A1: Platform fee + Stripe fee ADDED ON TOP (advertiser pays both)
 */

export const PAYMENT_CONFIG = {
  // Platform revenue
  PLATFORM_FEE_PERCENTAGE: 0.10,
  APPLY_FEE_TO_INSTALLATION: false, // Platform fee ONLY on rental, not installation
  
  // Stripe payment processing
  STRIPE_FEE_PERCENTAGE: 0.029, // 2.9%
  STRIPE_FEE_FIXED: 0.30, // $0.30 per transaction
  STRIPE_CURRENCY: 'usd' as const,
  
  // Minimum booking amount (prevents platform losses on micro-transactions)
  MIN_BOOKING_SUBTOTAL: 10.00, // Platform loses money below ~$3 due to Stripe's $0.30 fixed fee
  
  // Payment timing
  DEPOSIT_PERCENTAGE: 0.50,
  DAYS_BEFORE_DEPOSIT: 14, // If campaign starts >14 days, charge deposit
  DAYS_BEFORE_BALANCE_DUE: 7, // Charge balance 7 days before start
  
  // Campaign limits
  MIN_CAMPAIGN_DAYS: 1,
  MAX_CAMPAIGN_DAYS: 90,
  
  // Quality & verification
  QUALITY_GUARANTEE_DAYS: 7,
  VERIFICATION_INTERVAL_DAYS: 7,
  AUTO_APPROVE_HOURS: 48,
} as const;

/**
 * Calculate complete payout schedule
 * CRITICAL: Installation fee is SEPARATE from rental payouts
 * On approval: Transfer 1 = installation fee, Transfer 2 = first rental payout
 */
export function calculatePayoutSchedule(
  campaignDays: number,
  dailyRate: number,
  installationFee = 0
) {
  const totalRental = campaignDays * dailyRate;
  
  // Installation fee paid IMMEDIATELY on approval (separate transfer)
  const immediateInstallPayout = installationFee;
  
  // Rental payouts follow schedule based on campaign length
  let firstRentalPayout: number;
  let finalRentalPayout: number;
  let checkpointPayouts: number[] = [];

  if (campaignDays <= 7) {
    // Short campaigns: 70% on approval, 30% on completion
    firstRentalPayout = totalRental * 0.70;
    finalRentalPayout = totalRental * 0.30;
  } else if (campaignDays <= 30) {
    // Medium campaigns: 50% on approval, 50% on completion
    firstRentalPayout = totalRental * 0.50;
    finalRentalPayout = totalRental * 0.50;
  } else {
    // Long campaigns: 40% on approval, checkpoints, 30% on completion
    firstRentalPayout = totalRental * 0.40;
    finalRentalPayout = totalRental * 0.30;
    
    // Remaining 30% split across verification checkpoints
    const checkpointCount = Math.floor(campaignDays / PAYMENT_CONFIG.VERIFICATION_INTERVAL_DAYS) - 1;
    if (checkpointCount > 0) {
      const checkpointAmount = (totalRental * 0.30) / checkpointCount;
      checkpointPayouts = Array(checkpointCount).fill(checkpointAmount);
    }
  }

  return {
    installationFee: immediateInstallPayout,
    firstRentalPayout,
    finalRentalPayout,
    checkpointPayouts,
    totalRental,
    totalPayout: totalRental + installationFee,
  };
}

/**
 * Determine payment type based on campaign start date
 */
export function getPaymentType(daysUntilCampaign: number): 'IMMEDIATE' | 'DEPOSIT' {
  return daysUntilCampaign > PAYMENT_CONFIG.DAYS_BEFORE_DEPOSIT ? 'DEPOSIT' : 'IMMEDIATE';
}

/**
 * Calculate deposit vs balance split INCLUDING fees
 * CRITICAL: Fees are split proportionally between deposit and balance
 *
 * @param totalAmount - Subtotal (rental + installation) WITHOUT fees
 * @param platformFee - Platform fee (10% of rental only)
 * @param stripeFee - Stripe processing fee (2.9% + $0.30)
 * @returns Split amounts that include proportional fees
 */
export function calculatePaymentSplit(
  totalAmount: number,
  platformFee: number,
  stripeFee: number
) {
  const totalWithFees = totalAmount + platformFee + stripeFee;
  const depositAmount = totalWithFees * PAYMENT_CONFIG.DEPOSIT_PERCENTAGE;
  const balanceAmount = totalWithFees - depositAmount;

  return {
    depositAmount: Math.round(depositAmount * 100) / 100,
    balanceAmount: Math.round(balanceAmount * 100) / 100,
    totalWithFees: Math.round(totalWithFees * 100) / 100,
  };
}

/**
 * Generate verification checkpoint dates for long campaigns
 */
export function generateVerificationDates(
  startDate: Date,
  campaignDays: number
): Date[] {
  if (campaignDays <= 30) return [];
  
  const dates: Date[] = [];
  let checkpointDay = PAYMENT_CONFIG.VERIFICATION_INTERVAL_DAYS;
  
  while (checkpointDay < campaignDays) {
    const checkpointDate = new Date(startDate);
    checkpointDate.setDate(checkpointDate.getDate() + checkpointDay);
    dates.push(checkpointDate);
    checkpointDay += PAYMENT_CONFIG.VERIFICATION_INTERVAL_DAYS;
  }
  
  return dates;
}