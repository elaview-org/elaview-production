"use client";

import ConditionallyRender from "@/shared/components/common/ConditionallyRender";

import { useState } from "react";
import { Target, Trash2, Loader2, Filter } from "lucide-react";
import { ExportButton } from "@/shared/components/crm/ExportButton";
import { LeadFilters } from "@/shared/components/crm/LeadFilters";
import useOutboundLeads from "@/shared/hooks/api/getters/useOutboundLeads/useOutboundLeads";
import { SpreadsheetTable } from "@/shared/components/crm/SpreadsheetTable";
import useLeadStats from "@/shared/hooks/api/getters/useLeadStats/useLeadStats";
import useDeleteLeads from "@/shared/hooks/api/actions/useDeleteLeads/useDeleteLeads";

function CRMStatsCard({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2">
      <p className="text-xs text-slate-400">{title}</p>
      <p className="text-xl font-bold text-white">{value || 0}</p>
    </div>
  );
}

function CRMPipelineContent() {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states - Lead Pipeline
  const [commonQueries, setCommonQueries] = useState<{
    status?: boolean;
    phase1Only?: boolean;
    hasInventory?: string;
    hasInstallCapability?: string;
    search?: string;
    limit?: number;
  }>({
    status: false,
    phase1Only: false,
    hasInventory: "",
    hasInstallCapability: "",
    search: "",
    limit: 200,
  });

  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [phase1Filter, setPhase1Filter] = useState<boolean | undefined>();
  const [hasInventoryFilter, setHasInventoryFilter] = useState<
    string | undefined
  >();
  const [hasInstallFilter, setHasInstallFilter] = useState<
    string | undefined
  >();
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, refetch } = useOutboundLeads({
    filters: {},
    options: { enable: true },
  });

  const { stats } = useLeadStats();
  const deleteLeads = useDeleteLeads();

  //   const queries = {
  //     status: statusFilter as any,
  //     phase1Only: phase1Filter,
  //     hasInventory: hasInventoryFilter as any,
  //     hasInstallCapability: hasInstallFilter as any,
  //     search: searchQuery || undefined,
  //     limit: 200,
  //   };

  function onChangeCommonQueries(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, type, value, checked } = e.target;

    setCommonQueries((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  const statsCards = [
    { title: "Total Leads", value: stats.total },
    { title: "Phase 1 Targets", value: stats.phase1Qualified },
    { title: "Hot Leads (4-5)", value: stats.hotLeads },
    { title: "Contacted", value: stats.byStatus.CONTACTED },
    { title: "Demo Scheduled", value: stats.byStatus.DEMO_SCHEDULED },
  ];

  const handleBulkDelete = () => {};

  function FilteringSession() {
    return (
      <>
        <div className="flex items-center gap-2">
          <ConditionallyRender
            condition={selectedLeads.length > 0}
            show={
              <button
                onClick={handleBulkDelete}
                disabled={deleteLeads.isPending}
                className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete {selectedLeads.length}
              </button>
            }
          />
          <button
            onClick={() =>
              setCommonQueries((prev) => ({
                ...prev,
                phase1Only: !prev.phase1Only,
              }))
            }
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors flex items-center gap-1.5 ${
              commonQueries.phase1Only
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
            }`}
          >
            <Target className="h-3.5 w-3.5" />
            Phase 1
          </button>

          <button
            name="status"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors flex items-center gap-1.5 ${
              showFilters
                ? "bg-purple-600 text-white border-purple-500"
                : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
          </button>

          <input
            type="text"
            placeholder="Search leads..."
            value={commonQueries.search}
            onChange={(e) =>
              setCommonQueries((prev) => ({ ...prev, search: e.target.value }))
            }
            className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <ExportButton
            filters={{
              status: "CONTACTED",
              phase1Only: commonQueries.phase1Only,
              search: commonQueries.search || undefined,
            }}
          />
        </div>
        <ConditionallyRender
          condition={showFilters}
          show={
            <LeadFilters
              statusFilter={commonQueries.status as any}
              setStatusFilter={setStatusFilter}
              hasInventoryFilter={hasInventoryFilter}
              setHasInventoryFilter={setHasInventoryFilter}
              hasInstallFilter={hasInstallFilter}
              setHasInstallFilter={setHasInstallFilter}
            />
          }
        />
      </>
    );
  }
  return (
    <div className="flex-1 overflow-hidden px-4 py-3 space-y-3 flex flex-col">
      {/* Stats Row - More Compact */}
      <div className="grid gap-3 md:grid-cols-5">
        {statsCards.map((card) => (
          <CRMStatsCard
            key={card.title}
            title={card.title}
            value={card.value}
          />
        ))}
      </div>

      {/* Controls Row - More Compact */}
      <FilteringSession />
      {/* Table - Maximized Space */}
      <div className="flex-1 overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50 shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
          </div>
        ) : data.leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Target className="h-12 w-12 text-slate-600 mb-3" />
            <p className="text-lg font-medium text-white">No leads found</p>
            <p className="text-slate-400 mt-1">
              {searchQuery || statusFilter || phase1Filter
                ? "Try adjusting your filters"
                : 'Click "Add Lead" to get started'}
            </p>
          </div>
        ) : (
          // <SpreadsheetTable
          //   leads={leads}
          //   selectedLeads={selectedLeads}
          //   onSelectAll={handleSelectAll}
          //   onToggleSelect={handleToggleSelect}
          //   onUpdate={refetch}
          // />
          <SpreadsheetTable
            leads={data.leads}
            selectedLeads={selectedLeads}
            onSelectAll={(checked) => {
              setSelectedLeads(checked ? data.leads.map((l) => l.id) : []);
            }}
            onToggleSelect={(id) => {
              setSelectedLeads((prev) =>
                prev.includes(id)
                  ? prev.filter((leadId) => leadId !== id)
                  : [...prev, id]
              );
            }}
            onUpdate={() => {
              console.log("Data updated");
            }}
          />
        )}
      </div>

      {!isLoading && data.leads.length > 0 && (
        <div className="text-xs text-slate-400 text-center py-1">
          Showing {data.leads.length} of {data?.leads.length || 0} leads
        </div>
      )}
    </div>
  );
}
export default CRMPipelineContent;
