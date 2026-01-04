// src/lib/installation-window.ts

/**
 * Installation Window Logic
 *
 * Business Rules:
 * - Window Opens: 7 days BEFORE campaign start
 * - Window Closes: 7 days AFTER campaign start
 * - Total Window: 14 days
 * - Optimal Upload: ON or just after startDate (when ad is actually installed)
 *
 * Example:
 *   Start Date: May 15, 2025
 *   Window Opens: May 8 (7 days before)
 *   Actual Installation: May 15 (recommended upload day)
 *   Window Closes: May 22 (7 days after)
 */

export const INSTALLATION_WINDOW_DAYS = 7; // Days on each side of startDate

export type WindowStatus = 'TOO_EARLY' | 'OPEN' | 'CLOSED';

export interface InstallationWindowInfo {
  status: WindowStatus;
  canUpload: boolean;

  // Dates (server-calculated, UTC)
  windowOpenDate: Date;
  windowCloseDate: Date;
  campaignStartDate: Date;

  // Time calculations
  daysUntilOpen?: number;  // If TOO_EARLY
  daysRemaining?: number;  // If OPEN
  daysSinceClosed?: number;  // If CLOSED

  // UI messages
  message: string;
  urgency: 'none' | 'low' | 'medium' | 'high' | 'critical';

  // Color coding
  colorClass: 'gray' | 'green' | 'yellow' | 'orange' | 'red';
}

/**
 * Calculate installation window status for a booking
 *
 * @param startDate - Campaign start date (from Booking.startDate)
 * @returns Window status information
 */
export function getInstallationWindowStatus(startDate: Date): InstallationWindowInfo {
  const now = new Date();
  const start = new Date(startDate);

  // Calculate window boundaries
  const windowOpenDate = new Date(start);
  windowOpenDate.setDate(windowOpenDate.getDate() - INSTALLATION_WINDOW_DAYS);

  const windowCloseDate = new Date(start);
  windowCloseDate.setDate(windowCloseDate.getDate() + INSTALLATION_WINDOW_DAYS);

  // Calculate time differences (in days)
  const msPerDay = 1000 * 60 * 60 * 24;

  // State 1: TOO EARLY (before window opens)
  if (now < windowOpenDate) {
    const daysUntilOpen = Math.ceil((windowOpenDate.getTime() - now.getTime()) / msPerDay);

    return {
      status: 'TOO_EARLY',
      canUpload: false,
      windowOpenDate,
      windowCloseDate,
      campaignStartDate: start,
      daysUntilOpen,
      message: `Installation window opens in ${daysUntilOpen} day${daysUntilOpen !== 1 ? 's' : ''} on ${formatDate(windowOpenDate)}`,
      urgency: 'none',
      colorClass: 'gray',
    };
  }

  // State 3: CLOSED (after window closes)
  if (now > windowCloseDate) {
    const daysSinceClosed = Math.floor((now.getTime() - windowCloseDate.getTime()) / msPerDay);

    return {
      status: 'CLOSED',
      canUpload: false,
      windowOpenDate,
      windowCloseDate,
      campaignStartDate: start,
      daysSinceClosed,
      message: `Installation window closed ${daysSinceClosed} day${daysSinceClosed !== 1 ? 's' : ''} ago on ${formatDate(windowCloseDate)}`,
      urgency: 'none',
      colorClass: 'red',
    };
  }

  // State 2: OPEN (within the 14-day window)
  const daysRemaining = Math.ceil((windowCloseDate.getTime() - now.getTime()) / msPerDay);

  // Determine urgency level
  let urgency: InstallationWindowInfo['urgency'];
  let colorClass: InstallationWindowInfo['colorClass'];
  let message: string;

  if (daysRemaining <= 1) {
    urgency = 'critical';
    colorClass = 'red';
    message = daysRemaining === 1
      ? '🚨 URGENT: Upload proof today! Window closes tomorrow'
      : '🚨 CRITICAL: Upload proof NOW! Window closes today';
  } else if (daysRemaining <= 2) {
    urgency = 'high';
    colorClass = 'red';
    message = `🔴 URGENT: ${daysRemaining} days left to upload proof`;
  } else if (daysRemaining <= 4) {
    urgency = 'medium';
    colorClass = 'orange';
    message = `⚠️ ${daysRemaining} days remaining to upload proof`;
  } else if (daysRemaining <= 7) {
    urgency = 'low';
    colorClass = 'yellow';
    message = `${daysRemaining} days remaining in upload window`;
  } else {
    urgency = 'low';
    colorClass = 'green';
    message = `${daysRemaining} days remaining (upload after installation)`;
  }

  return {
    status: 'OPEN',
    canUpload: true,
    windowOpenDate,
    windowCloseDate,
    campaignStartDate: start,
    daysRemaining,
    message,
    urgency,
    colorClass,
  };
}

/**
 * Format date for display (client-side, user's timezone)
 */
function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Check if upload is allowed (used in validation)
 */
export function canUploadProof(startDate: Date): boolean {
  const status = getInstallationWindowStatus(startDate);
  return status.canUpload;
}

/**
 * Get button text based on window status
 */
export function getUploadButtonText(status: WindowStatus, daysRemaining?: number): string {
  switch (status) {
    case 'TOO_EARLY':
      return 'Window Not Open Yet';
    case 'CLOSED':
      return 'Window Closed';
    case 'OPEN':
      if (daysRemaining && daysRemaining <= 2) {
        return 'Upload Proof NOW';
      }
      return 'Upload Proof';
    default:
      return 'Upload Proof';
  }
}

/**
 * Get urgency badge configuration
 */
export function getUrgencyBadge(urgency: InstallationWindowInfo['urgency']) {
  switch (urgency) {
    case 'critical':
      return {
        text: 'URGENT',
        className: 'bg-red-600 text-white animate-pulse',
        icon: '🚨',
      };
    case 'high':
      return {
        text: 'Action Needed',
        className: 'bg-red-500/20 text-red-400 border border-red-500/30',
        icon: '🔴',
      };
    case 'medium':
      return {
        text: 'Upload Soon',
        className: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
        icon: '⚠️',
      };
    case 'low':
      return {
        text: 'Ready',
        className: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
        icon: '📸',
      };
    default:
      return {
        text: 'Pending',
        className: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
        icon: '⏳',
      };
  }
}
