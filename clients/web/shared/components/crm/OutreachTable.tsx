// src/components/crm/OutreachTable.tsx
"use client";

import { useState } from "react";
import {
  Loader2,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  MessageSquare,
  User,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

type OutreachChannel =
  | "EMAIL"
  | "LINKEDIN"
  | "PHONE"
  | "WHATSAPP"
  | "IN_PERSON"
  | "OTHER";
type OutreachMessageType =
  | "INITIAL"
  | "FOLLOW_UP_1"
  | "FOLLOW_UP_2"
  | "FOLLOW_UP_3"
  | "DEMO_INVITE"
  | "CHECK_IN";

export function OutreachTable() {
  const [channelFilter, setChannelFilter] = useState<
    OutreachChannel | undefined
  >();
  const [respondedFilter, setRespondedFilter] = useState<boolean | undefined>();
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Fetch outreach logs
  // const { data, isLoading, refetch } = api.crm.getOutreachLogs.useQuery({
  //   channel: channelFilter,
  //   responded: respondedFilter,
  //   dateFrom: dateFrom ? new Date(dateFrom) : undefined,
  //   dateTo: dateTo ? new Date(dateTo) : undefined,
  //   limit: 100,
  // });

  const data = {};
  const isLoading = false;
  const refetch = () => {};

  // Fetch stats
  // const { data: stats } = api.crm.getOutreachStats.useQuery({});
  const stats = {
    totalOutreach: 0,
    byChannel:{ EMAIL:'AS',PHONE:'0'}
  };
  // Update outreach mutation
  // const updateOutreach = api.crm.updateOutreach.useMutation({
  //   onSuccess: () => {
  //     toast.success("Outreach updated");
  //     refetch();
  //   },
  //   onError: () => {
  //     toast.error("Failed to update outreach");
  //   },
  // });
  const updateOutreach = () => {};

  const handleUpdateField = (
    id: string,
    field: "responded" | "responseDate" | "responseSummary",
    value: any
  ) => {
    updateOutreach.mutate({ id, [field]: value });
  };

  const getChannelIcon = (channel: OutreachChannel) => {
    switch (channel) {
      case "EMAIL":
        return <Mail className="h-4 w-4" />;
      case "PHONE":
        return <Phone className="h-4 w-4" />;
      case "LINKEDIN":
        return <ExternalLink className="h-4 w-4" />;
      case "WHATSAPP":
        return <MessageSquare className="h-4 w-4" />;
      case "IN_PERSON":
        return <User className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getChannelColor = (channel: OutreachChannel) => {
    switch (channel) {
      case "EMAIL":
        return "text-blue-400";
      case "PHONE":
        return "text-green-400";
      case "LINKEDIN":
        return "text-purple-400";
      case "WHATSAPP":
        return "text-yellow-400";
      case "IN_PERSON":
        return "text-orange-400";
      default:
        return "text-slate-400";
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const logs = data?.outreachLogs || [];

  return (
    <div className="flex-1 overflow-hidden p-6 space-y-6 flex flex-col">
      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Total Outreach</p>
          <p className="text-2xl font-bold text-white">
            {stats?.totalOutreach || 0}
          </p>
        </div>
        <div className="rounded-lg border border-blue-700 bg-blue-900/20 p-4">
          <p className="text-sm text-blue-400">Emails Sent</p>
          <p className="text-2xl font-bold text-blue-400">
            {stats?.byChannel.EMAIL || 0}
          </p>
        </div>
        <div className="rounded-lg border border-green-700 bg-green-900/20 p-4">
          <p className="text-sm text-green-400">Calls Made</p>
          <p className="text-2xl font-bold text-green-400">
            {stats?.byChannel.PHONE || 0}
          </p>
        </div>
        <div className="rounded-lg border border-emerald-700 bg-emerald-900/20 p-4">
          <p className="text-sm text-emerald-400">Response Rate</p>
          <p className="text-2xl font-bold text-emerald-400">
            {stats?.totalOutreach ? Math.round(stats.responseRate) : 0}%
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <select
          value={channelFilter || ""}
          onChange={(e) =>
            setChannelFilter((e.target.value as OutreachChannel) || undefined)
          }
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Channels</option>
          <option value="EMAIL">Email</option>
          <option value="PHONE">Phone</option>
          <option value="LINKEDIN">LinkedIn</option>
          <option value="WHATSAPP">WhatsApp</option>
          <option value="IN_PERSON">In Person</option>
          <option value="OTHER">Other</option>
        </select>

        <select
          value={
            respondedFilter === undefined ? "" : respondedFilter.toString()
          }
          onChange={(e) =>
            setRespondedFilter(
              e.target.value === "" ? undefined : e.target.value === "true"
            )
          }
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Responses</option>
          <option value="true">Responded</option>
          <option value="false">No Response</option>
        </select>

        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          placeholder="From Date"
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          placeholder="To Date"
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {(channelFilter ||
          respondedFilter !== undefined ||
          dateFrom ||
          dateTo) && (
          <button
            onClick={() => {
              setChannelFilter(undefined);
              setRespondedFilter(undefined);
              setDateFrom("");
              setDateTo("");
            }}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden rounded-lg border border-slate-700 bg-slate-800 shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <MessageSquare className="h-12 w-12 text-slate-600 mb-3" />
            <p className="text-lg font-medium text-white">
              No outreach logs found
            </p>
            <p className="text-slate-400 mt-1">
              {channelFilter ||
              respondedFilter !== undefined ||
              dateFrom ||
              dateTo
                ? "Try adjusting your filters"
                : 'Click "Log Outreach" to get started'}
            </p>
          </div>
        ) : (
          <div className="h-full overflow-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-900/50 sticky top-0 z-10">
                <tr>
                  <th className="w-8 px-2 py-3 border-b border-slate-700"></th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap min-w-[120px]">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap min-w-[150px]">
                    Lead
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap min-w-[180px]">
                    Company
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap min-w-[120px]">
                    Channel
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap min-w-[140px]">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap min-w-[200px]">
                    Subject
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap min-w-[110px]">
                    Responded?
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap min-w-[140px]">
                    Response Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap min-w-[250px]">
                    Response Summary
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-700">
                {logs.map((log) => (
                  <>
                    <tr
                      key={log.id}
                      className={`transition-colors hover:bg-slate-700/50 ${
                        log.responded ? "bg-emerald-900/10" : ""
                      }`}
                    >
                      {/* Expand Button */}
                      <td className="px-2 py-2 border-r border-slate-700">
                        <button
                          onClick={() =>
                            setExpandedRow(
                              expandedRow === log.id ? null : log.id
                            )
                          }
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          {expandedRow === log.id ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-2 text-sm text-slate-300 border-r border-slate-700">
                        {formatDate(log.createdAt)}
                      </td>

                      {/* Lead Name - Clickable Link */}
                      <td className="px-4 py-2 border-r border-slate-700">
                        <button
                          onClick={() => {
                            // TODO: Navigate to lead or open modal
                            toast.info("Lead details coming soon");
                          }}
                          className="text-sm text-purple-400 hover:text-purple-300 hover:underline transition-colors"
                        >
                          {log.lead?.name || "Unknown"}
                        </button>
                      </td>

                      {/* Company */}
                      <td className="px-4 py-2 text-sm text-slate-300 border-r border-slate-700">
                        {log.lead?.company || "-"}
                      </td>

                      {/* Channel */}
                      <td className="px-4 py-2 border-r border-slate-700">
                        <div
                          className={`flex items-center gap-2 ${getChannelColor(
                            log.channel
                          )}`}
                        >
                          {getChannelIcon(log.channel)}
                          <span className="text-sm">
                            {log.channel.replace("_", " ")}
                          </span>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-2 text-sm text-slate-300 border-r border-slate-700">
                        {log.messageType.replace(/_/g, " ")}
                      </td>

                      {/* Subject */}
                      <td className="px-4 py-2 text-sm text-slate-300 border-r border-slate-700">
                        <div className="truncate max-w-[200px]">
                          {log.subject || "-"}
                        </div>
                      </td>

                      {/* Responded - Inline Editable Checkbox */}
                      <td className="px-4 py-2 border-r border-slate-700">
                        <input
                          type="checkbox"
                          checked={log.responded}
                          onChange={(e) =>
                            handleUpdateField(
                              log.id,
                              "responded",
                              e.target.checked
                            )
                          }
                          disabled={updateOutreach.isPending}
                          className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-600 focus:ring-2 focus:ring-emerald-500 cursor-pointer disabled:opacity-50"
                        />
                      </td>

                      {/* Response Date - Inline Editable */}
                      <td className="px-4 py-2 border-r border-slate-700">
                        <input
                          type="date"
                          value={
                            log.responseDate
                              ? new Date(log.responseDate)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            handleUpdateField(
                              log.id,
                              "responseDate",
                              e.target.value ? new Date(e.target.value) : null
                            )
                          }
                          disabled={updateOutreach.isPending}
                          className="w-full px-2 py-1 bg-slate-900 border border-slate-600 rounded text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                        />
                      </td>

                      {/* Response Summary - Inline Editable */}
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={log.responseSummary || ""}
                          onChange={(e) =>
                            handleUpdateField(
                              log.id,
                              "responseSummary",
                              e.target.value || null
                            )
                          }
                          disabled={updateOutreach.isPending}
                          placeholder="Add response summary..."
                          className="w-full px-2 py-1 bg-slate-900 border border-slate-600 rounded text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                        />
                      </td>
                    </tr>

                    {/* Expanded Row - Message Content */}
                    {expandedRow === log.id && (
                      <tr className="bg-slate-800/50">
                        <td colSpan={10} className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-slate-300 mb-2">
                                  Message Content:
                                </h4>
                                <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                                  <p className="text-sm text-slate-300 whitespace-pre-wrap">
                                    {log.messageContent ||
                                      "No message content recorded"}
                                  </p>
                                </div>
                              </div>
                              {log.sentBy && (
                                <div className="ml-4 text-xs text-slate-500">
                                  Sent by: {log.sentBy}
                                </div>
                              )}
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

      {!isLoading && logs.length > 0 && (
        <div className="text-sm text-slate-400 text-center">
          Showing {logs.length} of {data?.total || 0} outreach logs
        </div>
      )}
    </div>
  );
}
