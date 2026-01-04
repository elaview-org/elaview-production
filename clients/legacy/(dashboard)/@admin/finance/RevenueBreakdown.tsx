import { DollarSign, TrendingUp, CreditCard } from "lucide-react";
import { api } from "../../../../../elaview-mvp/src/trpc/server";

export async function RevenueBreakdown() {
  const breakdown = await api.admin.finance.getRevenueBreakdown({});

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">
          💵 Revenue Breakdown (This Month)
        </h2>
        <span className="text-xs text-slate-400">
          {breakdown.dateRange.startDate.toLocaleDateString()} - {breakdown.dateRange.endDate.toLocaleDateString()}
        </span>
      </div>

      {/* Main Revenue Metrics */}
      <div className="space-y-4 mb-6">
        {/* Platform Fees */}
        <div className="flex items-start justify-between p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-green-400" />
            <div>
              <div className="text-sm text-slate-400">Platform Fees Collected</div>
              <div className="text-2xl font-bold text-white">
                ${breakdown.platformFees.total.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="text-right text-sm">
            <div className="text-slate-400">
              Immediate: <span className="text-white font-medium">
                ${breakdown.platformFees.immediate.toFixed(2)}
              </span> ({breakdown.platformFees.percentageImmediate.toFixed(0)}%)
            </div>
            <div className="text-slate-400 mt-1">
              Deposit: <span className="text-white font-medium">
                ${breakdown.platformFees.deposit.toFixed(2)}
              </span> ({breakdown.platformFees.percentageDeposit.toFixed(0)}%)
            </div>
          </div>
        </div>

        {/* Stripe Fees */}
        <div className="flex items-start justify-between p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-blue-400" />
            <div>
              <div className="text-sm text-slate-400">Stripe Fees Paid</div>
              <div className="text-2xl font-bold text-white">
                ${breakdown.stripeFees.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-slate-400">
            ~{((breakdown.stripeFees / breakdown.platformFees.total) * 100).toFixed(1)}% of platform fees
          </div>
        </div>

        {/* Net Revenue */}
        <div className="flex items-start justify-between p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <div>
              <div className="text-sm text-green-400">Net Platform Revenue</div>
              <div className="text-2xl font-bold text-white">
                ${breakdown.netRevenue.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-green-400">
            Platform fees - Stripe fees
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-700">
        <div>
          <div className="text-sm text-slate-400">Total Bookings</div>
          <div className="text-xl font-semibold text-white mt-1">
            {breakdown.totalBookings}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {breakdown.immediateBookings} immediate + {breakdown.depositBookings} deposit
          </div>
        </div>

        <div>
          <div className="text-sm text-slate-400">Total Rental Value</div>
          <div className="text-xl font-semibold text-white mt-1">
            ${breakdown.totalRentalValue.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Advertiser spend
          </div>
        </div>

        <div>
          <div className="text-sm text-slate-400">Space Owner Payouts</div>
          <div className="text-xl font-semibold text-white mt-1">
            ${breakdown.spaceOwnerPayouts.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Actual transferred
          </div>
        </div>

        <div>
          <div className="text-sm text-slate-400">Platform Take Rate</div>
          <div className="text-xl font-semibold text-white mt-1">
            {((breakdown.platformFees.total / breakdown.totalRentalValue) * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Of rental value
          </div>
        </div>
      </div>
    </div>
  );
}
