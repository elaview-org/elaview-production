// src/components/messages/ReportIssueForm.tsx
"use client";

import { useState, useRef } from "react";
import { X, Upload, Loader2, AlertTriangle, Image as ImageIcon, Check } from "lucide-react";
import { api } from "../../../../elaview-mvp/src/trpc/react";
import { toast } from "sonner";
import { uploadToCloudinary, validateImageFile } from "../../../../elaview-mvp/src/lib/cloudinary-upload";

interface ReportIssueFormProps {
  booking: {
    id: string;
    space: {
      title: string;
    };
  };
  onSuccess: () => void;
  onCancel: () => void;
}

const ISSUE_TYPES = [
  { value: 'WRONG_LOCATION', label: 'Wrong Location', description: 'Ad installed at incorrect address' },
  { value: 'POOR_QUALITY', label: 'Poor Quality', description: 'Visible damage, fading, or poor installation' },
  { value: 'DAMAGE_TO_CREATIVE', label: 'Damaged Creative', description: 'Your artwork is torn, bent, or damaged' },
  { value: 'NOT_VISIBLE', label: 'Not Visible', description: 'Ad is blocked, obstructed, or not viewable' },
  { value: 'SAFETY_ISSUE', label: 'Safety Issue', description: 'Installation poses safety concerns' },
  { value: 'MISLEADING_LISTING', label: 'Misleading Listing', description: 'Space differs significantly from listing' },
] as const;

export function ReportIssueForm({ booking, onSuccess, onCancel }: ReportIssueFormProps) {
  const [issueType, setIssueType] = useState<string>("");
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const utils = api.useUtils();

  const reportIssueMutation = api.messages.reportIssue.useMutation({
    onSuccess: async () => {
      await utils.messages.getConversation.invalidate();
      await utils.campaigns.getById.invalidate();
      toast.success("Issue reported successfully. Our support team will review within 24-48 hours.");
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to report issue");
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (selectedFiles.length + files.length > 5) {
      toast.error("Maximum 5 photos allowed");
      return;
    }

    for (const file of files) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast.error(validation.error);
        return;
      }
    }

    const newPreviews: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        if (newPreviews.length === files.length) {
          setPreviews([...previews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setSelectedFiles([...selectedFiles, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!issueType) {
      toast.error("Please select an issue type");
      return;
    }

    if (description.trim().length < 20) {
      toast.error("Please provide at least 20 characters describing the issue");
      return;
    }

    if (selectedFiles.length < 2) {
      toast.error("Please upload at least 2 photos showing the issue");
      return;
    }

    setIsUploading(true);

    try {
      // Upload photos to Cloudinary
      const uploadPromises = selectedFiles.map(file => uploadToCloudinary(file));
      const photoUrls = await Promise.all(uploadPromises);

      // Submit report
      await reportIssueMutation.mutateAsync({
        bookingId: booking.id,
        issueType: issueType as any,
        description: description.trim(),
        photos: photoUrls,
      });

    } catch (error: any) {
      console.error("Report issue error:", error);
      toast.error("Failed to upload photos. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const isSubmitting = reportIssueMutation.isPending || isUploading;
  const canSubmit = issueType && description.trim().length >= 20 && selectedFiles.length >= 2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border-2 border-orange-500/30 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <AlertTriangle className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Report Installation Issue</h2>
              <p className="text-sm text-slate-400">{booking.space.title}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Info Banner */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">Our support team will review your report</p>
                <p className="text-blue-400/80">
                  You'll receive a decision within 24-48 hours. If approved, you'll receive a full refund.
                </p>
              </div>
            </div>
          </div>

          {/* Issue Type */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              What's the issue? <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ISSUE_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setIssueType(type.value)}
                  disabled={isSubmitting}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    issueType === type.value
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className={`font-medium ${
                      issueType === type.value ? 'text-orange-400' : 'text-white'
                    }`}>
                      {type.label}
                    </span>
                    {issueType === type.value && (
                      <Check className="h-5 w-5 text-orange-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Describe the issue in detail <span className="text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide specific details about the issue. Include what you expected vs. what you received..."
              rows={4}
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            />
            <p className={`text-xs mt-1 ${
              description.trim().length >= 20 ? 'text-green-400' : 'text-slate-500'
            }`}>
              {description.trim().length} / 20 characters minimum
            </p>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Upload photos showing the issue <span className="text-red-400">*</span>
            </label>
            <p className="text-xs text-slate-400 mb-3">
              Upload at least 2 photos clearly showing the problem (max 5 photos, 5MB each)
            </p>

            {/* File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              disabled={isSubmitting || selectedFiles.length >= 5}
              className="hidden"
            />

            {/* Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting || selectedFiles.length >= 5}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-700 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="h-5 w-5 text-slate-400" />
              <span className="text-sm font-medium text-slate-300">
                {selectedFiles.length >= 5 ? 'Maximum photos reached' : 'Click to upload photos'}
              </span>
            </button>

            {/* Photo Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Issue photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-slate-700 group-hover:border-orange-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      disabled={isSubmitting}
                      className="absolute -top-2 -right-2 rounded-full bg-red-600 p-1.5 text-white hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
                      <p className="text-xs text-white font-medium text-center">
                        Photo {index + 1}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className={`text-xs mt-2 ${
              selectedFiles.length >= 2 ? 'text-green-400' : 'text-slate-500'
            }`}>
              {selectedFiles.length} / 2 photos minimum
            </p>
          </div>

          {/* Help Text */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-white mb-2">💡 Tips for reporting issues:</h4>
            <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li>Take clear, well-lit photos from multiple angles</li>
              <li>Include close-ups of specific problem areas</li>
              <li>Show context (location, surroundings, obstructions)</li>
              <li>Be specific and detailed in your description</li>
            </ul>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-slate-800 bg-slate-900/50">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-all disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed shadow-lg disabled:shadow-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isUploading ? 'Uploading photos...' : 'Submitting...'}
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4" />
                Submit Report
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}