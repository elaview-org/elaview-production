// Mock earnings data for development (Owner perspective)
// These will be replaced with real API data later

export interface Payout {
  id: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  method: "bank" | "paypal" | "stripe";
  last4?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface EarningsTransaction {
  id: string;
  type: "booking_payment" | "payout" | "refund" | "adjustment";
  description: string;
  amount: number;
  bookingId?: string;
  spaceTitle?: string;
  createdAt: Date;
}

export interface EarningsSummary {
  availableBalance: number;
  pendingBalance: number;
  totalEarnings: number;
  thisMonthEarnings: number;
  lastMonthEarnings: number;
}

export const mockEarningsSummary: EarningsSummary = {
  availableBalance: 1250.0,
  pendingBalance: 450.0,
  totalEarnings: 8750.0,
  thisMonthEarnings: 1700.0,
  lastMonthEarnings: 2100.0,
};

export const mockPayouts: Payout[] = [
  {
    id: "payout-1",
    amount: 500.0,
    status: "completed",
    method: "bank",
    last4: "4567",
    createdAt: new Date("2026-01-01"),
    completedAt: new Date("2026-01-03"),
  },
  {
    id: "payout-2",
    amount: 750.0,
    status: "completed",
    method: "bank",
    last4: "4567",
    createdAt: new Date("2025-12-15"),
    completedAt: new Date("2025-12-17"),
  },
  {
    id: "payout-3",
    amount: 600.0,
    status: "completed",
    method: "bank",
    last4: "4567",
    createdAt: new Date("2025-12-01"),
    completedAt: new Date("2025-12-03"),
  },
];

export const mockTransactions: EarningsTransaction[] = [
  {
    id: "txn-1",
    type: "booking_payment",
    description: "Booking payment received",
    amount: 500.0,
    bookingId: "booking-12",
    spaceTitle: "Downtown Coffee Shop Window",
    createdAt: new Date("2026-01-05"),
  },
  {
    id: "txn-2",
    type: "payout",
    description: "Payout to bank ••••4567",
    amount: -500.0,
    createdAt: new Date("2026-01-03"),
  },
  {
    id: "txn-3",
    type: "booking_payment",
    description: "Booking payment received",
    amount: 450.0,
    bookingId: "booking-13",
    spaceTitle: "Downtown Coffee Shop Window",
    createdAt: new Date("2026-01-02"),
  },
  {
    id: "txn-4",
    type: "booking_payment",
    description: "Booking payment received",
    amount: 750.0,
    bookingId: "booking-11",
    spaceTitle: "Downtown Coffee Shop Window",
    createdAt: new Date("2025-12-20"),
  },
  {
    id: "txn-5",
    type: "payout",
    description: "Payout to bank ••••4567",
    amount: -750.0,
    createdAt: new Date("2025-12-17"),
  },
];

// Helper to format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// Helper to format payout status
export const payoutStatusLabels: Record<Payout["status"], string> = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
};
