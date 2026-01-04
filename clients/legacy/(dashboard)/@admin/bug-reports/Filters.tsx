"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { BugCategory, BugSeverity, BugStatus } from "@prisma/client";
import { Filter } from "lucide-react";

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedStatus = searchParams.get("status") as BugStatus | undefined;
  const selectedSeverity = searchParams.get("severity") as BugSeverity | undefined;
  const selectedCategory = searchParams.get("category") as BugCategory | undefined;

  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="border-b border-slate-800 bg-slate-900/20 px-8 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <Filter className="h-4 w-4 text-slate-400" />

        {/* Status Filter */}
        <select
          value={selectedStatus ?? ""}
          onChange={(e) => updateFilter("status", e.target.value || undefined)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="NEW">New</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="FIXED">Fixed</option>
          <option value="WONT_FIX">Won&apos;t Fix</option>
          <option value="DUPLICATE">Duplicate</option>
        </select>

        {/* Severity Filter */}
        <select
          value={selectedSeverity ?? ""}
          onChange={(e) => updateFilter("severity", e.target.value || undefined)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Severities</option>
          <option value="CRITICAL">🔴 Critical</option>
          <option value="HIGH">🟡 High</option>
          <option value="MEDIUM">🟢 Medium</option>
          <option value="LOW">🔵 Low</option>
        </select>

        {/* Category Filter */}
        <select
          value={selectedCategory ?? ""}
          onChange={(e) => updateFilter("category", e.target.value || undefined)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option value="UI_UX">UI/UX</option>
          <option value="PAYMENT">Payment</option>
          <option value="MESSAGING">Messaging</option>
          <option value="AUTHENTICATION">Authentication</option>
          <option value="BOOKING">Booking</option>
          <option value="SPACE_MANAGEMENT">Space Management</option>
          <option value="CAMPAIGN">Campaign</option>
          <option value="NOTIFICATIONS">Notifications</option>
          <option value="PERFORMANCE">Performance</option>
          <option value="DATA_INTEGRITY">Data Integrity</option>
          <option value="OTHER">Other</option>
        </select>

        {/* Clear Filters */}
        {(selectedStatus ?? selectedSeverity ?? selectedCategory) && (
          <button
            onClick={() => router.push("?")}
            className="px-3 py-1.5 text-sm text-slate-400 transition-colors hover:text-white"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
