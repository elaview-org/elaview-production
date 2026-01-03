// src/components/crm/AddLeadModal.tsx

import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import FormActions from "../molecules/FormActions";

interface AddLeadModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AddLeadModal({ onClose, onSuccess }: AddLeadModalProps) {
  const createLead = () => {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">Add New Lead</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <FormActions
          render={({ formData, handleOnChange, handleSubmit }) => (
            <>
              <form
                onSubmit={handleSubmit}
                className="flex-1 overflow-y-auto p-6 space-y-6"
              >
                {/* Contact Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Contact Information
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Contact Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleOnChange}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Company
                      </label>
                      <input
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleOnChange}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="ABC Signs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Email
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleOnChange}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Phone
                      </label>
                      <input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleOnChange}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Website
                      </label>
                      <input
                        name="website"
                        type="url"
                        value={formData.website}
                        onChange={handleOnChange}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="https://example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Location
                      </label>
                      <input
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleOnChange}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="City, State"
                      />
                    </div>
                  </div>
                </div>

                {/* Lead Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Lead Details
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Source
                      </label>
                      <select
                        name="source"
                        value={formData.source}
                        onChange={handleOnChange}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="GOOGLE_MAPS">Google Maps</option>
                        <option value="LINKEDIN">LinkedIn</option>
                        <option value="REFERRAL">Referral</option>
                        <option value="COLD_OUTREACH">Cold Outreach</option>
                        <option value="TRADE_SHOW">Trade Show</option>
                        <option value="WEBSITE">Website</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Business Type
                      </label>
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleOnChange}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="SIGN_COMPANY">Sign Company</option>
                        <option value="BILLBOARD_OPERATOR">
                          Billboard Operator
                        </option>
                        <option value="WRAP_INSTALLER">Wrap Installer</option>
                        <option value="PROPERTY_MANAGER">
                          Property Manager
                        </option>
                        <option value="PRINT_SHOP">Print Shop</option>
                        <option value="AGENCY">Agency</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Phase 1 Qualification */}
                <div className="space-y-4 p-4 bg-emerald-900/10 border-2 border-emerald-700 rounded-lg">
                  <h3 className="text-lg font-semibold text-emerald-400">
                    Phase 1 Qualification
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Has Advertising Inventory?
                      </label>
                      <select
                        name="hasInventory"
                        value={formData.hasInventory}
                        onChange={handleOnChange}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="UNKNOWN">? Unknown</option>
                        <option value="YES">✓ Yes</option>
                        <option value="NO">✗ No</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Can Install Ads?
                      </label>
                      <select
                        name="hasInstallCapability"
                        value={formData.hasInstallCapability}
                        onChange={handleOnChange}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="UNKNOWN">? Unknown</option>
                        <option value="YES">✓ Yes</option>
                        <option value="NO">✗ No</option>
                      </select>
                    </div>
                  </div>

                  {formData.hasInventory === "YES" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                          Inventory Type
                        </label>
                        <select
                          name="inventoryType"
                          value={formData.inventoryType}
                          onChange={handleOnChange}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select type</option>
                          <option value="BILLBOARD">Billboard</option>
                          <option value="STOREFRONT">Storefront</option>
                          <option value="TRANSIT">Transit</option>
                          <option value="DIGITAL_DISPLAY">
                            Digital Display
                          </option>
                          <option value="WINDOW_DISPLAY">Window Display</option>
                          <option value="VEHICLE_WRAP">Vehicle Wrap</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                          Estimated Spaces
                        </label>
                        <input
                          name="estimatedSpaces"
                          type="number"
                          min="0"
                          value={formData.estimatedSpaces}
                          onChange={handleOnChange}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleOnChange}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Additional information about this lead..."
                  />
                </div>
              </form>
              {/* Footer */}

              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={createLead.isPending}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={createLead.isPending || !formData.name}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {createLead.isPending && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Create Lead
                </button>
              </div>
            </>
          )}
        />
      </div>
    </div>
  );
}
