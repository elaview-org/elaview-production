"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../../../elaview-mvp/src/trpc/react";
import { CheckCircle, Copy, ExternalLink } from "lucide-react";
import {
  type BugReport,
  formatCategory,
  generateMarkdown,
  getSeverityConfig,
  getStatusConfig,
  parseBrowserInfo,
} from "../../../../../elaview-mvp/src/lib/bug-utils";
import type { BugStatus } from "@prisma/client";
import { format } from "date-fns";
import Image from "next/image";

export default function BugCard({ report }: { report: BugReport }) {
  // Use your bug type
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const router = useRouter();

  const updateStatus = api.bugReports.updateStatus.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleCopyMarkdown = async () => {
    const markdown = generateMarkdown(report);
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusUpdate = (newStatus: BugStatus) => {
    updateStatus.mutate({
      id: report.id,
      status: newStatus,
    });
  };

  const severityConfig = getSeverityConfig(report.severity);
  const statusConfig = getStatusConfig(report.status);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/50">
      {/* Bug Card Header */}
      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <h3 className="text-lg font-semibold text-white">{report.title}</h3>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-1 text-xs ${severityConfig.bg} ${severityConfig.color} ${severityConfig.border}`}
                >
                  {severityConfig.emoji} {report.severity}
                </span>
                <span className={`rounded-full px-2 py-1 text-xs ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
                <span className="rounded-full bg-slate-700/50 px-2 py-1 text-xs text-slate-300">
                  {formatCategory(report.category)}
                </span>
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-400">
            {format(new Date(report.createdAt), "MMM d, yyyy")}
          </div>
        </div>

        {/* Description */}
        <p className="line-clamp-2 text-sm text-slate-300">{report.description}</p>

        {/* Context */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
          {report.pageUrl && (
            <div className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              {new URL(report.pageUrl).pathname}
            </div>
          )}
          {report.user && <div>👤 {report.user.name ?? "Unknown User"}</div>}
          {!report.user && <div>👤 Anonymous</div>}
          {report.screenshots.length > 0 && (
            <div>
              📸 {report.screenshots.length} screenshot{report.screenshots.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Copy as Markdown */}
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-2 rounded-lg bg-cyan-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-cyan-700"
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy as Markdown
              </>
            )}
          </button>

          {/* Quick Status Updates */}
          {report.status === "NEW" && (
            <button
              onClick={() => handleStatusUpdate("CONFIRMED")}
              disabled={updateStatus.isPending}
              className="rounded-lg bg-orange-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-orange-700 disabled:opacity-50"
            >
              Confirm Bug
            </button>
          )}
          {report.status === "CONFIRMED" && (
            <button
              onClick={() => handleStatusUpdate("IN_PROGRESS")}
              disabled={updateStatus.isPending}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              Start Working
            </button>
          )}
          {(report.status === "IN_PROGRESS" || report.status === "CONFIRMED") && (
            <button
              onClick={() => handleStatusUpdate("FIXED")}
              disabled={updateStatus.isPending}
              className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-green-700 disabled:opacity-50"
            >
              Mark Fixed
            </button>
          )}

          {/* Expand/Collapse */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-700"
          >
            {expanded ? "Hide Details" : "Show Details"}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-slate-800 bg-slate-900/80 p-6">
          <div className="space-y-6">
            {/* Full Description */}
            <div>
              <h4 className="mb-2 text-sm font-medium text-slate-300">Full Description</h4>
              <p className="text-sm whitespace-pre-wrap text-slate-400">{report.description}</p>
            </div>

            {/* Technical Details */}
            <div>
              <h4 className="mb-2 text-sm font-medium text-slate-300">Technical Details</h4>
              <div className="space-y-1 text-sm text-slate-400">
                <div>Page: {report.pageUrl ?? "Not captured"}</div>
                <div>
                  Browser: {report.userAgent ? parseBrowserInfo(report.userAgent) : "Not captured"}
                </div>
                <div>Report ID: {report.id}</div>
              </div>
            </div>

            {/* Screenshots */}
            {report.screenshots.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-medium text-slate-300">Screenshots</h4>
                <div className="grid grid-cols-2 gap-4">
                  {report.screenshots.map((url: string, idx: number) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block aspect-video overflow-hidden rounded-lg border border-slate-700 bg-slate-800 transition-colors hover:border-slate-500"
                    >
                      <Image
                        src={url}
                        alt={`Screenshot ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Notes */}
            {report.adminNotes && (
              <div>
                <h4 className="mb-2 text-sm font-medium text-slate-300">Admin Notes</h4>
                <p className="rounded-lg bg-slate-800/50 p-3 text-sm text-slate-400">
                  {report.adminNotes}
                </p>
              </div>
            )}

            {/* Linked Bug ID */}
            {report.linkedBugId && (
              <div>
                <h4 className="mb-2 text-sm font-medium text-slate-300">Linked to Documentation</h4>
                <span className="rounded bg-slate-800 px-3 py-1 font-mono text-sm text-slate-300">
                  {report.linkedBugId}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
