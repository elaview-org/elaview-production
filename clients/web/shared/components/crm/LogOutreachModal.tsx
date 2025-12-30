// src/components/crm/LogOutreachModal.tsx
"use client";

import { useState, useMemo } from "react";
import { api } from "../../../../elaview-mvp/src/trpc/react";
import { X, Loader2, Mail, Phone, MessageSquare, User, ExternalLink, Search } from "lucide-react";
import { toast } from "sonner";

interface LogOutreachModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

type OutreachChannel = 'EMAIL' | 'LINKEDIN' | 'PHONE' | 'WHATSAPP' | 'IN_PERSON' | 'OTHER';
type OutreachMessageType = 'INITIAL' | 'FOLLOW_UP_1' | 'FOLLOW_UP_2' | 'FOLLOW_UP_3' | 'DEMO_INVITE' | 'CHECK_IN';

export function LogOutreachModal({ onClose, onSuccess }: LogOutreachModalProps) {
  const [formData, setFormData] = useState({
    leadId: '',
    channel: 'EMAIL' as OutreachChannel,
    messageType: 'INITIAL' as OutreachMessageType,
    subject: '',
    messageContent: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showLeadDropdown, setShowLeadDropdown] = useState(false);

  // Fetch leads for selector
  const { data: leadsData } = api.crm.getLeads.useQuery({
    search: searchQuery || undefined,
    limit: 50,
  });

  // Filter leads based on search
  const filteredLeads = useMemo(() => {
    const leads = leadsData?.leads || [];
    if (!searchQuery) return leads;

    const query = searchQuery.toLowerCase();
    return leads.filter(lead =>
      lead.name.toLowerCase().includes(query) ||
      lead.company?.toLowerCase().includes(query) ||
      lead.email?.toLowerCase().includes(query)
    );
  }, [leadsData?.leads, searchQuery]);

  // Get selected lead details
  const selectedLead = useMemo(() => {
    return leadsData?.leads.find(l => l.id === formData.leadId);
  }, [leadsData?.leads, formData.leadId]);

  const createOutreach = api.crm.createOutreach.useMutation({
    onSuccess: () => {
      toast.success('Outreach logged successfully');
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to log outreach');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.leadId) {
      toast.error('Please select a lead');
      return;
    }

    createOutreach.mutate({
      leadId: formData.leadId,
      channel: formData.channel,
      messageType: formData.messageType,
      subject: formData.subject || null,
      messageContent: formData.messageContent || null,
    });
  };

  const getChannelIcon = (channel: OutreachChannel) => {
    switch (channel) {
      case 'EMAIL': return <Mail className="h-5 w-5" />;
      case 'PHONE': return <Phone className="h-5 w-5" />;
      case 'LINKEDIN': return <ExternalLink className="h-5 w-5" />;
      case 'WHATSAPP': return <MessageSquare className="h-5 w-5" />;
      case 'IN_PERSON': return <User className="h-5 w-5" />;
      default: return <MessageSquare className="h-5 w-5" />;
    }
  };

  const getChannelColor = (channel: OutreachChannel) => {
    switch (channel) {
      case 'EMAIL': return 'text-blue-400 bg-blue-900/20 border-blue-700';
      case 'PHONE': return 'text-green-400 bg-green-900/20 border-green-700';
      case 'LINKEDIN': return 'text-purple-400 bg-purple-900/20 border-purple-700';
      case 'WHATSAPP': return 'text-yellow-400 bg-yellow-900/20 border-yellow-700';
      case 'IN_PERSON': return 'text-orange-400 bg-orange-900/20 border-orange-700';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  const channelOptions: Array<{ value: OutreachChannel; label: string }> = [
    { value: 'EMAIL', label: 'Email' },
    { value: 'PHONE', label: 'Phone' },
    { value: 'LINKEDIN', label: 'LinkedIn' },
    { value: 'WHATSAPP', label: 'WhatsApp' },
    { value: 'IN_PERSON', label: 'In Person' },
    { value: 'OTHER', label: 'Other' },
  ];

  const messageTypeOptions: Array<{ value: OutreachMessageType; label: string }> = [
    { value: 'INITIAL', label: 'Initial Outreach' },
    { value: 'FOLLOW_UP_1', label: 'Follow Up #1' },
    { value: 'FOLLOW_UP_2', label: 'Follow Up #2' },
    { value: 'FOLLOW_UP_3', label: 'Follow Up #3' },
    { value: 'DEMO_INVITE', label: 'Demo Invitation' },
    { value: 'CHECK_IN', label: 'Check In' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">Log Outreach</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
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
                  {selectedLead.company && (
                    <div className="text-sm text-slate-400">{selectedLead.company}</div>
                  )}
                  {selectedLead.email && (
                    <div className="text-xs text-slate-500">{selectedLead.email}</div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, leadId: '' });
                    setSearchQuery('');
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowLeadDropdown(true);
                    }}
                    onFocus={() => setShowLeadDropdown(true)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Search by name, company, or email..."
                  />
                </div>

                {showLeadDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {filteredLeads.length > 0 ? (
                      filteredLeads.map((lead) => (
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
                          {lead.company && (
                            <div className="text-sm text-slate-400">{lead.company}</div>
                          )}
                          {lead.email && (
                            <div className="text-xs text-slate-500">{lead.email}</div>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-slate-500">
                        No leads found
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Channel Selector - Visual Cards */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">
              Channel <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {channelOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, channel: option.value })}
                  className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    formData.channel === option.value
                      ? getChannelColor(option.value)
                      : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {getChannelIcon(option.value)}
                  <span className="text-xs font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Message Type */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Message Type <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.messageType}
              onChange={(e) => setFormData({ ...formData, messageType: e.target.value as OutreachMessageType })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {messageTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Line (for emails and some messages) */}
          {(formData.channel === 'EMAIL' || formData.channel === 'LINKEDIN') && (
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Subject Line
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter subject line..."
              />
            </div>
          )}

          {/* Message Content */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Message Content
            </label>
            <textarea
              value={formData.messageContent}
              onChange={(e) => setFormData({ ...formData, messageContent: e.target.value })}
              rows={8}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
              placeholder={
                formData.channel === 'PHONE'
                  ? 'Call notes, discussion points, outcome...'
                  : formData.channel === 'IN_PERSON'
                  ? 'Meeting notes, topics discussed, next steps...'
                  : 'Message content or conversation notes...'
              }
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700">
          <button
            type="button"
            onClick={onClose}
            disabled={createOutreach.isPending}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={createOutreach.isPending || !formData.leadId}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {createOutreach.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Log Outreach & Update Lead
          </button>
        </div>
      </div>
    </div>
  );
}
