// src/components/messages/MessageInput.tsx
"use client";

import { useState, useRef } from "react";
import { Send, Image as ImageIcon, X, Loader2, Camera, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { uploadMultipleToCloudinary, validateImageFile } from "@/shared/lib/cloudinary-upload";
import { getInstallationWindowStatus } from "@/shared/lib/installation-window";
import useSendMessage from "@/shared/hooks/api/actions/useSendMessage/useSendMessage";

interface MessageInputProps {
  campaignId: string;
  bookingId?: string;
  bookingStartDate?: Date;
  userRole: "ADVERTISER" | "SPACE_OWNER";
}

export function MessageInput({ campaignId, bookingId, bookingStartDate, userRole }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  //getConverstion
  //getConverstaion with Preview
  const { sendMessageMutation, isPending} = useSendMessage();

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

  const handleSend = async () => {
    console.log('🚀 [HANDLE SEND] Called with:', {
      message: message,
      messageLength: message.length,
      hasTrimmedMessage: !!message.trim(),
      selectedFilesCount: selectedFiles.length,
      campaignId,
      bookingId,
    });

    if (!message.trim() && selectedFiles.length === 0) {
      console.log('⚠️ [HANDLE SEND] No message or files, returning early');
      return;
    }

    const isProofSubmission = userRole === "SPACE_OWNER" && selectedFiles.length > 0;

    if (isProofSubmission && !bookingId) {
      toast.error("No booking found for proof submission");
      return;
    }

    // Validate window status before upload
    if (isProofSubmission && bookingStartDate) {
      const windowStatus = getInstallationWindowStatus(bookingStartDate);

      if (!windowStatus.canUpload) {
        if (windowStatus.status === 'TOO_EARLY') {
          toast.error(`Installation window opens on ${formatDate(windowStatus.windowOpenDate)}. You can upload proof then.`, {
            duration: 6000,
          });
        } else if (windowStatus.status === 'CLOSED') {
          toast.error(`Installation window closed on ${formatDate(windowStatus.windowCloseDate)}. Contact support if you need to upload proof late.`, {
            duration: 6000,
          });
        }
        return;
      }

      // Show urgency warning if window is closing soon
      if (windowStatus.daysRemaining && windowStatus.daysRemaining <= 2) {
        toast.warning(`⚠️ Upload window closes in ${windowStatus.daysRemaining} day${windowStatus.daysRemaining !== 1 ? 's' : ''}!`, {
          duration: 5000,
        });
      }
    }

    setIsUploading(true);

    try {
      let attachmentUrls: string[] = [];

      if (selectedFiles.length > 0) {
        attachmentUrls = await uploadMultipleToCloudinary(selectedFiles);
      }

      console.log('📤 [HANDLE SEND] Sending mutation with:', {
        campaignId,
        content: message.trim() || (isProofSubmission ? "📸 Installation proof submitted" : ""),
        messageType: isProofSubmission ? "PROOF_SUBMISSION" : "TEXT",
        bookingId: bookingId,  // ✅ FIX: Always send bookingId for ALL messages
      });

      //
      await sendMessageMutation({
        campaignId,
        content: message.trim() || (isProofSubmission ? "📸 Installation proof submitted" : ""),
        attachments: attachmentUrls.length > 0 ? attachmentUrls : undefined,
        messageType: isProofSubmission ? "PROOF_SUBMISSION" : "TEXT",
        bookingId: bookingId,  // ✅ FIX: Always send bookingId for ALL messages
      });

      console.log('✅ [HANDLE SEND] Mutation completed');

      if (isProofSubmission) {
        toast.success("Installation proof submitted! Waiting for advertiser approval.");
      }

    } catch (error: any) {
      console.error("Send message error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isSending = isPending || isUploading;

  const windowStatus = bookingStartDate && userRole === "SPACE_OWNER"
    ? getInstallationWindowStatus(bookingStartDate)
    : null;

  // Helper function for date formatting
  function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  return (
    <div className="space-y-3">
      {/* Installation Window Status */}
      {windowStatus && !windowStatus.canUpload && selectedFiles.length > 0 && (
        <div className={`rounded-lg p-3 mb-4 ${
          windowStatus.status === 'CLOSED'
            ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
          windowStatus.status === 'TOO_EARLY'
            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
          'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
        }`}>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">{windowStatus.message}</span>
          </div>
          {windowStatus.status === 'TOO_EARLY' && (
            <p className="text-xs mt-1 ml-6">
              Window opens: {formatDate(windowStatus.windowOpenDate)} (7 days before campaign start)
            </p>
          )}
          {windowStatus.status === 'CLOSED' && (
            <p className="text-xs mt-1 ml-6">
              Contact support if you need to upload proof after the deadline
            </p>
          )}
        </div>
      )}

      {/* Urgency Warning (when window is open but closing soon) */}
      {windowStatus && windowStatus.canUpload && windowStatus.urgency === 'critical' && selectedFiles.length > 0 && (
        <div className="rounded-lg p-3 mb-4 bg-red-600/20 border-2 border-red-500/50 animate-pulse">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-300" />
            <span className="text-sm font-bold text-red-300">
              🚨 URGENT: {windowStatus.daysRemaining} day{windowStatus.daysRemaining !== 1 ? 's' : ''} remaining in upload window!
            </span>
          </div>
        </div>
      )}

      {/* File Previews */}
      {previews.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {previews.map((preview, index) => (
            <div key={index} className="relative flex-shrink-0">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="h-20 w-20 rounded-lg object-cover border-2 border-blue-500/20"
              />
              <button
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 rounded-full bg-red-600 p-1 text-white hover:bg-red-700 transition-colors"
                disabled={isSending}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Proof Submission Notice */}
      {userRole === "SPACE_OWNER" && selectedFiles.length > 0 && bookingId && (
        <div className={`flex items-start gap-2 rounded-lg px-3 py-2 ${
          windowStatus?.canUpload
            ? 'bg-green-500/10 border border-green-500/20'
            : 'bg-orange-500/10 border border-orange-500/20'
        }`}>
          <Camera className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
            windowStatus?.canUpload ? 'text-green-400' : 'text-orange-400'
          }`} />
          <div className="flex-1">
            <p className={`text-sm font-medium ${
              windowStatus?.canUpload ? 'text-green-300' : 'text-orange-300'
            }`}>
              {windowStatus?.canUpload
                ? 'Installation proof will be submitted for approval'
                : 'Installation proof submission'}
            </p>
            <p className={`text-xs mt-1 ${
              windowStatus?.canUpload ? 'text-green-400' : 'text-orange-400'
            }`}>
              {windowStatus?.message || 'Proof must be submitted within the 14-day installation window'}
            </p>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2">
        {/* File Upload Button */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={isSending || selectedFiles.length >= 5}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isSending || selectedFiles.length >= 5}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={selectedFiles.length >= 5 ? "Maximum 5 photos" : "Attach photos"}
        >
          <ImageIcon className="h-5 w-5" />
        </button>

        {/* Text Input */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            userRole === "SPACE_OWNER" && selectedFiles.length > 0
              ? "Add a message with your proof photos (optional)"
              : "Type a message..."
          }
          className="flex-1 resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-900 disabled:cursor-not-allowed transition-all"
          rows={2}
          disabled={isSending}
        />

        {/* Send Button */}
        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={
            isSending || 
            (!message.trim() && selectedFiles.length === 0) || 
            !!(windowStatus && !windowStatus.canUpload && selectedFiles.length > 0)
          }
          className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700 transition-colors disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
          title={windowStatus && !windowStatus.canUpload && selectedFiles.length > 0 ? windowStatus.message : undefined}
        >
          {isSending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Help Text */}
      <p className="text-xs text-slate-500">
        {userRole === "SPACE_OWNER"
          ? "Upload photos to submit installation proof (14-day window: 7 days before + 7 days after campaign start). Advertiser will have 48 hours to review."
          : "Send messages or wait for space owner to submit installation proof."}
      </p>
    </div>
  );
}
