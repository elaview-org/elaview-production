// src/app/(advertiser)/campaigns/[id]/edit/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../../../../elaview-mvp/src/trpc/react";
import { AlertCircle, ArrowLeft, Loader2, Save, Upload } from "lucide-react";
import Image from "next/image";
import type { Decimal } from "@prisma/client-runtime-utils";
import type { CampaignStatus } from "@prisma/client";

// Helper function to safely convert Prisma Decimal to number
const decimalToNumber = (
  value: Decimal | number | null | undefined
): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  return Number(value.toString());
};

export default function CampaignEditPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    targetAudience: "",
    goals: "",
    totalBudget: "",
    imageUrl: "",
    startDate: "",
    endDate: "",
  });
  const [, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // TRPC Queries
  const {
    data: campaign,
    isLoading: campaignLoading,
    error: campaignError,
  } = api.campaigns.getById.useQuery(
    { id: campaignId },
    { enabled: isLoaded && !!user }
  ) as {
    data: {
      name: string;
      description?: string | null;
      status: CampaignStatus;
      targetAudience?: string | null;
      goals?: string | null;
      totalBudget: number | Decimal;
      imageUrl: string;
      startDate?: string | null | Date;
      endDate?: string | null | Date;
    };
    isLoading: boolean;
    error: { message?: string };
  };

  // TRPC Mutations
  const updateCampaign = api.campaigns.update.useMutation({
    onSuccess: () => {
      router.push(`/campaigns/${campaignId}`);
    },
    onError: (error) => {
      setErrors({ submit: error.message || "Failed to update campaign" });
    },
  });

  // Initialize form data when campaign loads
  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name,
        description: campaign.description ?? "",
        targetAudience: campaign.targetAudience ?? "",
        goals: campaign.goals ?? "",
        totalBudget: decimalToNumber(campaign.totalBudget).toString(),
        imageUrl: campaign.imageUrl,
        startDate: campaign.startDate
          ? (new Date(campaign.startDate).toISOString().split("T")[0] ?? "")
          : "",
        endDate: campaign.endDate
          ? (new Date(campaign.endDate).toISOString().split("T")[0] ?? "")
          : "",
      });
      setImagePreview(campaign.imageUrl);
    }
  }, [campaign]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData((prev) => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Campaign name is required";
    }
    if (!formData.totalBudget || parseFloat(formData.totalBudget) <= 0) {
      newErrors.totalBudget = "Valid budget is required";
    }
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate <= startDate) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !campaign) return;

    try {
      const updateData = {
        id: campaignId,
        name: formData.name,
        description: formData.description || undefined,
        targetAudience: formData.targetAudience || undefined,
        goals: formData.goals || undefined,
        totalBudget: parseFloat(formData.totalBudget),
        imageUrl: formData.imageUrl,

        // Only include dates if they're provided
        startDate: formData.startDate
          ? new Date(formData.startDate)
          : undefined,
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      };

      await updateCampaign.mutateAsync(updateData);
    } catch (error) {
      console.error("Error updating campaign:", error);
    }
  };

  const handleCancel = () => {
    router.push(`/campaigns/${campaignId}`);
  };

  if (!isLoaded || campaignLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (campaignError || !campaign) {
    return (
      <div className="py-12 text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
        <h2 className="mb-2 text-lg font-semibold text-white">
          Campaign Not Found
        </h2>
        <p className="mb-4 text-slate-400">
          {campaignError?.message ??
            "The campaign you're trying to edit doesn't exist or you don't have permission to edit it."}
        </p>
        <button
          onClick={() => router.push("/campaigns")}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Back to Campaigns
        </button>
      </div>
    );
  }

  if (campaign.status !== "DRAFT") {
    return (
      <div className="py-12 text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-yellow-400" />
        <h2 className="mb-2 text-lg font-semibold text-white">
          Cannot Edit Campaign
        </h2>
        <p className="mb-4 text-slate-400">
          Only draft campaigns can be edited. This campaign is currently{" "}
          {campaign.status.toLowerCase()}.
        </p>
        <div className="space-x-2">
          <button
            onClick={() => router.push(`/campaigns/${campaignId}`)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            View Campaign
          </button>
          <button
            onClick={() => router.push("/campaigns")}
            className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300 transition-colors hover:bg-slate-800"
          >
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push(`/campaigns/${campaignId}`)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Edit Campaign</h1>
            <p className="text-slate-400">Update your campaign details</p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Campaign Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full rounded-lg border bg-slate-800 px-3 py-2 text-white placeholder-slate-500 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-slate-700"
              }`}
              placeholder="Enter campaign name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your campaign goals and messaging"
            />
          </div>

          {/* Target Audience & Goals */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Target Audience
              </label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) =>
                  setFormData({ ...formData, targetAudience: e.target.value })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Young professionals, families"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Campaign Goals
              </label>
              <input
                type="text"
                value={formData.goals}
                onChange={(e) =>
                  setFormData({ ...formData, goals: e.target.value })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Brand awareness, lead generation"
              />
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Total Budget *
            </label>
            <div className="relative max-w-xs">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 transform text-slate-400">
                $
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.totalBudget}
                onChange={(e) =>
                  setFormData({ ...formData, totalBudget: e.target.value })
                }
                className={`w-full rounded-lg border bg-slate-800 py-2 pr-3 pl-8 text-white placeholder-slate-500 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                  errors.totalBudget ? "border-red-500" : "border-slate-700"
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.totalBudget && (
              <p className="mt-1 text-sm text-red-400">{errors.totalBudget}</p>
            )}
          </div>

          {/* Campaign Dates */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Start Date (Optional)
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className={`w-full rounded-lg border bg-slate-800 px-3 py-2 text-white transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                  errors.endDate ? "border-red-500" : "border-slate-700"
                }`}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-400">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Campaign Image */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Campaign Image
            </label>

            {/* Current Image Preview */}
            {imagePreview && (
              <div className="mb-4">
                <p className="mb-2 text-sm text-slate-400">Current image:</p>
                <div className="h-32 w-48 overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
                  <Image
                    src={imagePreview}
                    alt="Campaign preview"
                    width={192}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* File Upload */}
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white transition-colors file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
              />
              <button
                type="button"
                onClick={() => {
                  const fileInput: HTMLInputElement | null =
                    document.querySelector('input[type="file"]');
                  fileInput?.click();
                }}
                className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload New
              </button>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Upload a new image to replace the current one, or leave unchanged.
            </p>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
              <div className="flex items-start">
                <AlertCircle className="mt-0.5 mr-2 h-5 w-5 shrink-0 text-red-400" />
                <div>
                  <h3 className="text-sm font-medium text-red-400">
                    Error updating campaign
                  </h3>
                  <p className="mt-1 text-sm text-red-300">{errors.submit}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 border-t border-slate-800 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300 transition-colors hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateCampaign.isPending}
              className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateCampaign.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Help Text */}
      <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-400">
              Campaign Editing
            </h3>
            <div className="mt-2 text-sm text-blue-300">
              <p>
                You can only edit campaigns that are in draft status. Once a
                campaign is submitted or activated, most details cannot be
                changed to maintain integrity of approved bookings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
