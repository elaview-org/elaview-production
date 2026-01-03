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
import { Plus, Send } from "lucide-react";

import { AddLeadModal } from "@/shared/components/crm/AddLeadModal";
import { ImportLeadsModal } from "@/shared/components/crm/ImportLeadsModal";
import { OutreachTable } from "@/shared/components/crm/OutreachTable";
import { LogOutreachModal } from "@/shared/components/crm/LogOutreachModal";
import { ConvertedTable } from "@/shared/components/crm/ConvertedTable";
import { ConvertLeadModal } from "@/shared/components/crm/ConvertLeadModal";
import { ResearchTable } from "@/shared/components/crm/ResearchTable";
import { PartnersTable } from "@/shared/components/crm/PartnersTable";
import { toast } from "sonner";
import {
  downloadTemplate,
  downloadExcelTemplate,
} from "@/shared/lib/import-utils";

/** test */
import Tabs from "@/shared/components/atoms/Tab";
import ConditionallyRender from "@/shared/components/common/ConditionallyRender";
import CRMPipelineMenu from "@/shared/components/molecules/CRMPipelineMenu";
import useOutboundLeads from "@/shared/hooks/api/getters/useOutboundLeads/useOutboundLeads";
import CRMPipelineContent from "./_components/CRMPipelineContent";
import useDeleteLeads from "@/shared/hooks/api/actions/useDeleteLeads/useDeleteLeads";
/** end test */

type Tab = "pipeline" | "outreach" | "converted" | "research" | "partners";
//server side function

export default function OutboundCRMPage() {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showLogOutreachModal, setShowLogOutreachModal] = useState(false);
  const [showConvertLeadModal, setShowConvertLeadModal] = useState(false);

  const { data, isLoading, refetch } = useOutboundLeads({
    filters: {},
    options: { enable: true },
  });

  const deleteLeads = useDeleteLeads();

  const handleBulkDelete = () => {
    if (selectedLeads.length === 0) return;
    if (!confirm(`Delete ${selectedLeads.length} selected leads?`)) return;

    deleteLeads.deleteLeadsByIds(selectedLeads);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(data?.leads.map((l) => l.id) || []);
    } else {
      setSelectedLeads([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((leadId) => leadId !== id) : [...prev, id]
    );
  };

  return (
    <div className="h-full w-full p-3">
      <div className="h-full bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
        <Tabs defaultTab="pipeline" activeColor="purple">
          <Tabs.Header
            actions={{
              pipeline: (
                <CRMPipelineMenu
                  downloadExcelTemplate={downloadExcelTemplate}
                  downloadTemplate={downloadTemplate}
                  onOpenImportModal={() => setShowImportModal(true)}
                  onOpenAddModal={() => setShowAddModal(true)}
                />
              ),
              outreach: (
                <button
                  onClick={() => setShowLogOutreachModal(true)}
                  className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  Log Outreach
                </button>
              ),
              converted: (
                <button
                  onClick={() => setShowConvertLeadModal(true)}
                  className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Mark Converted
                </button>
              ),
            }}
          />
          <Tabs.List>
            <Tabs.Button tabId="pipeline">Lead Pipeline</Tabs.Button>
            <Tabs.Button tabId="outreach">Outreach Tracking</Tabs.Button>
            <Tabs.Button tabId="converted">Converted Customers</Tabs.Button>
            <Tabs.Button tabId="research">Market Research</Tabs.Button>
            <Tabs.Button tabId="partners">Referral Partners</Tabs.Button>
          </Tabs.List>
          <Tabs.Panel tabId="pipeline">
            <CRMPipelineContent />
          </Tabs.Panel>
          <Tabs.Panel tabId="outreach">
            <OutreachTable />
          </Tabs.Panel>
          <Tabs.Panel tabId="converted">
            <ConvertedTable />
          </Tabs.Panel>
          <Tabs.Panel tabId="research">
            <ResearchTable />
          </Tabs.Panel>
          <Tabs.Panel tabId="partners">
            <PartnersTable />
          </Tabs.Panel>
        </Tabs>
      </div>

      {/* Modals */}
      <ConditionallyRender
        condition={showAddModal}
        show={
          <AddLeadModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              // refetch();
            }}
          />
        }
      />

      <ConditionallyRender
        condition={showImportModal}
        show={
          <ImportLeadsModal
            onClose={() => setShowImportModal(false)}
            onSuccess={() => {
              setShowImportModal(false);
              // refetch();
            }}
          />
        }
      />
      <ConditionallyRender
        condition={showLogOutreachModal}
        show={
          <LogOutreachModal
            onClose={() => setShowLogOutreachModal(false)}
            onSuccess={() => {
              setShowLogOutreachModal(false);
            }}
          />
        }
      />

      <ConditionallyRender
        condition={showConvertLeadModal}
        show={
          <ConvertLeadModal
            onClose={() => setShowConvertLeadModal(false)}
            onSuccess={() => {
              setShowConvertLeadModal(false);
            }}
          />
        }
      />
    </div>
  );
}
