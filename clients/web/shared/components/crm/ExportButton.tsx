// src/components/crm/ExportButton.tsx
"use client";

import { useState } from "react";
import { api } from "../../../../elaview-mvp/src/trpc/react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ExportButtonProps {
  filters: {
    status?: 'NEW' | 'CONTACTED' | 'RESPONDED' | 'DEMO_SCHEDULED' | 'SIGNED_UP' | 'FOLLOW_UP' | 'NOT_INTERESTED';
    phase1Only?: boolean;
    search?: string;
  };
}

export function ExportButton({ filters }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportCSV = api.crm.exportLeadsCSV.useQuery(
    {
      status: filters.status,
      phase1Only: filters.phase1Only,
      search: filters.search,
    },
    {
      enabled: false, // Don't auto-fetch
    }
  );

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const result = await exportCSV.refetch();

      if (result.data) {
        const { csv, count } = result.data;

        // Create blob and download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `elaview-leads-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast.success(`Exported ${count} leads to CSV`);
      }
    } catch (error) {
      toast.error('Failed to export leads');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 disabled:opacity-50"
    >
      {isExporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Export CSV
        </>
      )}
    </button>
  );
}
