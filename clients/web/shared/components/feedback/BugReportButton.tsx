"use client";

import { useState, useRef } from "react";
import { AlertCircle, Camera, X, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "../ui/Button";
import useBugReportsSubmit from "@/shared/hooks/api/actions/useBugReportsSubmit/useBugReportsSubmit";

type BugCategory = undefined;
type BugSeverity = undefined;

interface UploadedImage {
  url: string;
  publicId: string;
}

interface BugReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BugReportModal({ isOpen, onClose }: BugReportModalProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // const submitBug = api.bugReports.submit.useMutation({
  //   onSuccess: () => {
  //     // Show success message
  //     setShowSuccess(true);

  //     // Reset form after 3 seconds
  //     setTimeout(() => {
  //       onClose();
  //       setShowSuccess(false);
  //       setTitle("");
  //       setDescription("");
  //       setUploadedImages([]);
  //     }, 3000);
  //   },
  //   onError: (error) => {
  //     alert(`Failed to submit bug report: ${error.message}`);
  //   },
  // });

  const { submit, isPending: submitBugPending } = useBugReportsSubmit();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Please fill out all required fields");
      return;
    }

    // Auto-capture context
    const pageUrl = window.location.href;
    const userAgent = navigator.userAgent;
    const screenshots = uploadedImages.map((img) => img.url);

    submit();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Limit to 5 images total
    if (uploadedImages.length >= 5) {
      alert("Maximum 5 screenshots allowed");
      return;
    }

    setIsUploading(true);

    try {
      const file = files[0];
      if (!file) return;

      // Create form data for Cloudinary upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
          "elaview_bug_reports"
      );
      formData.append("folder", "bug-reports");

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      // Add to uploaded images
      setUploadedImages((prev) => [
        ...prev,
        { url: data.secure_url, publicId: data.public_id },
      ]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload screenshot. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        onClick={() => !submitBugPending && !showSuccess && onClose()}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-slate-900 border-2 border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Success State */}
          {showSuccess ? (
            <div className="p-12 text-center space-y-6">
              <div className="flex justify-center">
                <CheckCircle className="h-20 w-20 text-green-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Thank You!
                </h3>
                <p className="text-slate-300">
                  We really appreciate you taking the time to report this issue.
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  Our team will look into it and work on a fix.
                </p>
              </div>
            </div>
          ) : (
            // Form State
            <form onSubmit={handleSubmit}>
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-600/10 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Report a Bug
                    </h2>
                    <p className="text-sm text-slate-400">
                      Help us improve Elaview
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitBugPending}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form Fields */}
              <div className="p-6 space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">
                    What's wrong? *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Can't upload campaign image"
                    required
                    maxLength={200}
                    disabled={submitBugPending}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all disabled:opacity-50"
                  />
                  <p className="text-xs text-slate-500 text-right">
                    {title.length}/200 characters
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Tell us more *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What happened? What did you expect to happen?

Steps to reproduce:
1. Go to...
2. Click on...
3. See error..."
                    required
                    rows={6}
                    maxLength={5000}
                    disabled={submitBugPending}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all disabled:opacity-50 resize-none"
                  />
                  <p className="text-xs text-slate-500 text-right">
                    {description.length}/5000 characters • Be as detailed as
                    possible
                  </p>
                </div>

                {/* Screenshot Upload */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300">
                    Screenshots (optional)
                  </label>

                  {/* Upload Button */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={
                      uploadedImages.length >= 5 ||
                      isUploading ||
                      submitBugPending
                    }
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={
                      uploadedImages.length >= 5 ||
                      isUploading ||
                      submitBugPending
                    }
                    className="w-full border-2 border-dashed border-slate-700 hover:border-slate-600 rounded-lg p-6 text-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <div className="flex items-center justify-center gap-2 text-slate-400">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Uploading...
                      </div>
                    ) : (
                      <>
                        <Camera className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                        <p className="text-sm font-medium text-slate-400">
                          {uploadedImages.length === 5
                            ? "Maximum 5 screenshots reached"
                            : "Click to upload screenshot"}
                        </p>
                        {uploadedImages.length > 0 &&
                          uploadedImages.length < 5 && (
                            <p className="text-xs text-slate-500 mt-1">
                              {uploadedImages.length}/5 uploaded
                            </p>
                          )}
                      </>
                    )}
                  </button>

                  {/* Uploaded Images Preview */}
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {uploadedImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative group aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-700"
                        >
                          <img
                            src={image.url}
                            alt={`Screenshot ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            disabled={submitBugPending}
                            className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Auto-captured Context Notice */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-blue-400">ℹ️</span>
                    <div className="flex-1 text-blue-300">
                      <strong>Auto-captured info:</strong>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1 text-xs text-blue-200/70">
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span className="truncate">
                        {typeof window !== "undefined"
                          ? window.location.href
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🌐</span>
                      <span>
                        {typeof navigator !== "undefined" &&
                          (navigator.userAgent.includes("Chrome")
                            ? "Chrome"
                            : navigator.userAgent.includes("Firefox")
                            ? "Firefox"
                            : navigator.userAgent.includes("Safari")
                            ? "Safari"
                            : "Unknown")}{" "}
                        Browser
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="ghost"
                  disabled={submitBugPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    submitBugPending || !title.trim() || !description.trim()
                  }
                  className="bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitBugPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Report"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
