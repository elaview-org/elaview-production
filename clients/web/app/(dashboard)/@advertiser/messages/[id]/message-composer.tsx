"use client";

import * as React from "react";
import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/primitives/button";
import { cn } from "@/lib/utils";
import { PaperclipIcon, SendIcon } from "lucide-react";
import type { MessageAttachment } from "../../../../../types/types";

// ============================================
// Types
// ============================================

interface MessageComposerProps {
  onSend: (content: string, attachments?: MessageAttachment[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

// ============================================
// Constants
// ============================================

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
];

// ============================================
// Component
// ============================================

export function MessageComposer({
  onSend,
  disabled = false,
  placeholder = "Type a message...",
}: MessageComposerProps) {
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!content.trim() && attachments.length === 0) return;
    if (disabled || isUploading) return;

    onSend(content.trim(), attachments.length > 0 ? attachments : undefined);
    setContent("");
    setAttachments([]);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      const validFiles: MessageAttachment[] = [];

      for (const file of files) {
        // Validate file type
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
          alert(
            `File "${file.name}" is not supported. Please upload PDF, PNG, or JPG files.`
          );
          continue;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          alert(
            `File "${file.name}" is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
          );
          continue;
        }

        // In a real implementation, this would upload to storage and return a URL
        // For now, we'll create a mock attachment
        const mockAttachment: MessageAttachment = {
          id: `att-${Date.now()}-${Math.random()}`,
          fileName: file.name,
          fileUrl: URL.createObjectURL(file),
          fileSize: file.size,
          mimeType: file.type,
          thumbnailUrl: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : undefined,
        };

        validFiles.push(mockAttachment);
      }

      if (validFiles.length > 0) {
        setAttachments((prev) => [...prev, ...validFiles]);
      }
    } catch (error) {
      console.error("Error processing files:", error);
      alert("Failed to process files. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => {
      const updated = prev.filter((att) => att.id !== id);
      // Revoke object URLs to prevent memory leaks
      const removed = prev.find((att) => att.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.fileUrl);
        if (removed.thumbnailUrl) {
          URL.revokeObjectURL(removed.thumbnailUrl);
        }
      }
      return updated;
    });
  };

  // Auto-resize textarea
  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    };

    adjustHeight();
    textarea.addEventListener("input", adjustHeight);
    return () => textarea.removeEventListener("input", adjustHeight);
  }, [content]);

  const canSend =
    (content.trim().length > 0 || attachments.length > 0) &&
    !disabled &&
    !isUploading;

  return (
    <div className="bg-background sticky bottom-0 border-t">
      {/* Attachment previews */}
      {attachments.length > 0 && (
        <div className="bg-muted/30 border-b px-4 py-2">
          <div className="flex flex-wrap gap-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="group bg-background relative flex items-center gap-2 rounded-lg border px-2 py-1.5 text-xs"
              >
                <span className="max-w-37.5 truncate">
                  {attachment.fileName}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(attachment.id)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={`Remove ${attachment.fileName}`}
                >
                  <svg
                    className="size-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2 px-4 py-3">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Attach file"
        />

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          aria-label="Attach file"
        >
          <PaperclipIcon className="size-4" />
        </Button>

        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isUploading}
            rows={1}
            className={cn(
              "bg-background w-full resize-none rounded-md border px-3 py-2 text-sm",
              "placeholder:text-muted-foreground",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "max-h-[120px] overflow-y-auto"
            )}
            aria-label="Message input"
          />
        </div>

        <Button
          type="button"
          size="icon-sm"
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
        >
          <SendIcon className="size-4" />
        </Button>
      </div>

      {/* Helper text */}
      <div className="px-4 pb-2">
        <p className="text-muted-foreground text-xs">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
