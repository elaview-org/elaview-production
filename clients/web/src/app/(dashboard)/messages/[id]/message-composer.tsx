"use client";

import * as React from "react";
import { KeyboardEvent, useRef, useState } from "react";
import { Button } from "@/components/primitives/button";
import { cn } from "@/lib/utils";
import { PaperclipIcon, SendIcon, XIcon } from "lucide-react";

type Props = {
  onSend: (content: string, attachments?: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
};

type PendingAttachment = {
  id: string;
  fileName: string;
  url: string;
  isUploading: boolean;
};

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
];

export function MessageComposer({
  onSend,
  disabled = false,
  placeholder = "Type a message...",
}: Props) {
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
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

    const attachmentUrls = attachments.map((a) => a.url);
    onSend(
      content.trim(),
      attachmentUrls.length > 0 ? attachmentUrls : undefined
    );
    setContent("");
    setAttachments([]);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of files) {
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
          continue;
        }

        if (file.size > MAX_FILE_SIZE) {
          continue;
        }

        const objectUrl = URL.createObjectURL(file);

        setAttachments((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random()}`,
            fileName: file.name,
            url: objectUrl,
            isUploading: false,
          },
        ]);
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => {
      const removed = prev.find((a) => a.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.url);
      }
      return prev.filter((a) => a.id !== id);
    });
  };

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
                  <XIcon className="size-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 px-4 py-3">
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

      <div className="px-4 pb-2">
        <p className="text-muted-foreground text-xs">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
