// src/app/(admin)/admin/marketing/outbound/page.tsx
"use client";

// TODO: Future tab - Analytics Dashboard
// - Conversion funnel visualization (NEW → CONTACTED → RESPONDED → DEMO → SIGNED_UP)
// - Outreach channel effectiveness comparison
// - Time-to-conversion metrics
// - Response rate trends over time
// - Lead source performance ROI
// - Partner performance analytics
// - Geographic analysis
// See CRM-ROADMAP.md Priority 3 item #7

import { useState } from "react";
import { api } from "../../../../../elaview-mvp/src/trpc/react";
import { Target, Plus, Trash2, Download, Loader2, Filter, Send, Upload, FileDown } from "lucide-react";
import { SpreadsheetTable } from "../../../../../elaview-mvp/src/components/crm/SpreadsheetTable";
import { AddLeadModal } from "../../../../../elaview-mvp/src/components/crm/AddLeadModal";
import { ImportLeadsModal } from "../../../../../elaview-mvp/src/components/crm/ImportLeadsModal";
import { LeadFilters } from "../../../../../elaview-mvp/src/components/crm/LeadFilters";
import { ExportButton } from "../../../../../elaview-mvp/src/components/crm/ExportButton";
import { OutreachTable } from "../../../../../elaview-mvp/src/components/crm/OutreachTable";
import { LogOutreachModal } from "../../../../../elaview-mvp/src/components/crm/LogOutreachModal";
import { ConvertedTable } from "../../../../../elaview-mvp/src/components/crm/ConvertedTable";
import { ConvertLeadModal } from "../../../../../elaview-mvp/src/components/crm/ConvertLeadModal";
import { ResearchTable } from "../../../../../elaview-mvp/src/components/crm/ResearchTable";
import { PartnersTable } from "../../../../../elaview-mvp/src/components/crm/PartnersTable";
import { toast } from "sonner";
import { downloadTemplate, downloadExcelTemplate } from "../../../../../elaview-mvp/src/lib/import-utils";

type Tab = 'pipeline' | 'outreach' | 'converted' | 'research' | 'partners';

