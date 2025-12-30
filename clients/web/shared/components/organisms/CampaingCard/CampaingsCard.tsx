"use client";

import { Eye, Calendar, MapPin, AlertCircle, ChevronDown } from "lucide-react";
import { Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import Links from "../../atoms/Links/Links";
import Link from "next/link";

const statConfigs = [
  { key: "pending" as const, label: "pending approval", color: "text-yellow-400" },
  { key: "awaitingPayment" as const, label: "awaiting payment", color: "text-blue-400" },
  { key: "active" as const, label: "active", color: "text-green-400" },
  { key: "rejected" as const, label: "rejected", color: "text-red-400" },
] as const;

const getStatusBadge = (status: string) => {
  switch (status) {
    case "PENDING_APPROVAL":
      return (
        <span className="inline-flex items-center rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-0.5 text-xs font-medium text-yellow-400">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </span>
      );
    case "APPROVED":
      return (
        <span className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400">
          <CheckCircle className="mr-1 h-3 w-3" />
          Approved
        </span>
      );
    case "CONFIRMED":
    case "PENDING_BALANCE":
    case "ACTIVE":
      return (
        <span className="inline-flex items-center rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-400">
          <TrendingUp className="mr-1 h-3 w-3" />
          Active
        </span>
      );
    case "COMPLETED":
      return (
        <span className="inline-flex items-center rounded-full border border-slate-500/20 bg-slate-500/10 px-2.5 py-0.5 text-xs font-medium text-slate-400">
          <CheckCircle className="mr-1 h-3 w-3" />
          Completed
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400">
          <XCircle className="mr-1 h-3 w-3" />
          Rejected
        </span>
      );
    case "CANCELLED":
      return (
        <span className="inline-flex items-center rounded-full border border-slate-500/20 bg-slate-500/10 px-2.5 py-0.5 text-xs font-medium text-slate-400">
          <XCircle className="mr-1 h-3 w-3" />
          Cancelled
        </span>
      );
    default:
      return null;
  }
};

function CampaingsCard({ campaign, stats, toggleExpanded, campaignBookings, isExpanded }) {
  return (
    <div
      className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800 transition-colors hover:border-slate-600"
    >
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="mb-1 text-2xl font-bold text-white">{campaign.name}</h3>
            {campaign.description && (
              <p className="mb-3 line-clamp-2 text-sm text-slate-400">{campaign.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-slate-500">
              {campaign.startDate && campaign.endDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                    {new Date(campaign.endDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>
                  {stats.total} {stats.total === 1 ? "Location" : "Locations"}
                </span>
              </div>
            </div>
          </div>
          <Links
            label="View Details"
            icon={Eye}
            href={`/campaigns/${campaign.id}`}
            variant="shadow"
          />
        </div>

        {/* Compact Stats Bar */}
        <div className="flex items-center gap-6 border-t border-slate-700 py-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Spaces:</span>
            <span className="font-semibold text-white">{stats.total}</span>
          </div>

          {statConfigs.map(
            ({ key, label, color }) =>
              stats[key] > 0 && (
                <div key={key} className="flex items-center gap-2">
                  <span className={color}>●</span>
                  <span className="text-slate-300">
                    {stats[key]} {label}
                  </span>
                </div>
              )
          )}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-slate-400">Total:</span>
            <span className="font-semibold text-blue-400">
              ${stats.totalSpend.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Collapsible Bookings */}
        {campaignBookings.length > 0 && (
          <div className="border-t border-slate-700 pt-4">
            <button
              onClick={() => toggleExpanded(campaign.id)}
              className="group flex w-full items-center justify-between text-left transition-colors hover:text-white"
            >
              <span className="font-semibold text-slate-300 group-hover:text-white">
                {campaignBookings.length} {campaignBookings.length === 1 ? "Booking" : "Bookings"}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
              />
            </button>

            {isExpanded && (
              <div className="mt-3 space-y-2">
                {campaignBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between rounded-lg bg-slate-900/50 p-3 transition-colors hover:bg-slate-900"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <MapPin className="h-4 w-4 flex-shrink-0 text-slate-500" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-white">{booking.space.title}</p>
                        <p className="text-sm text-slate-400">
                          {booking.space.city}, {booking.space.state}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-white">
                          ${booking.totalAmount.toString()}
                        </div>
                        <div className="text-xs text-slate-500">{booking.totalDays} days</div>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Compact Action Alert - ONLY for APPROVED status */}
        {stats.awaitingPayment > 0 && (
          <div className="mt-4 flex items-center justify-between rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-blue-400" />
              <span className="text-sm text-blue-300">
                {stats.awaitingPayment} {stats.awaitingPayment === 1 ? "space" : "spaces"} awaiting
                payment
              </span>
            </div>
            <Link
              href={`/campaigns/${campaign.id}`}
              className="text-sm font-medium whitespace-nowrap text-blue-400 hover:text-blue-300"
            >
              Complete Payment →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default CampaingsCard;
