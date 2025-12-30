// src/app/(advertiser)/campaigns/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, ArrowRight, Image as ImageIcon } from "lucide-react";
import { api } from "../../../../../../elaview-mvp/src/trpc/react";
import { ImageUpload } from "../../../../../../elaview-mvp/src/components/forms/ImageUpload";

export default function NewCampaignPage() {
  const router = useRouter();
  const utils = api.useUtils();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    targetAudience: "",
    goals: "",
    totalBudget: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createCampaignMutation = api.campaigns.create.useMutation({
    onSuccess: async (data) => {
      await utils.campaigns.getMyCampaigns.invalidate();
      router.push('/browse');
    },
    onError: (error) => {
      setErrors({ submit: error.message });
    }
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required';
    }

    if (!formData.imageUrl) {
      newErrors.image = 'Campaign creative/image is required';
    }

    if (formData.totalBudget && parseFloat(formData.totalBudget) <= 0) {
      newErrors.totalBudget = 'Budget must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createCampaignMutation.mutateAsync({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        imageUrl: formData.imageUrl,
        targetAudience: formData.targetAudience.trim() || undefined,
        goals: formData.goals.trim() || undefined,
        totalBudget: formData.totalBudget ? parseFloat(formData.totalBudget) : undefined,
      });
    } catch (error) {
      console.error('Campaign creation error:', error);
    }
  };

  return (
    <div className="h-full w-full p-4">
      <div className="h-full bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
        {/* Header - Fixed at top */}
        <div className="flex-shrink-0 p-6 border-b border-slate-800">
          <h1 className="text-3xl font-bold text-white">Create New Campaign</h1>
          <p className="text-slate-400 mt-2">
            Upload your ad creative and set up your campaign details. You'll be able to select advertising spaces after creating your campaign.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campaign Creative Upload */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Campaign Creative</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white mb-2">
                    Upload Your Ad Creative *
                  </label>
                  
                  <ImageUpload
                    value={formData.imageUrl}
                    onChange={(url) => {
                      setFormData(prev => ({ ...prev, imageUrl: url }));
                      setErrors(prev => ({ ...prev, image: '' }));
                    }}
                    onRemove={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                    disabled={createCampaignMutation.isPending}
                  />
                  
                  {errors.image && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.image}
                    </p>
                  )}
                  
                  <p className="mt-2 text-xs text-slate-500">
                    This is the ad creative that will be displayed on the advertising spaces you select.
                  </p>
                </div>
              </div>

              {/* Campaign Details */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Campaign Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                      Campaign Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Summer Sale 2025"
                      className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.name ? 'border-red-500' : 'border-slate-600'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your campaign goals and messaging..."
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="targetAudience" className="block text-sm font-medium text-white mb-1">
                      Target Audience
                    </label>
                    <input
                      type="text"
                      id="targetAudience"
                      value={formData.targetAudience}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                      placeholder="e.g., Young professionals 25-35"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="goals" className="block text-sm font-medium text-white mb-1">
                      Campaign Goals
                    </label>
                    <textarea
                      id="goals"
                      value={formData.goals}
                      onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                      placeholder="What do you want to achieve with this campaign?"
                      rows={2}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="totalBudget" className="block text-sm font-medium text-white mb-1">
                      Total Budget (Optional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-400">$</span>
                      <input
                        type="number"
                        id="totalBudget"
                        value={formData.totalBudget}
                        onChange={(e) => setFormData(prev => ({ ...prev, totalBudget: e.target.value }))}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className={`w-full pl-7 pr-3 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.totalBudget ? 'border-red-500' : 'border-slate-600'
                        }`}
                      />
                    </div>
                    {errors.totalBudget && (
                      <p className="mt-1 text-sm text-red-400">{errors.totalBudget}</p>
                    )}
                    <p className="mt-1 text-xs text-slate-500">
                      Set a budget limit for this campaign across all spaces
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {errors.submit && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-red-400">Error creating campaign</h3>
                      <p className="text-sm text-red-300 mt-1">{errors.submit}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-800 transition-colors"
                  disabled={createCampaignMutation.isPending}
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={createCampaignMutation.isPending}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                >
                  {createCampaignMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Campaign
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </button>
              </div>

              {/* Info Box */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start">
                  <ImageIcon className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-400 mb-1">What happens next?</h4>
                    <ul className="text-sm text-blue-300 space-y-1">
                      <li>1. Your campaign will be created as a draft</li>
                      <li>2. You'll be redirected to browse advertising spaces</li>
                      <li>3. Select spaces and add them to this campaign</li>
                      <li>4. Submit your campaign for space owner approval</li>
                      <li>5. Complete payment after approval</li>
                    </ul>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}