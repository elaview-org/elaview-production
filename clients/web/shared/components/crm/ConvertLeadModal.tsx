// src/components/crm/ConvertLeadModal.tsx
"use client";

import { useState } from "react";
import { api } from "../../../../elaview-mvp/src/trpc/react";
import { X, Loader2, Search } from "lucide-react";
import { toast } from "sonner";

interface ConvertLeadModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function ConvertLeadModal({ onClose, onSuccess }: ConvertLeadModalProps) {
  const [formData, setFormData] = useState({
    leadId: '',
    userId: '',
    conversionSource: '',
  });

  const [leadSearch, setLeadSearch] = useState('');
  const [showLeadDropdown, setShowLeadDropdown] = useState(false);

  // Fetch unconverted leads
  const { data: leadsData } = api.crm.getLeads.useQuery({
    search: leadSearch || undefined,
    limit: 50,
  });

  const unconvertedLeads = leadsData?.leads.filter(l => !l.convertedAt) || [];
  const selectedLead = leadsData?.leads.find(l => l.id === formData.leadId);

  const convertLead = api.crm.convertLead.useMutation({
    onSuccess: () => {
      toast.success('Lead marked as converted');
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to convert lead');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.leadId) {
      toast.error('Please select a lead');
      return;
    }
    convertLead.mutate({
      leadId: formData.leadId,
      userId: formData.userId || undefined,
      conversionSource: formData.conversionSource || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">Mark Lead as Converted</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Lead Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">
              Lead <span className="text-red-400">*</span>
            </label>
            {selectedLead ? (
              <div className="flex items-center justify-between p-3 bg-slate-800 border border-slate-700 rounded-lg">
                <div>
                  <div className="text-white font-medium">{selectedLead.name}</div>
                  {selectedLead.company && <div className="text-sm text-slate-400">{selectedLead.company}</div>}
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, leadId: '' })}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={leadSearch}
                  onChange={(e) => {
                    setLeadSearch(e.target.value);
                    setShowLeadDropdown(true);
                  }}
                  onFocus={() => setShowLeadDropdown(true)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Search leads..."
                />
                {showLeadDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {unconvertedLeads.length > 0 ? (
                      unconvertedLeads.map((lead) => (
                        <button
                          key={lead.id}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, leadId: lead.id });
                            setShowLeadDropdown(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors border-b border-slate-700 last:border-b-0"
                        >
                          <div className="text-white font-medium">{lead.name}</div>
                          {lead.company && <div className="text-sm text-slate-400">{lead.company}</div>}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-slate-500">No unconverted leads found</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Optional User ID */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Elaview User ID (Optional)
            </label>
            <input
              type="text"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="user_xxxxx"
            />
            <p className="text-xs text-slate-500 mt-1">Link to their Elaview account if known</p>
          </div>

          {/* Conversion Source */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Conversion Source
            </label>
            <select
              value={formData.conversionSource}
              onChange={(e) => setFormData({ ...formData, conversionSource: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select source...</option>
              <option value="EMAIL">Email</option>
              <option value="LINKEDIN">LinkedIn</option>
              <option value="PHONE">Phone</option>
              <option value="DEMO">Demo</option>
              <option value="REFERRAL">Referral</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700">
          <button
            type="button"
            onClick={onClose}
            disabled={convertLead.isPending}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={convertLead.isPending || !formData.leadId}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {convertLead.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Mark as Converted
          </button>
        </div>
      </div>
    </div>
  );
}
