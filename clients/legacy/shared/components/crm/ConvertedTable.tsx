// src/components/crm/ConvertedTable.tsx
"use client";

import { useState } from "react";
// import { api } from "../../../../elaview-mvp/src/trpc/react";
import { Loader2, RefreshCw, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export function ConvertedTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [testimonialFilter, setTestimonialFilter] = useState<
    boolean | undefined
  >();
  const [willingToReferFilter, setWillingToReferFilter] = useState<
    boolean | undefined
  >();

  // Fetch converted leads
  // const { data, isLoading, refetch } = api.crm.getConvertedLeads.useQuery({
  //   search: searchQuery || undefined,
  //   testimonialGiven: testimonialFilter,
  //   willingToRefer: willingToReferFilter,
  //   limit: 100,
  // });
  const data = {};
  const isLoading = false;
  const refetch = () => {};
  // Fetch stats
  // const { data: stats } = api.crm.getConversionStats.useQuery();
const stats = {};
  // Update converted lead mutation
  // const updateConverted = api.crm.updateConvertedLead.useMutation({
  //   onSuccess: () => {
  //     toast.success("Updated");
  //     refetch();
  //   },
  //   onError: () => {
  //     toast.error("Failed to update");
  //   },
  // });
const updateConverted = ()=>{};
  // Sync metrics mutation
  // const syncMetrics = api.crm.syncConvertedMetrics.useMutation({
  //   onSuccess: () => {
  //     toast.success("Metrics synced from platform");
  //     refetch();
  //   },
  //   onError: (error) => {
  //     toast.error(error.message || "Failed to sync metrics");
  //   },
  // });
const syncMetrics = ()=>{};

  const handleUpdateField = (id: string, field: string, value: any) => {
    updateConverted.mutate({ id, [field]: value } as any);
  };

  const formatCurrency = (amount: any) => {
    const num =
      typeof amount === "number"
        ? amount
        : parseFloat(amount?.toString() || "0");
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const leads = data?.convertedLeads || [];

  return (
    <div className="flex-1 overflow-hidden p-6 space-y-6 flex flex-col">
      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-6">
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Total Converted</p>
          <p className="text-2xl font-bold text-white">
            {stats?.totalConverted || 0}
          </p>
        </div>
        <div className="rounded-lg border border-emerald-700 bg-emerald-900/20 p-4">
          <p className="text-sm text-emerald-400">Conversion Rate</p>
          <p className="text-2xl font-bold text-emerald-400">
            {stats?.conversionRate || "0.0"}%
          </p>
        </div>
        <div className="rounded-lg border border-blue-700 bg-blue-900/20 p-4">
          <p className="text-sm text-blue-400">Total Revenue</p>
          <p className="text-2xl font-bold text-blue-400">
            {formatCurrency(stats?.totalRevenue || 0)}
          </p>
        </div>
        <div className="rounded-lg border border-purple-700 bg-purple-900/20 p-4">
          <p className="text-sm text-purple-400">Avg Revenue</p>
          <p className="text-2xl font-bold text-purple-400">
            {formatCurrency(stats?.avgRevenuePerCustomer || 0)}
          </p>
        </div>
        <div className="rounded-lg border border-yellow-700 bg-yellow-900/20 p-4">
          <p className="text-sm text-yellow-400">Testimonials</p>
          <p className="text-2xl font-bold text-yellow-400">
            {stats?.withTestimonials || 0}
          </p>
        </div>
        <div className="rounded-lg border border-orange-700 bg-orange-900/20 p-4">
          <p className="text-sm text-orange-400">Will Refer</p>
          <p className="text-2xl font-bold text-orange-400">
            {stats?.willingToRefer || 0}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by name, company, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <select
          value={
            testimonialFilter === undefined ? "" : testimonialFilter.toString()
          }
          onChange={(e) =>
            setTestimonialFilter(
              e.target.value === "" ? undefined : e.target.value === "true"
            )
          }
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All (Testimonial)</option>
          <option value="true">Has Testimonial</option>
          <option value="false">No Testimonial</option>
        </select>

        <select
          value={
            willingToReferFilter === undefined
              ? ""
              : willingToReferFilter.toString()
          }
          onChange={(e) =>
            setWillingToReferFilter(
              e.target.value === "" ? undefined : e.target.value === "true"
            )
          }
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All (Will Refer)</option>
          <option value="true">Will Refer</option>
          <option value="false">Won't Refer</option>
        </select>

        {(searchQuery ||
          testimonialFilter !== undefined ||
          willingToReferFilter !== undefined) && (
          <button
            onClick={() => {
              setSearchQuery("");
              setTestimonialFilter(undefined);
              setWillingToReferFilter(undefined);
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
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <ExternalLink className="h-12 w-12 text-slate-600 mb-3" />
            <p className="text-lg font-medium text-white">
              No converted customers yet
            </p>
            <p className="text-slate-400 mt-1">
              {searchQuery ||
              testimonialFilter !== undefined ||
              willingToReferFilter !== undefined
                ? "Try adjusting your filters"
                : "Mark leads as converted to see them here"}
            </p>
          </div>
        ) : (
          <div className="h-full overflow-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-900/50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap min-w-[180px]">
                    Company
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap min-w-[150px]">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap min-w-[180px]">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap min-w-[120px]">
                    Converted Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap min-w-[100px]">
                    User ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap min-w-[100px]">
                    Spaces
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap min-w-[130px]">
                    First Booking
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap min-w-[120px]">
                    Revenue
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap min-w-[120px]">
                    Testimonial?
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap min-w-[110px]">
                    Will Refer?
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap min-w-[100px]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-700">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-4 py-2 text-sm text-white border-r border-slate-700">
                      {lead.company || "-"}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-300 border-r border-slate-700">
                      {lead.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-300 border-r border-slate-700">
                      {lead.email || "-"}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-300 border-r border-slate-700">
                      {formatDate(lead.convertedAt)}
                    </td>
                    <td className="px-4 py-2 text-xs text-slate-500 font-mono border-r border-slate-700">
                      {lead.convertedUserId
                        ? `${lead.convertedUserId.slice(0, 8)}...`
                        : "-"}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-300 border-r border-slate-700">
                      {lead.spacesListed}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-300 border-r border-slate-700">
                      {formatDate(lead.firstBookingDate)}
                    </td>
                    <td className="px-4 py-2 text-sm font-medium text-emerald-400 border-r border-slate-700">
                      {formatCurrency(lead.totalRevenue)}
                    </td>
                    <td className="px-4 py-2 border-r border-slate-700">
                      <input
                        type="checkbox"
                        checked={lead.testimonialGiven}
                        onChange={(e) =>
                          handleUpdateField(
                            lead.id,
                            "testimonialGiven",
                            e.target.checked
                          )
                        }
                        disabled={updateConverted.isPending}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-600 focus:ring-2 focus:ring-emerald-500 cursor-pointer disabled:opacity-50"
                      />
                    </td>
                    <td className="px-4 py-2 border-r border-slate-700">
                      <input
                        type="checkbox"
                        checked={lead.willingToRefer}
                        onChange={(e) =>
                          handleUpdateField(
                            lead.id,
                            "willingToRefer",
                            e.target.checked
                          )
                        }
                        disabled={updateConverted.isPending}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-600 focus:ring-2 focus:ring-emerald-500 cursor-pointer disabled:opacity-50"
                      />
                    </td>
                    <td className="px-4 py-2">
                      {lead.convertedUserId && (
                        <button
                          onClick={() =>
                            syncMetrics.mutate({ leadId: lead.id })
                          }
                          disabled={syncMetrics.isPending}
                          className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-1 disabled:opacity-50"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Sync
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!isLoading && leads.length > 0 && (
        <div className="text-sm text-slate-400 text-center">
          Showing {leads.length} of {data?.total || 0} converted customers
        </div>
      )}
    </div>
  );
}
