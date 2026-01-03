// src/components/crm/LeadFilters.tsx
"use client";

interface LeadFiltersProps {
  statusFilter: string | undefined;
  setStatusFilter: (value: string | undefined) => void;
  hasInventoryFilter: string | undefined;
  setHasInventoryFilter: (value: string | undefined) => void;
  hasInstallFilter: string | undefined;
  setHasInstallFilter: (value: string | undefined) => void;
}


export function LeadFilters({
  statusFilter,
  setStatusFilter,
  hasInventoryFilter,
  setHasInventoryFilter,
  hasInstallFilter,
  setHasInstallFilter,
}: LeadFiltersProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-4">
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Filters</h3>

      <div className="grid grid-cols-3 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">
            Status
          </label>
          <select
            value={statusFilter || 'ALL'}
            onChange={(e) => setStatusFilter(e.target.value === 'ALL' ? undefined : e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="ALL">All Status</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="RESPONDED">Responded</option>
            <option value="DEMO_SCHEDULED">Demo Scheduled</option>
            <option value="SIGNED_UP">Signed Up</option>
            <option value="FOLLOW_UP">Follow Up</option>
            <option value="NOT_INTERESTED">Not Interested</option>
          </select>
        </div>

        {/* Has Inventory Filter */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">
            Has Inventory
          </label>
          <select
            value={hasInventoryFilter || 'ALL'}
            onChange={(e) => setHasInventoryFilter(e.target.value === 'ALL' ? undefined : e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="ALL">All</option>
            <option value="YES">✓ Yes</option>
            <option value="NO">✗ No</option>
            <option value="UNKNOWN">? Unknown</option>
          </select>
        </div>

        {/* Does Installs Filter */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">
            Does Installs
          </label>
          <select
            value={hasInstallFilter || 'ALL'}
            onChange={(e) => setHasInstallFilter(e.target.value === 'ALL' ? undefined : e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="ALL">All</option>
            <option value="YES">✓ Yes</option>
            <option value="NO">✗ No</option>
            <option value="UNKNOWN">? Unknown</option>
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-slate-500">
          {(statusFilter || hasInventoryFilter || hasInstallFilter)
            ? 'Filters active'
            : 'No filters applied'}
        </p>
        {(statusFilter || hasInventoryFilter || hasInstallFilter) && (
          <button
            onClick={() => {
              setStatusFilter(undefined);
              setHasInventoryFilter(undefined);
              setHasInstallFilter(undefined);
            }}
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}
