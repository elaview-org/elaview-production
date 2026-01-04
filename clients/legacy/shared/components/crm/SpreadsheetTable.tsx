// src/components/crm/SpreadsheetTable.tsx
"use client";

import { useState } from "react";
import { EditableCell } from "./EditableCell";
import { Check, X } from "lucide-react";

interface SpreadsheetTableProps {
  leads: any[];
  selectedLeads: string[];
  onSelectAll: (checked: boolean) => void;
  onToggleSelect: (id: string) => void;
  onUpdate: () => void;
}

export function SpreadsheetTable({
  leads,
  selectedLeads,
  onSelectAll,
  onToggleSelect,
  onUpdate,
}: SpreadsheetTableProps) {
  const allSelected = leads.length > 0 && selectedLeads.length === leads.length;
  const someSelected = selectedLeads.length > 0 && !allSelected;

  const getPhase1Border = (qualified: boolean) => {
    return qualified ? 'border-l-4 border-emerald-500' : '';
  };

  return (
    <div className="h-full overflow-auto">
      <table className="w-full border-collapse">
        <thead className="bg-slate-900 sticky top-0 z-10 shadow-lg">
          <tr>
            {/* Checkbox Column */}
            <th className="px-3 py-2 text-left border-b border-slate-700">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(input) => {
                  if (input) input.indeterminate = someSelected;
                }}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
              />
            </th>

            {/* Column Headers with Min/Max Widths */}
            <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap">
              ID
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap" style={{ minWidth: '180px', maxWidth: '300px' }}>
              Company/Contact
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap" style={{ minWidth: '160px', maxWidth: '250px' }}>
              Email
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap" style={{ minWidth: '110px' }}>
              Phone
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap" style={{ minWidth: '100px' }}>
              Source
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap" style={{ minWidth: '120px' }}>
              Business Type
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap" style={{ minWidth: '100px' }}>
              Location
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap" style={{ minWidth: '90px' }}>
              Inventory?
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap" style={{ minWidth: '100px' }}>
              Inv. Type
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap" style={{ minWidth: '70px' }}>
              Spaces
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap" style={{ minWidth: '90px' }}>
              Installs?
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap" style={{ minWidth: '100px' }}>
              Status
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap" style={{ minWidth: '100px' }}>
              Last Contact
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap" style={{ minWidth: '140px', maxWidth: '200px' }}>
              Next Action
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap" style={{ minWidth: '80px' }}>
              Priority
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap" style={{ minWidth: '180px', maxWidth: '300px' }}>
              Notes
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-700/50">
          {leads.map((lead, index) => (
            <tr
              key={lead.id}
              className={`
                transition-colors 
                hover:bg-slate-700/30 
                ${index % 2 === 0 ? 'bg-slate-800/10' : 'bg-transparent'}
                ${getPhase1Border(lead.phase1Qualified)}
              `}
            >
              {/* Checkbox */}
              <td className="px-3 py-1.5 border-r border-slate-700/50">
                <input
                  type="checkbox"
                  checked={selectedLeads.includes(lead.id)}
                  onChange={() => onToggleSelect(lead.id)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                />
              </td>

              {/* ID (Read-only) */}
              <td className="px-3 py-1.5 text-xs text-slate-500 font-mono border-r border-slate-700/50" title={lead.id}>
                {lead.id.slice(0, 8)}...
              </td>

              {/* Company/Contact */}
              <td className="px-3 py-1.5 border-r border-slate-700/50" style={{ maxWidth: '300px' }}>
                <div className="flex items-baseline gap-2 overflow-hidden">
                  <div className="truncate flex-1" title={lead.company || ''}>
                    {/* <EditableCell
                      leadId={lead.id}
                      field="company"
                      value={lead.company || ''}
                      type="text"
                      placeholder="Company"
                      onUpdate={onUpdate}
                      className="font-medium text-white text-xs"
                    /> */}
                    hello
                  </div>
                  {lead.name && (
                    <>
                      <span className="text-slate-600 flex-shrink-0">|</span>
                      <div className="truncate flex-1" title={lead.name}>
                        {/* <EditableCell
                          leadId={lead.id}
                          field="name"
                          value={lead.name}
                          type="text"
                          placeholder="Contact"
                          onUpdate={onUpdate}
                          className="text-xs text-slate-400"
                        /> */}
                        edit
                      </div>
                    </>
                  )}
                </div>
              </td>

              {/* Email */}
              <td className="px-3 py-1.5 border-r border-slate-700/50" style={{ maxWidth: '250px' }}>
                <div className="truncate" title={lead.email || ''}>
                  {/* <EditableCell
                    leadId={lead.id}
                    field="email"
                    value={lead.email || ''}
                    type="text"
                    placeholder="email@example.com"
                    onUpdate={onUpdate}
                    className="text-xs text-slate-300"
                  /> */}
                  edit
                </div>
              </td>

              {/* Phone */}
              <td className="px-3 py-1.5 border-r border-slate-700/50">
                {/* <EditableCell
                  leadId={lead.id}
                  field="phone"
                  value={lead.phone || ''}
                  type="text"
                  placeholder="Phone"
                  onUpdate={onUpdate}
                  className="text-xs text-slate-300"
                /> */}
                edit
              </td>

              {/* Source */}
              <td className="px-3 py-1.5 border-r border-slate-700/50">
                {/* <EditableCell
                  leadId={lead.id}
                  field="source"
                  value={lead.source}
                  type="select"
                  options={[
                    { value: 'GOOGLE_MAPS', label: 'Google Maps' },
                    { value: 'LINKEDIN', label: 'LinkedIn' },
                    { value: 'REFERRAL', label: 'Referral' },
                    { value: 'COLD_OUTREACH', label: 'Cold Outreach' },
                    { value: 'TRADE_SHOW', label: 'Trade Show' },
                    { value: 'WEBSITE', label: 'Website' },
                    { value: 'OTHER', label: 'Other' },
                  ]}
                  onUpdate={onUpdate}
                  className="text-xs text-slate-300"
                /> */}
                edit
              </td>

              {/* Business Type */}
              <td className="px-3 py-1.5 border-r border-slate-700/50">
                {/* <EditableCell
                  leadId={lead.id}
                  field="businessType"
                  value={lead.businessType}
                  type="select"
                  options={[
                    { value: 'SIGN_COMPANY', label: 'Sign Company' },
                    { value: 'BILLBOARD_OPERATOR', label: 'Billboard Operator' },
                    { value: 'WRAP_INSTALLER', label: 'Wrap Installer' },
                    { value: 'PROPERTY_MANAGER', label: 'Property Manager' },
                    { value: 'PRINT_SHOP', label: 'Print Shop' },
                    { value: 'AGENCY', label: 'Agency' },
                    { value: 'OTHER', label: 'Other' },
                  ]}
                  onUpdate={onUpdate}
                  className="text-xs text-slate-300"
                /> */}
                edit
              </td>

              {/* Location */}
              <td className="px-3 py-1.5 border-r border-slate-700/50">
                {/* <EditableCell
                  leadId={lead.id}
                  field="location"
                  value={lead.location || ''}
                  type="text"
                  placeholder="City, State"
                  onUpdate={onUpdate}
                  className="text-xs text-slate-300"
                /> */}
                edit
              </td>

              {/* Has Inventory */}
              <td className="px-3 py-1.5 border-r border-slate-700/50">
                {/* <EditableCell
                  leadId={lead.id}
                  field="hasInventory"
                  value={lead.hasInventory}
                  type="select"
                  options={[
                    { value: 'YES', label: '✓ Yes', className: 'text-emerald-400' },
                    { value: 'NO', label: '✗ No', className: 'text-red-400' },
                    { value: 'UNKNOWN', label: '? Unknown', className: 'text-slate-400' },
                  ]}
                  onUpdate={onUpdate}
                  className="text-xs"
                /> */}
                edit
              </td>

              {/* Inventory Type */}
              <td className="px-3 py-1.5 border-r border-slate-700/50">
                {/* <EditableCell
                  leadId={lead.id}
                  field="inventoryType"
                  value={lead.inventoryType || ''}
                  type="select"
                  options={[
                    { value: '', label: 'None' },
                    { value: 'BILLBOARD', label: 'Billboard' },
                    { value: 'STOREFRONT', label: 'Storefront' },
                    { value: 'TRANSIT', label: 'Transit' },
                    { value: 'DIGITAL_DISPLAY', label: 'Digital' },
                    { value: 'WINDOW_DISPLAY', label: 'Window' },
                    { value: 'VEHICLE_WRAP', label: 'Vehicle' },
                    { value: 'OTHER', label: 'Other' },
                  ]}
                  onUpdate={onUpdate}
                  className="text-xs text-slate-300"
                /> */}
                edit
              </td>

              {/* Est. Spaces */}
              <td className="px-3 py-1.5 border-r border-slate-700/50">
                {/* <EditableCell
                  leadId={lead.id}
                  field="estimatedSpaces"
                  value={lead.estimatedSpaces ? String(lead.estimatedSpaces) : ''}
                  type="number"
                  placeholder="0"
                  onUpdate={onUpdate}
                  className="text-xs text-slate-300"
                /> */}
                edit
              </td>

              {/* Does Installs */}
              <td className="px-3 py-1.5 border-r border-slate-700/50">
                {/* <EditableCell
                  leadId={lead.id}
                  field="hasInstallCapability"
                  value={lead.hasInstallCapability}
                  type="select"
                  options={[
                    { value: 'YES', label: '✓ Yes', className: 'text-emerald-400' },
                    { value: 'NO', label: '✗ No', className: 'text-red-400' },
                    { value: 'UNKNOWN', label: '? Unknown', className: 'text-slate-400' },
                  ]}
                  onUpdate={onUpdate}
                  className="text-xs"
                /> */}
                edit
              </td>

              {/* Status */}
              <td className="px-3 py-1.5 border-r border-slate-700/50">
                {/* <EditableCell
                  leadId={lead.id}
                  field="status"
                  value={lead.status}
                  type="select"
                  options={[
                    { value: 'NEW', label: 'New' },
                    { value: 'CONTACTED', label: 'Contacted' },
                    { value: 'RESPONDED', label: 'Responded' },
                    { value: 'DEMO_SCHEDULED', label: 'Demo' },
                    { value: 'SIGNED_UP', label: 'Signed Up' },
                    { value: 'FOLLOW_UP', label: 'Follow Up' },
                    { value: 'NOT_INTERESTED', label: 'Not Int.' },
                  ]}
                  onUpdate={onUpdate}
                  className="text-xs text-slate-300"
                /> */}
                edit
              </td>

              {/* Last Contact */}
              <td className="px-3 py-1.5 border-r border-slate-700/50">
                {/* <EditableCell
                  leadId={lead.id}
                  field="lastContactDate"
                  value={(lead.lastContactDate ? new Date(lead.lastContactDate).toISOString().split('T')[0] : '')!}
                  type="date"
                  placeholder="YYYY-MM-DD"
                  onUpdate={onUpdate}
                  className="text-xs text-slate-300"
                /> */}
                edit
              </td>

              {/* Next Action */}
              <td className="px-3 py-1.5 border-r border-slate-700/50" style={{ maxWidth: '200px' }}>
                <div className="truncate" title={lead.nextAction || ''}>
                  {/* <EditableCell
                    leadId={lead.id}
                    field="nextAction"
                    value={lead.nextAction || ''}
                    type="text"
                    placeholder="Next step..."
                    onUpdate={onUpdate}
                    className="text-xs text-slate-300"
                  /> */}
                  edit
                </div>
              </td>

              {/* Priority (Read-only, auto-calculated) */}
              <td className="px-3 py-1.5 border-r border-slate-700/50">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${
                    lead.priorityScore >= 4 ? 'text-emerald-400' :
                    lead.priorityScore === 3 ? 'text-slate-300' :
                    'text-red-400'
                  }`}>
                    {lead.priorityScore}
                  </span>
                  {lead.phase1Qualified && (
                    <span className="text-xs bg-emerald-900/50 text-emerald-400 px-2 py-0.5 rounded">
                      P1
                    </span>
                  )}
                </div>
              </td>

              {/* Notes */}
              <td className="px-3 py-1.5" style={{ maxWidth: '300px' }}>
                <div className="truncate" title={lead.notes || ''}>
                  {/* <EditableCell
                    leadId={lead.id}
                    field="notes"
                    value={lead.notes || ''}
                    type="textarea"
                    placeholder="Add notes..."
                    onUpdate={onUpdate}
                    className="text-xs text-slate-300"
                  /> */}
                  edit
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}