// src/components/crm/PartnersTable.tsx
"use client";

// TODO: Add "Add Partner" button that opens AddPartnerModal
// TODO: Add Export CSV button (backend already exists: api.crm.exportPartnersCSV)
// TODO: Add checkbox column for bulk operations (bulk delete, bulk status update)
// TODO: Add "Record Referral" quick action button (uses api.crm.recordReferral)
// See CRM-ROADMAP.md Priority 1 items #2, #3, #4

import { useState } from "react";
import { api } from "../../../../elaview-mvp/src/trpc/react";
import { Loader2, Users } from "lucide-react";
import { toast } from "sonner";

export function PartnersTable() {
  const { data, isLoading, refetch } = api.crm.getPartners.useQuery({ limit: 100 });
  const { data: stats } = api.crm.getPartnerStats.useQuery();

  const updatePartner = api.crm.updatePartner.useMutation({
    onSuccess: () => {
      toast.success("Updated");
      refetch();
    },
  });

  const partners = data?.partners || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-emerald-400 bg-emerald-900/20';
      case 'PROSPECT': return 'text-blue-400 bg-blue-900/20';
      case 'INACTIVE': return 'text-slate-400 bg-slate-800';
      case 'CHURNED': return 'text-red-400 bg-red-900/20';
      default: return 'text-slate-400';
    }
  };

  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(Number(amount || 0));
  };

  return (
    <div className="flex-1 overflow-hidden p-6 space-y-6 flex flex-col">
      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Total Partners</p>
          <p className="text-2xl font-bold text-white">{stats?.totalPartners || 0}</p>
        </div>
        <div className="rounded-lg border border-emerald-700 bg-emerald-900/20 p-4">
          <p className="text-sm text-emerald-400">Active</p>
          <p className="text-2xl font-bold text-emerald-400">{stats?.activePartners || 0}</p>
        </div>
        <div className="rounded-lg border border-blue-700 bg-blue-900/20 p-4">
          <p className="text-sm text-blue-400">Leads Referred</p>
          <p className="text-2xl font-bold text-blue-400">{stats?.totalLeadsReferred || 0}</p>
        </div>
        <div className="rounded-lg border border-purple-700 bg-purple-900/20 p-4">
          <p className="text-sm text-purple-400">Converted</p>
          <p className="text-2xl font-bold text-purple-400">{stats?.totalLeadsConverted || 0}</p>
        </div>
        <div className="rounded-lg border border-yellow-700 bg-yellow-900/20 p-4">
          <p className="text-sm text-yellow-400">Total Revenue</p>
          <p className="text-2xl font-bold text-yellow-400">{formatCurrency(stats?.totalRevenue || 0)}</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-lg border border-slate-700 bg-slate-800">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
          </div>
        ) : partners.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Users className="h-12 w-12 text-slate-600 mb-3" />
            <p className="text-lg font-medium text-white">No referral partners</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-900/50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Company</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Referred</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Converted</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Conv. Rate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {partners.map((p) => (
                <tr key={p.id} className="hover:bg-slate-700/50">
                  <td className="px-4 py-2 text-sm text-white">{p.name}</td>
                  <td className="px-4 py-2 text-sm text-slate-300">{p.company || '-'}</td>
                  <td className="px-4 py-2 text-sm text-slate-300">{p.partnerType || '-'}</td>
                  <td className="px-4 py-2">
                    <select
                      value={p.status}
                      onChange={(e) => updatePartner.mutate({ id: p.id, status: e.target.value })}
                      className={`px-2 py-1 text-xs rounded ${getStatusColor(p.status)} border-0 focus:ring-2 focus:ring-purple-500`}
                    >
                      <option value="PROSPECT">Prospect</option>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="CHURNED">Churned</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-300">{p.leadsReferred}</td>
                  <td className="px-4 py-2 text-sm text-slate-300">{p.leadsConverted}</td>
                  <td className="px-4 py-2 text-sm text-slate-300">
                    {p.leadsReferred > 0 ? `${((p.leadsConverted / p.leadsReferred) * 100).toFixed(1)}%` : '0%'}
                  </td>
                  <td className="px-4 py-2 text-sm font-medium text-emerald-400">{formatCurrency(p.totalRevenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
