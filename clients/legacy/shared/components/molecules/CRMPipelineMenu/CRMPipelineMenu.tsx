"use client";

import { Plus, Upload, FileDown } from "lucide-react";
import Button from "../../atoms/Button/Button";

function CRMPipelineMenu({
  downloadExcelTemplate,
  downloadTemplate,
  onOpenImportModal,
  onOpenAddModal,
}: {
  downloadExcelTemplate: () => void;
  downloadTemplate: () => void;
  onOpenImportModal: () => void;
  onOpenAddModal: () => void;
}) {
  return (
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
      <Button
        onClick={onOpenImportModal}
      >
        <Upload className="h-3.5 w-3.5" />
        Import
      </Button>
      <Button
        backgroundColor="purple"
        onClick={onOpenAddModal}
      >
        <Plus className="h-3.5 w-3.5" />
        Add Lead
      </Button>
    </div>
  );
}

export default CRMPipelineMenu;
