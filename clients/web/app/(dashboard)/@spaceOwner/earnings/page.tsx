// src/app/(space-owner)/earnings/page.tsx
"use client";

import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  MapPin,
  Building,
  ChevronDown,
  ChevronUp,
  Loader2,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import useEarnings from "@/shared/hooks/api/getters/useEarnings/useEarnings";
type RouterOutputs = any;

type EarningsData = RouterOutputs["bookings"]["getEarnings"];
type CompletedBooking = EarningsData["bookings"][number];

export default function EarningsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "month" | "year" | "all"
  >("month");
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);

  //   const { data: earnings, isLoading } = api.bookings.getEarnings.useQuery();

  const { earnings, isLoading } = useEarnings();
  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return format(new Date(date), "MMM d, yyyy");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getDisplayEarnings = () => {
    if (!earnings) return 0;

    // Only count ACTUAL transferred earnings (not promised amounts)
    const paidBookings = earnings.bookings.filter(
      (b) => b.firstPayoutProcessed
    );

    const calculateEarnings = (bookings: typeof paidBookings) => {
      return bookings.reduce((sum, booking) => {
        // Calculate actual transferred amount (first + final if processed)
        const firstPayout = Number(booking.firstPayoutAmount || 0);
        const finalPayout = booking.finalPayoutProcessed
          ? Number(booking.finalPayoutAmount || 0)
          : 0;
        return sum + firstPayout + finalPayout;
      }, 0);
    };

    switch (selectedPeriod) {
      case "month": {
        const thisMonth = paidBookings.filter((b) => {
          const payoutDate = b.firstPayoutDate;
          if (!payoutDate) return false;
          const date = new Date(payoutDate);
          const now = new Date();
          return (
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
          );
        });
        return calculateEarnings(thisMonth);
      }
      case "year": {
        const thisYear = paidBookings.filter((b) => {
          const payoutDate = b.firstPayoutDate;
          if (!payoutDate) return false;
          return (
            new Date(payoutDate).getFullYear() === new Date().getFullYear()
          );
        });
        return calculateEarnings(thisYear);
      }
      case "all":
        return calculateEarnings(paidBookings);
      default:
        return calculateEarnings(paidBookings);
    }
  };

  const getPendingEarnings = () => {
    if (!earnings) return 0;
    return earnings.bookings.reduce((sum, booking) => {
      const totalOwed = Number(booking.spaceOwnerAmount);
      const firstPayout = Number(booking.firstPayoutAmount || 0);
      const finalPayout = booking.finalPayoutProcessed
        ? Number(booking.finalPayoutAmount || 0)
        : 0;
      const totalTransferred = firstPayout + finalPayout;
      const pending = totalOwed - totalTransferred;

      // Only count positive pending amounts (owed but not yet transferred)
      return sum + (pending > 0 ? pending : 0);
    }, 0);
  };

  const getTotalPaidEarnings = () => {
    if (!earnings) return 0;
    return earnings.bookings
      .filter((b) => b.firstPayoutProcessed)
      .reduce((sum, booking) => {
        // Calculate actual transferred amount (first + final if processed)
        const firstPayout = Number(booking.firstPayoutAmount || 0);
        const finalPayout = booking.finalPayoutProcessed
          ? Number(booking.finalPayoutAmount || 0)
          : 0;
        return sum + firstPayout + finalPayout;
      }, 0);
  };

  const getPaidBookingsCount = () => {
    if (!earnings) return 0;
    return earnings.bookings.filter((b) => b.firstPayoutProcessed).length;
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "month":
        return "This Month";
      case "year":
        return "This Year";
      case "all":
        return "All Time";
      default:
        return "All Time";
    }
  };

  if (isLoading) {
    return (
      <div className="h-full w-full p-4">
        <div className="flex h-full items-center justify-center rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-green-500" />
            <p className="text-sm text-slate-400">Loading earnings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-4">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
        {/* Header - Fixed */}
        <div className="shrink-0 border-b border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Earnings</h1>
              <p className="mt-2 text-slate-400">
                Track your revenue and payment history across all your spaces.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 font-medium text-white shadow-lg shadow-green-600/20 transition-all hover:bg-green-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Period Selector */}
          <div className="mb-6">
            <div className="flex space-x-2">
              {[
                { key: "month", label: "This Month" },
                { key: "year", label: "This Year" },
                { key: "all", label: "All Time" },
              ].map((period) => (
                <button
                  key={period.key}
                  type="button"
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    selectedPeriod === period.key
                      ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                      : "border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                  onClick={() =>
                    setSelectedPeriod(period.key as "month" | "year" | "all")
                  }
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-lg transition-all hover:border-slate-600">
              <div className="flex items-center">
                <div className="rounded-lg bg-green-600 p-3">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-slate-400">
                    {getPeriodLabel()} Earnings
                  </h3>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {formatCurrency(getDisplayEarnings())}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-lg transition-all hover:border-slate-600">
              <div className="flex items-center">
                <div className="rounded-lg bg-blue-600 p-3">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-slate-400">
                    Total Paid Out
                  </h3>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {formatCurrency(getTotalPaidEarnings())}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-orange-700 bg-slate-800 p-6 shadow-lg transition-all hover:border-orange-600">
              <div className="flex items-center">
                <div className="rounded-lg bg-orange-600 p-3">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-slate-400">
                    Pending (In Escrow)
                  </h3>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {formatCurrency(getPendingEarnings())}
                  </p>
                  <p className="mt-1 text-xs text-orange-400">
                    Awaiting proof approval
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-lg transition-all hover:border-slate-600">
              <div className="flex items-center">
                <div className="rounded-lg bg-purple-600 p-3">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-slate-400">
                    Paid Bookings
                  </h3>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {getPaidBookingsCount()}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    of {earnings?.totalBookings || 0} total
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Overview Chart Placeholder */}
          <div className="mb-6 rounded-xl border border-slate-700 bg-slate-800 shadow-lg">
            <div className="border-b border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white">
                Earnings Overview
              </h2>
            </div>
            <div className="p-6">
              <div className="flex h-64 items-center justify-center rounded-lg border border-slate-600 bg-slate-700/50">
                <div className="text-center">
                  <TrendingUp className="mx-auto mb-4 h-12 w-12 text-slate-500" />
                  <p className="font-medium text-slate-300">
                    Chart visualization coming soon
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Monthly earnings trend will be displayed here
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="rounded-xl border border-slate-700 bg-slate-800 shadow-lg">
            <div className="border-b border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white">
                Payment History
              </h2>
            </div>

            {!earnings?.bookings || earnings.bookings.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-700">
                  <DollarSign className="h-7 w-7 text-slate-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  No payments yet
                </h3>
                <p className="text-slate-400">
                  Once your spaces are booked and campaigns are completed,
                  payments will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-700">
                {earnings.bookings.map((booking) => (
                  <PaymentRow
                    key={booking.id}
                    booking={booking}
                    isExpanded={expandedBooking === booking.id}
                    onToggleExpand={() =>
                      setExpandedBooking(
                        expandedBooking === booking.id ? null : booking.id
                      )
                    }
                    formatDate={formatDate}
                    formatCurrency={formatCurrency}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentRow({
  booking,
  isExpanded,
  onToggleExpand,
  formatDate,
  formatCurrency,
}: {
  booking: CompletedBooking;
  isExpanded: boolean;
  onToggleExpand: () => void;
  formatDate: (date: Date | null) => string;
  formatCurrency: (amount: number) => string;
}) {
  // Convert Decimal to number
  const totalAmount = Number(booking.totalAmount);
  const platformFee = Number(booking.platformFee);
  const spaceOwnerAmount = Number(booking.spaceOwnerAmount);

  // Calculate actual transferred vs pending amounts
  const firstPayout = Number(booking.firstPayoutAmount || 0);
  const finalPayout = booking.finalPayoutProcessed
    ? Number(booking.finalPayoutAmount || 0)
    : 0;
  const totalTransferred = firstPayout + finalPayout;
  const pendingAmount = spaceOwnerAmount - totalTransferred;

  // Calculate daily rate from totalAmount / days
  const dailyRate = totalAmount / booking.totalDays;

  return (
    <div className="p-6 transition-colors hover:bg-slate-700/30">
      <div
        className="flex cursor-pointer items-center justify-between"
        onClick={onToggleExpand}
      >
        <div className="flex-1">
          <div className="flex items-start space-x-4">
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center space-x-2">
                <h3 className="truncate text-lg font-semibold text-white">
                  {booking.campaign.name}
                </h3>
                <span className="inline-flex items-center rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-400">
                  {booking.status === "COMPLETED"
                    ? "Completed"
                    : booking.status === "ACTIVE"
                    ? "Active"
                    : "Confirmed"}
                </span>
                {/* Payout Status Badge */}
                {pendingAmount <= 0 ? (
                  <span className="inline-flex items-center rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-400">
                    <DollarSign className="mr-1 h-3 w-3" />
                    Fully Paid
                  </span>
                ) : booking.firstPayoutProcessed ? (
                  <span className="inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-0.5 text-xs font-medium text-orange-400">
                    <Clock className="mr-1 h-3 w-3" />
                    Partially Paid
                  </span>
                ) : booking.proofStatus === "PENDING" ? (
                  <span className="inline-flex items-center rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-0.5 text-xs font-medium text-yellow-400">
                    <Clock className="mr-1 h-3 w-3" />
                    Awaiting Proof Approval
                  </span>
                ) : booking.status === "CONFIRMED" ? (
                  <span className="inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-0.5 text-xs font-medium text-orange-400">
                    <Clock className="mr-1 h-3 w-3" />
                    In Escrow
                  </span>
                ) : null}
              </div>

              <p className="mb-2 text-sm text-slate-400">
                by {booking.campaign.advertiser.name || "Anonymous"}
                {booking.campaign.advertiser.advertiserProfile?.companyName &&
                  ` (${booking.campaign.advertiser.advertiserProfile.companyName})`}
              </p>

              {/* Payout Date */}
              {pendingAmount <= 0 ? (
                <p className="mb-2 text-xs text-green-400">
                  ✅ All payments completed -{" "}
                  {formatDate(
                    booking.finalPayoutDate || booking.firstPayoutDate
                  )}
                </p>
              ) : booking.firstPayoutProcessed ? (
                <p className="mb-2 text-xs text-orange-400">
                  💰 First payout sent{" "}
                  {formatDate(booking.firstPayoutDate || null)} - Final payout
                  of {formatCurrency(pendingAmount)} will be processed after
                  campaign completion
                </p>
              ) : booking.proofStatus === "PENDING" ? (
                <p className="mb-2 text-xs text-yellow-400">
                  Funds in escrow - awaiting proof approval
                </p>
              ) : booking.status === "CONFIRMED" ? (
                <p className="mb-2 text-xs text-orange-400">
                  Funds held in escrow - upload installation proof to release
                </p>
              ) : null}

              <div className="flex items-center space-x-4 text-sm text-slate-500">
                <span className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {booking.space.title}
                </span>
                <span className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  {formatDate(booking.startDate)} -{" "}
                  {formatDate(booking.endDate)}
                </span>
                <span className="flex items-center">
                  <Building className="mr-1 h-4 w-4" />
                  {booking.space.type}
                </span>
              </div>
            </div>

            <div className="text-right">
              <p
                className={`text-lg font-semibold ${
                  pendingAmount <= 0 ? "text-green-400" : "text-orange-400"
                }`}
              >
                {formatCurrency(totalTransferred)}
              </p>
              <p className="text-sm text-slate-500">
                {pendingAmount <= 0
                  ? "Fully Paid"
                  : `Paid (${formatCurrency(pendingAmount)} pending)`}
              </p>
            </div>
          </div>
        </div>

        <div className="ml-4">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-slate-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 border-t border-slate-700 pt-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-3 font-semibold text-white">Booking Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Duration:</span>
                  <span className="text-white">{booking.totalDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rate per day:</span>
                  <span className="text-white">
                    {formatCurrency(dailyRate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal:</span>
                  <span className="text-white">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Date:</span>
                  <span className="text-white">
                    {formatDate(booking.paidAt)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-3 font-semibold text-white">Payment Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Duration:</span>
                  <span className="text-white">{booking.totalDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rate per day:</span>
                  <span className="text-white">
                    {formatCurrency(dailyRate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Date:</span>
                  <span className="text-white">
                    {formatDate(booking.paidAt)}
                  </span>
                </div>
                <div className="mt-2 space-y-2 border-t border-slate-600 pt-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Owed:</span>
                    <span className="text-white">
                      {formatCurrency(spaceOwnerAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Transferred:</span>
                    <span className="text-green-400">
                      {formatCurrency(totalTransferred)}
                    </span>
                  </div>
                  {pendingAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pending:</span>
                      <span className="text-orange-400">
                        {formatCurrency(pendingAmount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-slate-600 pt-2 font-medium">
                    <span className="text-white">Status:</span>
                    <span
                      className={
                        pendingAmount <= 0
                          ? "text-green-400"
                          : "text-orange-400"
                      }
                    >
                      {pendingAmount <= 0 ? "Fully Paid" : "Partially Paid"}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Platform fee (10% of rental) is paid by advertiser
                </p>
                {pendingAmount > 0 && (
                  <div className="mt-3 rounded-lg border border-orange-500/20 bg-orange-500/10 p-3">
                    <p className="text-xs text-orange-400">
                      💡{" "}
                      {booking.firstPayoutProcessed
                        ? `Final payout of ${formatCurrency(
                            pendingAmount
                          )} will be processed after campaign completion`
                        : "Upload installation proof to release these funds"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
