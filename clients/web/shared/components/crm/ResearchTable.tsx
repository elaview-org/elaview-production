// src/components/crm/ResearchTable.tsx
"use client";

// TODO: Add "Add Research" button that opens AddResearchModal
// TODO: Add Export CSV button (backend already exists: api.crm.exportMarketResearchCSV)
// TODO: Add checkbox column for bulk operations (bulk delete, bulk promote to leads)
// See CRM-ROADMAP.md Priority 1 items #1, #3, #4

import { useState } from "react";
// import { api } from "../../../../elaview-mvp/src/trpc/react";
import { Loader2, TrendingUp, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function ResearchTable() {
  // const { data, isLoading, refetch } = api.crm.getMarketResearch.useQuery({ limit: 100 });
  const data = {};
  const isLoading = false;
  const refetch = () => {};
  // const { data: stats } = api.crm.getMarketResearchStats.useQuery();
  const stats = {};
  // const promoteToLead = api.crm.promoteToLead.useMutation({
  //   onSuccess: () => {
  //     toast.success("Promoted to active pipeline");
  //     refetch();
  //   },
  // });
  const promoteToLead = () => {};
  // const deleteResearch = api.crm.deleteMarketResearch.useMutation({
  //   onSuccess: () => {
  //     toast.success("Deleted");
  //     refetch();
  //   },
  // });
  const deleteResearch = () => {};
  const research = data?.research || [];

  return (
    <div className="flex-1 overflow-hidden p-6 space-y-6 flex flex-col">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Total Research Entries</p>
          <p className="text-2xl font-bold text-white">{stats?.total || 0}</p>
        </div>
        <div className="rounded-lg border border-orange-700 bg-orange-900/20 p-4">
          <p className="text-sm text-orange-400">Revisit Due</p>
          <p className="text-2xl font-bold text-orange-400">
            {stats?.revisitDue || 0}
          </p>
        </div>
        <div className="rounded-lg border border-blue-700 bg-blue-900/20 p-4">
          <p className="text-sm text-blue-400">Large/Enterprise</p>
          <p className="text-2xl font-bold text-blue-400">
            {(stats?.byScale?.LARGE || 0) + (stats?.byScale?.ENTERPRISE || 0)}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-lg border border-slate-700 bg-slate-800">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
          </div>
        ) : research.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <TrendingUp className="h-12 w-12 text-slate-600 mb-3" />
            <p className="text-lg font-medium text-white">
              No research entries
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-900/50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                  Scale
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                  Why Not Now
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {research.map((r) => (
                <tr key={r.id} className="hover:bg-slate-700/50">
                  <td className="px-4 py-2 text-sm text-white">
                    {r.companyName}
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-300">
                    {r.businessType}
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-300">
                    {r.estimatedScale.replace("_", " ")}
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-400">
                    {r.reasonNotPursuing || "-"}
                  </td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    <button
                      onClick={() => promoteToLead.mutate({ researchId: r.id })}
                      className="px-2 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700"
                    >
                      Promote
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this research entry?")) {
                          deleteResearch.mutate({ id: r.id });
                        }
                      }}
                      className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