export default function OutboundCRMPage() {
  const [activeTab, setActiveTab] = useState<Tab>('pipeline');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showLogOutreachModal, setShowLogOutreachModal] = useState(false);
  const [showConvertLeadModal, setShowConvertLeadModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states - Lead Pipeline
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [phase1Filter, setPhase1Filter] = useState<boolean | undefined>();
  const [hasInventoryFilter, setHasInventoryFilter] = useState<string | undefined>();
  const [hasInstallFilter, setHasInstallFilter] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch leads
  const { data, isLoading, refetch } = api.crm.getLeads.useQuery({
    status: statusFilter as any,
    phase1Only: phase1Filter,
    hasInventory: hasInventoryFilter as any,
    hasInstallCapability: hasInstallFilter as any,
    search: searchQuery || undefined,
    limit: 200,
  }, {
    enabled: activeTab === 'pipeline',
  });

  // Fetch stats
  const { data: stats } = api.crm.getLeadStats.useQuery(undefined, {
    enabled: activeTab === 'pipeline',
  });

  // Bulk delete mutation
  const deleteLeads = api.crm.deleteLeads.useMutation({
    onSuccess: () => {
      toast.success(`Deleted ${selectedLeads.length} leads`);
      setSelectedLeads([]);
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete leads");
    },
  });

  const handleBulkDelete = () => {
    if (selectedLeads.length === 0) return;
    if (!confirm(`Delete ${selectedLeads.length} selected leads?`)) return;

    deleteLeads.mutate({ ids: selectedLeads });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(data?.leads.map(l => l.id) || []);
    } else {
      setSelectedLeads([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedLeads(prev =>
      prev.includes(id)
        ? prev.filter(leadId => leadId !== id)
        : [...prev, id]
    );
  };

  const leads = data?.leads || [];

  return (
    <div className="h-full w-full p-3">
      <div className="h-full bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
        {/* Header - More Compact */}
        <div className="flex-shrink-0 px-4 py-3 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-purple-400" />
              <div>
                <h2 className="text-xl font-bold text-white">Outbound CRM</h2>
                <p className="text-xs text-slate-400">Phase 2: Outreach tracking and customer conversion</p>
              </div>
            </div>
            {activeTab === 'pipeline' && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={downloadExcelTemplate}
                    className="px-2 py-1.5 text-emerald-400 hover:text-emerald-300 text-xs transition-colors flex items-center gap-1"
                    title="Download Excel template"
                  >
                    <FileDown className="h-3.5 w-3.5" />
                    <span>Excel</span>
                  </button>
                  <button
                    onClick={downloadTemplate}
                    className="px-2 py-1.5 text-slate-400 hover:text-white text-xs transition-colors flex items-center gap-1"
                    title="Download CSV template"
                  >
                    <FileDown className="h-3.5 w-3.5" />
                    <span>CSV</span>
                  </button>
                </div>
                <div className="h-5 w-px bg-slate-700" />
                <button
                  onClick={() => setShowImportModal(true)}
                  className="px-3 py-1.5 bg-slate-700 text-white text-sm rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-1.5"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Import
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Lead
                </button>
              </div>
            )}
            {activeTab === 'outreach' && (
              <button
                onClick={() => setShowLogOutreachModal(true)}
                className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                Log Outreach
              </button>
            )}
            {activeTab === 'converted' && (
              <button
                onClick={() => setShowConvertLeadModal(true)}
                className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Mark Converted
              </button>
            )}
          </div>

          {/* Tab Bar - More Compact */}
          <div className="mt-3 flex gap-1 border-b border-slate-700">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'pipeline'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Lead Pipeline
            </button>
            <button
              onClick={() => setActiveTab('outreach')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'outreach'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Outreach Tracking
            </button>
            <button
              onClick={() => setActiveTab('converted')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'converted'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Converted Customers
            </button>
            <button
              onClick={() => setActiveTab('research')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'research'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Market Research
            </button>
            <button
              onClick={() => setActiveTab('partners')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'partners'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Referral Partners
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'pipeline' && (
          <div className="flex-1 overflow-hidden px-4 py-3 space-y-3 flex flex-col">
            {/* Stats Row - More Compact */}
            <div className="grid gap-3 md:grid-cols-5">
              <div className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2">
                <p className="text-xs text-slate-400">Total Leads</p>
                <p className="text-xl font-bold text-white">{stats?.total || 0}</p>
              </div>
              <div className="rounded-lg border border-emerald-700 bg-emerald-900/20 px-3 py-2">
                <p className="text-xs text-emerald-400">Phase 1 Targets</p>
                <p className="text-xl font-bold text-emerald-400">{stats?.phase1Qualified || 0}</p>
              </div>
              <div className="rounded-lg border border-orange-700 bg-orange-900/20 px-3 py-2">
                <p className="text-xs text-orange-400">Hot Leads (4-5)</p>
                <p className="text-xl font-bold text-orange-400">{stats?.hotLeads || 0}</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2">
                <p className="text-xs text-slate-400">Contacted</p>
                <p className="text-xl font-bold text-white">{stats?.byStatus.CONTACTED || 0}</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2">
                <p className="text-xs text-slate-400">Demo Scheduled</p>
                <p className="text-xl font-bold text-white">{stats?.byStatus.DEMO_SCHEDULED || 0}</p>
              </div>
            </div>

            {/* Controls Row - More Compact */}
            <div className="flex items-center gap-2">
              {selectedLeads.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  disabled={deleteLeads.isPending}
                  className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete {selectedLeads.length}
                </button>
              )}

              <button
                onClick={() => setPhase1Filter(prev => prev ? undefined : true)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors flex items-center gap-1.5 ${
                  phase1Filter
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Target className="h-3.5 w-3.5" />
                Phase 1
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors flex items-center gap-1.5 ${
                  showFilters
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Filter className="h-3.5 w-3.5" />
                Filters
              </button>

              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <ExportButton
                filters={{
                  status: statusFilter as any,
                  phase1Only: phase1Filter,
                  search: searchQuery || undefined,
                }}
              />
            </div>

            {showFilters && (
              <LeadFilters
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                hasInventoryFilter={hasInventoryFilter}
                setHasInventoryFilter={setHasInventoryFilter}
                hasInstallFilter={hasInstallFilter}
                setHasInstallFilter={setHasInstallFilter}
              />
            )}

            {/* Table - Maximized Space */}
            <div className="flex-1 overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50 shadow-sm">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
                </div>
              ) : leads.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Target className="h-12 w-12 text-slate-600 mb-3" />
                  <p className="text-lg font-medium text-white">No leads found</p>
                  <p className="text-slate-400 mt-1">
                    {searchQuery || statusFilter || phase1Filter
                      ? 'Try adjusting your filters'
                      : 'Click "Add Lead" to get started'}
                  </p>
                </div>
              ) : (
                <SpreadsheetTable
                  leads={leads}
                  selectedLeads={selectedLeads}
                  onSelectAll={handleSelectAll}
                  onToggleSelect={handleToggleSelect}
                  onUpdate={refetch}
                />
              )}
            </div>

            {!isLoading && leads.length > 0 && (
              <div className="text-xs text-slate-400 text-center py-1">
                Showing {leads.length} of {data?.total || 0} leads
              </div>
            )}
          </div>
        )}

        {activeTab === 'outreach' && (
          <OutreachTable />
        )}

        {activeTab === 'converted' && (
          <ConvertedTable />
        )}

        {activeTab === 'research' && (
          <ResearchTable />
        )}

        {activeTab === 'partners' && (
          <PartnersTable />
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddLeadModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            refetch();
          }}
        />
      )}

      {showImportModal && (
        <ImportLeadsModal
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            setShowImportModal(false);
            refetch();
          }}
        />
      )}

      {showLogOutreachModal && (
        <LogOutreachModal
          onClose={() => setShowLogOutreachModal(false)}
          onSuccess={() => {
            setShowLogOutreachModal(false);
          }}
        />
      )}

      {showConvertLeadModal && (
        <ConvertLeadModal
          onClose={() => setShowConvertLeadModal(false)}
          onSuccess={() => {
            setShowConvertLeadModal(false);
          }}
        />
      )}
    </div>
  );
}