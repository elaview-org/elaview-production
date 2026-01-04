// src/app/(admin)/admin/marketing/inbound/page.tsx
"use client";

import { useState } from "react";
import {
  Loader2,
  Search,
  Mail,
  Phone,
  Building,
  Calendar,
  Check,
} from "lucide-react";
import useDemoRequests from "@/shared/hooks/api/getters/useDemoRequests/useDemoRequests";
import useUpdateDemoRequestStatus from "@/shared/hooks/api/actions/useUpdateDemoRequestStatus/useUpdateDemoRequestStatus";
import { formatDateMDYH } from "@/shared/utils/formatDate";

type DemoRequestStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "DEMO_BOOKED"
  | "CLOSED_WON"
  | "CLOSED_LOST";
type DemoRequestPriority = "LOW" | "MEDIUM" | "HIGH";

export default function LeadsManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DemoRequestStatus | "ALL">(
    "ALL"
  );
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState("");

  const { data, isLoading, refetch } = useDemoRequests();
  const { updateStatus, updateDemoRequestById } = useUpdateDemoRequestStatus();

  const handleStatusChange = async (
    id: string,
    newStatus: DemoRequestStatus
  ) => {
    await updateDemoRequestById({ id, status: newStatus });
  };

  const handlePriorityChange = async (
    id: string,
    newPriority: DemoRequestPriority
  ) => {
    const demoRequestData = data?.requests.find((r) => r.id === id)
      ?.status as DemoRequestStatus;
    await updateDemoRequestById({
      id,
      status: demoRequestData,
      priority: newPriority,
    });
  };

  const handleSaveNotes = async (id: string) => {
    if (!notesValue.trim()) return;

    const demoRequestData = data?.requests.find((r) => r.id === id)
      ?.status as DemoRequestStatus;
    await updateDemoRequestById({
      id,
      status: demoRequestData,
      notes: notesValue,
    });

    setEditingNotes(null);
    setNotesValue("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "CONTACTED":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "QUALIFIED":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "DEMO_BOOKED":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "CLOSED_WON":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "CLOSED_LOST":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "MEDIUM":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "LOW":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const requests = data?.requests || [];

  const statusCounts = {
    ALL: requests.length,
    NEW: requests.filter((r) => r.status === "NEW").length,
    CONTACTED: requests.filter((r) => r.status === "CONTACTED").length,
    QUALIFIED: requests.filter((r) => r.status === "QUALIFIED").length,
    DEMO_BOOKED: requests.filter((r) => r.status === "DEMO_BOOKED").length,
    CLOSED_WON: requests.filter((r) => r.status === "CLOSED_WON").length,
    CLOSED_LOST: requests.filter((r) => r.status === "CLOSED_LOST").length,
  };

  return (
    <div className="h-full w-full p-4">
      <div className="h-full bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-6 border-b border-slate-700">
          <h2 className="text-3xl font-bold text-white">Inbound Leads</h2>
          <p className="mt-2 text-slate-400">
            Manage demo requests and inbound inquiries from potential customers
          </p>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
              <p className="text-sm text-slate-400">Total Leads</p>
              <p className="text-2xl font-bold text-white">
                {statusCounts.ALL}
              </p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
              <p className="text-sm text-slate-400">New</p>
              <p className="text-2xl font-bold text-blue-400">
                {statusCounts.NEW}
              </p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
              <p className="text-sm text-slate-400">Qualified</p>
              <p className="text-2xl font-bold text-purple-400">
                {statusCounts.QUALIFIED}
              </p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
              <p className="text-sm text-slate-400">Closed Won</p>
              <p className="text-2xl font-bold text-green-400">
                {statusCounts.CLOSED_WON}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as typeof statusFilter)
              }
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="ALL">All Status ({statusCounts.ALL})</option>
              <option value="NEW">New ({statusCounts.NEW})</option>
              <option value="CONTACTED">
                Contacted ({statusCounts.CONTACTED})
              </option>
              <option value="QUALIFIED">
                Qualified ({statusCounts.QUALIFIED})
              </option>
              <option value="DEMO_BOOKED">
                Demo Booked ({statusCounts.DEMO_BOOKED})
              </option>
              <option value="CLOSED_WON">
                Closed Won ({statusCounts.CLOSED_WON})
              </option>
              <option value="CLOSED_LOST">
                Closed Lost ({statusCounts.CLOSED_LOST})
              </option>
            </select>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-slate-700 bg-slate-800 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center">
                <Loader2 className="h-8 w-8 text-purple-500 animate-spin mx-auto" />
              </div>
            ) : requests.length === 0 ? (
              <div className="p-12 text-center">
                <Mail className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-lg font-medium text-white">
                  No demo requests found
                </p>
                <p className="text-slate-400 mt-1">
                  {searchQuery || statusFilter !== "ALL"
                    ? "Try adjusting your filters"
                    : "Demo requests will appear here"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/50 border-b border-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {requests.map((request) => (
                      <>
                        <tr
                          key={request.id}
                          className="hover:bg-slate-900/50 transition-colors cursor-pointer"
                          onClick={() =>
                            setExpandedRow(
                              expandedRow === request.id ? null : request.id
                            )
                          }
                        >
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-medium text-white">
                                {request.name}
                              </p>
                              <div className="flex items-center gap-1 text-sm text-slate-400 mt-1">
                                <Mail className="h-3 w-3" />
                                {request.email}
                              </div>
                              {request.phone && (
                                <div className="flex items-center gap-1 text-sm text-slate-400">
                                  <Phone className="h-3 w-3" />
                                  {request.phone}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-slate-500" />
                              <span className="font-medium text-white">
                                {request.company}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-slate-400">
                              {request.companySize || "Not specified"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <select
                              value={request.priority}
                              onChange={(e) => {
                                e.stopPropagation();
                                handlePriorityChange(
                                  request.id,
                                  e.target.value as DemoRequestPriority
                                );
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className={`text-xs font-medium px-2 py-1 rounded border ${getPriorityColor(
                                request.priority
                              )} bg-transparent cursor-pointer`}
                            >
                              <option value="LOW">Low</option>
                              <option value="MEDIUM">Medium</option>
                              <option value="HIGH">High</option>
                            </select>
                          </td>
                          <td className="px-4 py-4">
                            <select
                              value={request.status}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleStatusChange(
                                  request.id,
                                  e.target.value as DemoRequestStatus
                                );
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className={`text-xs font-medium px-2 py-1 rounded border ${getStatusColor(
                                request.status
                              )} bg-transparent cursor-pointer`}
                            >
                              <option value="NEW">New</option>
                              <option value="CONTACTED">Contacted</option>
                              <option value="QUALIFIED">Qualified</option>
                              <option value="DEMO_BOOKED">Demo Booked</option>
                              <option value="CLOSED_WON">Closed Won</option>
                              <option value="CLOSED_LOST">Closed Lost</option>
                            </select>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1 text-sm text-slate-400">
                              <Calendar className="h-3 w-3" />
                              {formatDateMDYH(request.createdAt)}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <a
                              href={`mailto:${request.email}?subject=Elaview Demo - ${request.company}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                            >
                              <Mail className="h-3 w-3" />
                              Email
                            </a>
                          </td>
                        </tr>

                        {/* Expanded Row - Details */}
                        {expandedRow === request.id && (
                          <tr className="bg-slate-900/30">
                            <td colSpan={7} className="px-4 py-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                {/* Message */}
                                {request.message && (
                                  <div className="md:col-span-2">
                                    <h4 className="text-sm font-medium text-slate-300 mb-2">
                                      Message
                                    </h4>
                                    <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-300">
                                      {request.message}
                                    </div>
                                  </div>
                                )}

                                {/* Notes */}
                                <div className="md:col-span-2">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-medium text-slate-300">
                                      Internal Notes
                                    </h4>
                                    {editingNotes !== request.id && (
                                      <button
                                        onClick={() => {
                                          setEditingNotes(request.id);
                                          setNotesValue("");
                                        }}
                                        className="text-xs text-purple-400 hover:text-purple-300"
                                      >
                                        Add Note
                                      </button>
                                    )}
                                  </div>

                                  {request.notes && (
                                    <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 mb-2 whitespace-pre-wrap">
                                      {request.notes}
                                    </div>
                                  )}

                                  {editingNotes === request.id && (
                                    <div className="flex gap-2">
                                      <textarea
                                        value={notesValue}
                                        onChange={(e) =>
                                          setNotesValue(e.target.value)
                                        }
                                        placeholder="Add internal notes about this lead..."
                                        rows={3}
                                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                      />
                                      <div className="flex flex-col gap-2">
                                        <button
                                          onClick={() =>
                                            handleSaveNotes(request.id)
                                          }
                                          disabled={!notesValue.trim()}
                                          className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                        >
                                          <Check className="h-4 w-4" />
                                          Save
                                        </button>
                                        <button
                                          onClick={() => {
                                            setEditingNotes(null);
                                            setNotesValue("");
                                          }}
                                          className="px-3 py-1 bg-slate-700 text-white text-sm rounded-lg hover:bg-slate-600 transition-colors"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Metadata */}
                                <div>
                                  <h4 className="text-sm font-medium text-slate-300 mb-2">
                                    Timeline
                                  </h4>
                                  <div className="space-y-1 text-xs text-slate-400">
                                    <div>
                                      Submitted: {formatDateMDYH(request.createdAt)}
                                    </div>
                                    {request.contactedAt && (
                                      <div>
                                        Contacted:{" "}
                                        {formatDateMDYH(request.contactedAt)}
                                      </div>
                                    )}
                                    <div>
                                      Last updated:{" "}
                                      {formatDateMDYH(request.updatedAt)}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-sm font-medium text-slate-300 mb-2">
                                    Source
                                  </h4>
                                  <div className="text-xs text-slate-400">
                                    {request.source}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
