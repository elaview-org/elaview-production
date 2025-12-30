// src/components/settings/BusinessProfileTab.tsx
"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { api } from '../../../../elaview-mvp/src/trpc/react';
import { 
  Building, 
  Save, 
  Loader2, 
  AlertCircle,
  Check,
  Briefcase,
  Globe,
  Phone
} from 'lucide-react';

export function BusinessProfileTab() {
  const { user } = useUser();
  const utils = api.useUtils();
  
  const { data: userData, isLoading } = api.user.getCurrentUser.useQuery();
  const updateProfile = api.user.updateProfile.useMutation({
    onSuccess: () => {
      utils.user.getCurrentUser.invalidate();
      setSuccessMessage('Business profile updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    companyName: '',
    industry: '',
    website: '',
    businessName: '',
    businessType: '',
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
        companyName: userData.advertiserProfile?.companyName || '',
        industry: userData.advertiserProfile?.industry || '',
        website: userData.advertiserProfile?.website || '',
        businessName: userData.spaceOwnerProfile?.businessName || '',
        businessType: userData.spaceOwnerProfile?.businessType || '',
      });
    }
  }, [userData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    updateProfile.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const isAdvertiser = userData?.role === 'ADVERTISER';
  const isSpaceOwner = userData?.role === 'SPACE_OWNER';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Business Information</h2>
        <p className="text-gray-400">
          Manage your {isAdvertiser ? 'company' : 'business'} information
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-start space-x-3">
          <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-400">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-blue-400" />
            Contact Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Advertiser-specific fields */}
        {isAdvertiser && (
          <div className="space-y-4 pt-6 border-t border-white/10">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Building className="w-5 h-5 mr-2 text-cyan-400" />
              Company Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-2">
                  Company Name
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Acme Corporation"
                />
              </div>

              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-300 mb-2">
                  Industry
                </label>
                <select
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="" className="bg-slate-800">Select Industry</option>
                  <option value="Technology" className="bg-slate-800">Technology</option>
                  <option value="Healthcare" className="bg-slate-800">Healthcare</option>
                  <option value="Finance" className="bg-slate-800">Finance</option>
                  <option value="Retail" className="bg-slate-800">Retail</option>
                  <option value="Food & Beverage" className="bg-slate-800">Food & Beverage</option>
                  <option value="Automotive" className="bg-slate-800">Automotive</option>
                  <option value="Real Estate" className="bg-slate-800">Real Estate</option>
                  <option value="Entertainment" className="bg-slate-800">Entertainment</option>
                  <option value="Other" className="bg-slate-800">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <Globe className="w-4 h-4 mr-1" />
                  Website
                </label>
                <input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>
        )}

        {/* Space Owner-specific fields */}
        {isSpaceOwner && (
          <div className="space-y-4 pt-6 border-t border-white/10">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Building className="w-5 h-5 mr-2 text-cyan-400" />
              Business Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-300 mb-2">
                  Business Name
                </label>
                <input
                  id="businessName"
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Downtown Plaza"
                />
              </div>

              <div>
                <label htmlFor="businessType" className="block text-sm font-medium text-gray-300 mb-2">
                  Business Type
                </label>
                <select
                  id="businessType"
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="" className="bg-slate-800">Select Business Type</option>
                  <option value="Retail Store" className="bg-slate-800">Retail Store</option>
                  <option value="Restaurant" className="bg-slate-800">Restaurant</option>
                  <option value="Office Building" className="bg-slate-800">Office Building</option>
                  <option value="Shopping Mall" className="bg-slate-800">Shopping Mall</option>
                  <option value="Transportation Hub" className="bg-slate-800">Transportation Hub</option>
                  <option value="Outdoor Advertising" className="bg-slate-800">Outdoor Advertising</option>
                  <option value="Other" className="bg-slate-800">Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-white/10">
          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateProfile.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}