// src/app/spaces/active-campaigns/page.tsx
"use client";

import {
  Camera,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import Link from "next/link";
import useOwnerActiveBookings from "@/shared/hooks/api/getters/useOwnerActiveBookings/useOwnerActiveBookings";

export default function ActiveCampaignsPage() {
  const { bookings, isLoading } = useOwnerActiveBookings();
  if (isLoading) {
    return (
      <div className="h-full w-full p-4">
        <div className="h-full bg-slate-900 border border-slate-800 rounded-xl shadow-xl flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-green-500" />
            <p className="text-sm text-slate-400">
              Loading active campaigns...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const activeBookings = bookings?.filter((b) => b.nextVerificationDue) ?? [];
  const noVerificationNeeded =
    bookings?.filter((b) => !b.nextVerificationDue) ?? [];

  return (
    <div className="h-full w-full p-4">
      <div className="h-full bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-6 border-b border-slate-700">
          <h1 className="text-3xl font-bold text-white">Active Campaigns</h1>
          <p className="text-slate-400 mt-2">
            {bookings?.length || 0} active campaign
            {bookings?.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Campaigns requiring verification */}
          {activeBookings.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                Requires Verification
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {activeBookings.map((booking) => {
                  const schedule = booking.verificationSchedule as any;
                  const hasVerifications = schedule?.checkpoints?.length > 0;

                  let verificationStatus = "none";
                  let statusColor = "gray";
                  let statusText = "No verification required";
                  let daysUntilDue = 0;

                  if (hasVerifications && booking.nextVerificationDue) {
                    const dueDate = new Date(booking.nextVerificationDue);
                    daysUntilDue = differenceInDays(dueDate, new Date());

                    if (daysUntilDue < 0) {
                      verificationStatus = "overdue";
                      statusColor = "red";
                      statusText = `Overdue by ${Math.abs(daysUntilDue)} day${
                        Math.abs(daysUntilDue) !== 1 ? "s" : ""
                      }`;
                    } else if (daysUntilDue <= 3) {
                      verificationStatus = "due-soon";
                      statusColor = "yellow";
                      statusText = `Due in ${daysUntilDue} day${
                        daysUntilDue !== 1 ? "s" : ""
                      }`;
                    } else {
                      verificationStatus = "upcoming";
                      statusColor = "green";
                      statusText = `Due ${format(dueDate, "MMM d, yyyy")}`;
                    }
                  }

                  return (
                    <div
                      key={booking.id}
                      className={`bg-slate-800 border-2 rounded-xl p-6 shadow-lg transition-all ${
                        verificationStatus === "overdue"
                          ? "border-red-500/50 bg-red-500/5"
                          : verificationStatus === "due-soon"
                          ? "border-yellow-500/50 bg-yellow-500/5"
                          : "border-slate-700"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-white">
                            {booking.space.title}
                          </h3>
                          <p className="text-sm text-slate-400">
                            {booking.campaign.name}
                          </p>
                        </div>
                        {booking.campaign.imageUrl && (
                          <img
                            src={booking.campaign.imageUrl}
                            alt="Campaign"
                            className="w-16 h-16 object-cover rounded-lg border border-slate-600 ml-4"
                          />
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                          <span className="text-slate-300">
                            {format(booking.startDate, "MMM d")} -{" "}
                            {format(booking.endDate, "MMM d, yyyy")}
                          </span>
                        </div>

                        {hasVerifications && (
                          <>
                            <div
                              className={`flex items-center text-sm p-3 rounded-lg border ${
                                verificationStatus === "overdue"
                                  ? "bg-red-500/10 border-red-500/20"
                                  : verificationStatus === "due-soon"
                                  ? "bg-yellow-500/10 border-yellow-500/20"
                                  : "bg-green-500/10 border-green-500/20"
                              }`}
                            >
                              {verificationStatus === "overdue" ? (
                                <AlertCircle className="h-4 w-4 mr-2 text-red-400 flex-shrink-0" />
                              ) : verificationStatus === "due-soon" ? (
                                <Clock className="h-4 w-4 mr-2 text-yellow-400 flex-shrink-0" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-2 text-green-400 flex-shrink-0" />
                              )}
                              <span
                                className={`font-medium ${
                                  verificationStatus === "overdue"
                                    ? "text-red-300"
                                    : verificationStatus === "due-soon"
                                    ? "text-yellow-300"
                                    : "text-green-300"
                                }`}
                              >
                                {statusText}
                              </span>
                            </div>

                            <div className="text-xs text-slate-500">
                              Completed:{" "}
                              {
                                schedule.checkpoints.filter(
                                  (cp: any) => cp.completed
                                ).length
                              }{" "}
                              / {schedule.checkpoints.length} verifications
                            </div>
                          </>
                        )}
                      </div>

                      {hasVerifications && booking.nextVerificationDue && (
                        <Link
                          href={`/bookings/${booking.id}/verify`}
                          className={`mt-4 w-full py-2.5 rounded-lg flex items-center justify-center font-medium transition-all ${
                            verificationStatus === "overdue" ||
                            verificationStatus === "due-soon"
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600"
                          }`}
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Upload Verification Photo
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Campaigns not requiring verification */}
          {noVerificationNeeded.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">
                Running (No Verification Needed)
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {noVerificationNeeded.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg hover:border-slate-600 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-white">
                          {booking.space.title}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {booking.campaign.name}
                        </p>
                      </div>
                      {booking.campaign.imageUrl && (
                        <img
                          src={booking.campaign.imageUrl}
                          alt="Campaign"
                          className="w-16 h-16 object-cover rounded-lg border border-slate-600 ml-4"
                        />
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                        <span className="text-slate-300">
                          {format(booking.startDate, "MMM d")} -{" "}
                          {format(booking.endDate, "MMM d, yyyy")}
                        </span>
                      </div>

                      <div className="flex items-center text-sm p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                        <span className="font-medium text-green-300">
                          No verification required (≤30 days)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {bookings?.length === 0 && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center shadow-lg">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-700 mx-auto mb-4">
                <Calendar className="h-7 w-7 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                No Active Campaigns
              </h3>
              <p className="text-slate-400">
                Your active campaigns will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
