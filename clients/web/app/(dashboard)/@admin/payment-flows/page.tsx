"use client";

import { useState } from "react";
import { api } from "../../../../../elaview-mvp/src/trpc/react";
import { format, formatDistanceToNow } from "date-fns";
import { Loader2, MessageCircle } from "lucide-react";
import PayoutSchedulePanel from "./payoutSchedulePanel";
import SummaryCard from "./summaryCard";
import TimelineModal from "./timelineModal";
import UserDetailModal from "./userDetailModal";

type BookingStatus =
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "CONFIRMED"
  | "PENDING_BALANCE"
  | "ACTIVE"
  | "AWAITING_PROOF"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED"
  | "DISPUTED";

type PayoutStatus =
  | "PENDING"
  | "PROCESSING"
  | "PARTIALLY_PAID"
  | "COMPLETED"
  | "FAILED";

export default function PaymentFlowsPage() {
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | "ALL">(
    "ALL"
  );
  const [selectedPayoutStatus, setSelectedPayoutStatus] = useState<
    PayoutStatus | "ALL" | undefined
  >(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [testingWhatsApp, setTestingWhatsApp] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string | null;
    email: string;
    phone?: string | null;
    role: "advertiser" | "owner";
  } | null>(null);

  // Fetch payment flows
  const { data, isLoading, refetch } =
    api.admin.finance.getAllPaymentFlows.useQuery(
      {
        status: selectedStatus,
        payoutStatus: selectedPayoutStatus,
        search: searchQuery || undefined,
        limit: 100,
        offset: 0,
      },
      {
        refetchInterval: autoRefresh ? 5000 : false, // Auto-refresh every 5 seconds
      }
    );

  // Fetch timeline for selected flow
  const { data: timelineData } =
    api.admin.finance.getPaymentFlowTimeline.useQuery(
      { bookingId: selectedFlowId! },
      { enabled: !!selectedFlowId }
    );

  const flows = data?.flows ?? [];
  const summary = data?.summary;

  // Manual intervention mutations
  const approveBooking = api.admin.bookings.manualApproveBooking.useMutation({
    onSuccess: () => {
      void refetch();
      alert("Booking approved successfully");
    },
    onError: (error) => {
      alert(`Failed to approve booking: ${error.message}`);
    },
  });

  const rejectBooking = api.admin.bookings.manualRejectBooking.useMutation({
    onSuccess: () => {
      void refetch();
      alert("Booking rejected successfully");
    },
    onError: (error) => {
      alert(`Failed to reject booking: ${error.message}`);
    },
  });

  const approveProof = api.admin.bookings.manualApproveProof.useMutation({
    onSuccess: () => {
      void refetch();
      alert("Proof approved and payouts processed");
    },
    onError: (error) => {
      alert(`Failed to approve proof: ${error.message}`);
    },
  });

  const issueRefund = api.admin.finance.manualIssueRefund.useMutation({
    onSuccess: () => {
      void refetch();
      alert("Refund issued successfully");
    },
    onError: (error) => {
      alert(`Failed to issue refund: ${error.message}`);
    },
  });

  const retryPayout = api.admin.finance.manualRetryPayout.useMutation({
    onSuccess: () => {
      void refetch();
      alert("Payout retry successful");
    },
    onError: (error) => {
      alert(`Failed to retry payout: ${error.message}`);
    },
  });

  // Action handlers
  const handleApproveBooking = (flowId: string) => {
    if (
      confirm(
        "Approve this booking? This will override the space owner's approval."
      )
    ) {
      const notes = prompt("Add admin notes (optional):");
      approveBooking.mutate({ bookingId: flowId, notes: notes ?? undefined });
    }
  };

  const handleRejectBooking = (flowId: string) => {
    const reason = prompt("Enter rejection reason:");
    if (reason) {
      rejectBooking.mutate({ bookingId: flowId, reason });
    }
  };

  const handleApproveProof = (flowId: string, _spaceOwnerAmount: number) => {
    if (
      confirm(
        `Approve proof and process payouts? First payout will be initiated immediately.`
      )
    ) {
      const notes = prompt("Add admin notes (optional):");
      approveProof.mutate({ bookingId: flowId, notes: notes ?? undefined });
    }
  };

  const handleIssueRefund = (flowId: string, totalAmount: number) => {
    const amountStr = prompt(
      `Enter refund amount (max: $${totalAmount.toFixed(2)}):`
    );
    if (amountStr) {
      const amount = parseFloat(amountStr);
      if (isNaN(amount) || amount <= 0 || amount > totalAmount) {
        alert("Invalid refund amount");
        return;
      }
      const reason = prompt("Enter refund reason:");
      if (reason) {
        issueRefund.mutate({ bookingId: flowId, amount, reason });
      }
    }
  };

  const handleRetryPayout = (flowId: string) => {
    if (confirm("Retry failed payout?")) {
      retryPayout.mutate({ bookingId: flowId });
    }
  };

  // Status badge colors
  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "PENDING_APPROVAL":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "APPROVED":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "CONFIRMED":
      case "ACTIVE":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "PENDING_BALANCE":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "AWAITING_PROOF":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "COMPLETED":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "CANCELLED":
      case "REJECTED":
        return "bg-slate-700 text-slate-400 border-slate-600";
      case "DISPUTED":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-slate-700 text-slate-400 border-slate-600";
    }
  };

  const getPayoutStatusColor = (status: PayoutStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-300";
      case "PROCESSING":
        return "bg-blue-500/20 text-blue-300";
      case "PARTIALLY_PAID":
        return "bg-orange-500/20 text-orange-300";
      case "COMPLETED":
        return "bg-green-500/20 text-green-300";
      case "FAILED":
        return "bg-red-500/20 text-red-300";
      default:
        return "bg-slate-700 text-slate-400";
    }
  };

  // Alert detection
  const hasAlert = (flow: (typeof flows)[0]) => {
    return !!(
      (flow.balanceChargeError ??
        flow.payoutError ??
        flow.proofStatus === "DISPUTED") ||
      flow.proofStatus === "REJECTED" ||
      flow.status === "DISPUTED"
    );
  };

  return (
    <>
      <div className="h-full w-full p-4">
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
          {/* Header - Fixed */}
          <div className="shrink-0 border-b border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Payment Flow Tracking
                </h1>
                <p className="mt-2 text-slate-400">
                  Real-time monitoring of all payment flows, bookings, and
                  payouts
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={async () => {
                    try {
                      setTestingWhatsApp(true);

                      // Call API route instead of client-side function
                      const response = await fetch("/api/test-whatsapp", {
                        method: "POST",
                      });

                      const result = (await response.json()) as {
                        success: boolean;
                        message: string;
                      };

                      if (result.success) {
                        alert("✅ " + result.message);
                      } else {
                        alert(
                          "❌ " +
                            result.message +
                            "\n\nCheck browser console for details."
                        );
                        console.error("WhatsApp test failed:", result);
                      }
                    } catch (error) {
                      alert(
                        "❌ WhatsApp test failed: " +
                          (error instanceof Error
                            ? error.message
                            : "Unknown error")
                      );
                      console.error("WhatsApp test error:", error);
                    } finally {
                      setTestingWhatsApp(false);
                    }
                  }}
                  disabled={testingWhatsApp}
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:bg-slate-700"
                >
                  {testingWhatsApp ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-4 w-4" />
                      Test WhatsApp
                    </>
                  )}
                </button>
                <button
                  onClick={() => void refetch()}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 shadow-sm hover:bg-slate-700"
                >
                  🔄 Refresh Now
                </button>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium shadow-sm ${
                    autoRefresh
                      ? "border-green-500/30 bg-green-500/10 text-green-400"
                      : "border-slate-700 bg-slate-800 text-slate-400"
                  }`}
                >
                  {autoRefresh ? "✅ Auto-refresh (5s)" : "⏸️ Auto-refresh OFF"}
                </button>
              </div>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            {/* Payout Schedule Panel */}
            <PayoutSchedulePanel />

            {/* Summary Cards */}
            {summary && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                <SummaryCard
                  title="Total Bookings"
                  value={summary.totalBookings}
                  color="bg-slate-800 border-slate-700"
                />
                <SummaryCard
                  title="Pending Approval"
                  value={summary.pendingApproval}
                  color="bg-slate-800 border-slate-700"
                  alert={summary.pendingApproval > 0}
                />
                <SummaryCard
                  title="Active"
                  value={summary.active}
                  color="bg-slate-800 border-slate-700"
                />
                <SummaryCard
                  title="Awaiting Proof"
                  value={summary.awaitingProof}
                  color="bg-slate-800 border-slate-700"
                  alert={summary.awaitingProof > 0}
                />
                <SummaryCard
                  title="Disputed"
                  value={summary.disputed}
                  color="bg-slate-800 border-slate-700"
                  alert={summary.disputed > 0}
                />
                <SummaryCard
                  title="Completed"
                  value={summary.completed}
                  color="bg-slate-800 border-slate-700"
                />

                {/* Financial Summary */}
                <div className="col-span-2 mt-4 grid grid-cols-2 gap-4 md:col-span-4 md:grid-cols-4 lg:col-span-6">
                  <SummaryCard
                    title="Total Revenue"
                    value={`$${summary.totalRevenue.toFixed(2)}`}
                    color="bg-slate-800 border-slate-700"
                  />
                  <SummaryCard
                    title="Platform Fees"
                    value={`$${summary.totalPlatformFees.toFixed(2)}`}
                    color="bg-slate-800 border-slate-700"
                  />
                  <SummaryCard
                    title="Stripe Fees"
                    value={`$${summary.totalStripeFees.toFixed(2)}`}
                    color="bg-slate-800 border-slate-700"
                  />
                  <SummaryCard
                    title="Owner Payouts"
                    value={`$${summary.totalOwnerPayouts.toFixed(2)}`}
                    color="bg-slate-800 border-slate-700"
                  />
                </div>

                {/* Alerts */}
                {(summary.failedPayments > 0 || summary.failedPayouts > 0) && (
                  <div className="col-span-2 mt-4 grid grid-cols-2 gap-4 md:col-span-4 lg:col-span-6">
                    {summary.failedPayments > 0 && (
                      <SummaryCard
                        title="Failed Payments"
                        value={summary.failedPayments}
                        color="bg-red-500/10 border-red-500/30"
                        alert
                      />
                    )}
                    {summary.failedPayouts > 0 && (
                      <SummaryCard
                        title="Failed Payouts"
                        value={summary.failedPayouts}
                        color="bg-red-500/10 border-red-500/30"
                        alert
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Filters */}
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 shadow-sm">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Status Filter */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Booking Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) =>
                      setSelectedStatus(e.target.value as BookingStatus | "ALL")
                    }
                    className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING_APPROVAL">Pending Approval</option>
                    <option value="APPROVED">Approved</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PENDING_BALANCE">Pending Balance</option>
                    <option value="ACTIVE">Active</option>
                    <option value="AWAITING_PROOF">Awaiting Proof</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="DISPUTED">Disputed</option>
                  </select>
                </div>

                {/* Payout Status Filter */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Payout Status
                  </label>
                  <select
                    value={selectedPayoutStatus ?? "ALL"}
                    onChange={(e) =>
                      setSelectedPayoutStatus(
                        e.target.value === "ALL"
                          ? undefined
                          : (e.target.value as PayoutStatus)
                      )
                    }
                    className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">All Payout Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="PARTIALLY_PAID">Partially Paid</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>

                {/* Search */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Search
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Campaign, space, user..."
                    className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Flows Table */}
            <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800 shadow-sm">
              {isLoading ? (
                <div className="p-12 text-center text-slate-400">
                  <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin" />
                  Loading payment flows...
                </div>
              ) : flows.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  No payment flows found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-slate-700 bg-slate-900/50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-slate-300">
                          Alert
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-slate-300">
                          Booking ID
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-slate-300">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-slate-300">
                          Campaign
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-slate-300">
                          Space
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-slate-300">
                          Advertiser
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-slate-300">
                          Owner
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-slate-300">
                          Dates
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-slate-300">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-slate-300">
                          Payment
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-slate-300">
                          Payout
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-slate-300">
                          Created
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-slate-300">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {flows.map((flow) => (
                        <tr
                          key={flow.id}
                          className={`cursor-pointer hover:bg-slate-700/50 ${
                            hasAlert(flow) ? "bg-red-500/10" : ""
                          }`}
                          onClick={() => setSelectedFlowId(flow.id)}
                        >
                          {/* Alert Indicator */}
                          <td className="px-4 py-3">
                            {hasAlert(flow) && (
                              <span className="text-lg text-red-400">⚠️</span>
                            )}
                          </td>

                          {/* Booking ID */}
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs text-slate-400">
                              {flow.id.slice(0, 8)}...
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${getStatusColor(
                                flow.status
                              )}`}
                            >
                              {flow.status}
                            </span>
                          </td>

                          {/* Campaign */}
                          <td className="px-4 py-3">
                            <div className="max-w-37.5 truncate text-white">
                              {flow.campaignName}
                            </div>
                          </td>

                          {/* Space */}
                          <td className="px-4 py-3">
                            <div className="max-w-37.5 truncate text-white">
                              {flow.spaceTitle}
                            </div>
                          </td>

                          {/* Advertiser */}
                          <td className="px-4 py-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUser({
                                  id: flow.advertiser.id,
                                  name: flow.advertiser.name,
                                  email: flow.advertiser.email,
                                  phone: flow.advertiser.phone,
                                  role: "advertiser",
                                });
                              }}
                              className="max-w-30 truncate text-left font-medium text-blue-400 hover:text-blue-300 hover:underline"
                            >
                              {flow.advertiser.name ?? flow.advertiser.email}
                            </button>
                          </td>

                          {/* Owner */}
                          <td className="px-4 py-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUser({
                                  id: flow.owner.id,
                                  name: flow.owner.name,
                                  email: flow.owner.email,
                                  phone: flow.owner.phone,
                                  role: "owner",
                                });
                              }}
                              className="max-w-30 truncate text-left font-medium text-blue-400 hover:text-blue-300 hover:underline"
                            >
                              {flow.owner.name ?? flow.owner.email}
                            </button>
                          </td>

                          {/* Dates */}
                          <td className="px-4 py-3 text-xs text-slate-400">
                            <div>
                              {format(new Date(flow.startDate), "MMM d")}
                            </div>
                            <div>
                              → {format(new Date(flow.endDate), "MMM d")}
                            </div>
                            <div className="text-slate-500">
                              ({flow.totalDays}d)
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="px-4 py-3 text-right">
                            <div className="font-semibold text-white">
                              ${flow.totalAmount.toFixed(2)}
                            </div>
                            {flow.paymentType === "DEPOSIT" && (
                              <div className="text-xs text-slate-500">
                                Deposit: ${flow.depositAmount?.toFixed(2)}
                              </div>
                            )}
                          </td>

                          {/* Payment Status */}
                          <td className="px-4 py-3">
                            {flow.paidAt ? (
                              <span className="text-xs text-green-400">
                                ✓ Paid
                              </span>
                            ) : flow.depositPaidAt && !flow.balancePaidAt ? (
                              <span className="text-xs text-orange-400">
                                Deposit only
                                {flow.balanceChargeError && (
                                  <div className="mt-1 text-red-400">
                                    ⚠️ Balance failed
                                  </div>
                                )}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-500">
                                Pending
                              </span>
                            )}
                          </td>

                          {/* Payout Status */}
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getPayoutStatusColor(
                                flow.payoutStatus
                              )}`}
                            >
                              {flow.payoutStatus}
                            </span>
                            {flow.payoutError && (
                              <div className="mt-1 text-xs text-red-400">
                                ⚠️ Error
                              </div>
                            )}
                          </td>

                          {/* Created */}
                          <td className="px-4 py-3 text-xs text-slate-400">
                            {formatDistanceToNow(new Date(flow.createdAt), {
                              addSuffix: true,
                            })}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              {/* Approve Booking */}
                              {flow.status === "PENDING_APPROVAL" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApproveBooking(flow.id);
                                  }}
                                  className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
                                  disabled={approveBooking.isPending}
                                >
                                  ✓ Approve
                                </button>
                              )}

                              {/* Reject Booking */}
                              {(flow.status === "PENDING_APPROVAL" ||
                                flow.status === "APPROVED") && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRejectBooking(flow.id);
                                  }}
                                  className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                                  disabled={rejectBooking.isPending}
                                >
                                  ✕ Reject
                                </button>
                              )}

                              {/* Approve Proof */}
                              {(flow.proofStatus === "PENDING" ||
                                flow.proofStatus === "UNDER_REVIEW") && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApproveProof(
                                      flow.id,
                                      flow.spaceOwnerAmount
                                    );
                                  }}
                                  className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                                  disabled={approveProof.isPending}
                                >
                                  ✓ Proof
                                </button>
                              )}

                              {/* Issue Refund */}
                              {(flow.paidAt ?? flow.depositPaidAt) &&
                                !flow.refundProcessedAt && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleIssueRefund(
                                        flow.id,
                                        flow.totalAmount
                                      );
                                    }}
                                    className="rounded bg-yellow-600 px-2 py-1 text-xs text-white hover:bg-yellow-700"
                                    disabled={issueRefund.isPending}
                                  >
                                    💳 Refund
                                  </button>
                                )}

                              {/* Retry Payout - Show for errors OR partially paid status */}
                              {(flow.payoutError ??
                                flow.payoutStatus === "PARTIALLY_PAID") && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRetryPayout(flow.id);
                                  }}
                                  className="rounded bg-purple-600 px-2 py-1 text-xs text-white hover:bg-purple-700"
                                  disabled={retryPayout.isPending}
                                  title={
                                    flow.payoutError
                                      ? "Retry failed payout"
                                      : "Process final payout"
                                  }
                                >
                                  {flow.payoutStatus === "PARTIALLY_PAID"
                                    ? "💰 Final"
                                    : "🔄 Retry"}
                                </button>
                              )}

                              {/* View Details */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedFlowId(flow.id);
                                }}
                                className="text-xs font-medium text-blue-400 hover:text-blue-300"
                              >
                                Details →
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Modal */}
      {selectedFlowId && timelineData && (
        <TimelineModal
          timeline={timelineData}
          onClose={() => setSelectedFlowId(null)}
        />
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  );
}
