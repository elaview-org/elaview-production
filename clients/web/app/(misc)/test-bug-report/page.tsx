"use client";

import { useEffect, useState } from "react";
import { api } from "../../../../elaview-mvp/src/trpc/react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { notFound } from "next/navigation";

export default function TestBugReport() {
  // 🔒 SECURITY: Block access in production
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [bugId, setBugId] = useState<string>("");

  const submitBug = api.bugReports.submit.useMutation({
    onSuccess: (data) => {
      console.log("Test bug submitted:", data);
      setBugId(data.bugReport.id);
      setStatus("success");
    },
    onError: (error) => {
      console.error("Failed:", error);
      setStatus("error");
    },
  });

  useEffect(() => {
    // Auto-submit test bug on page load
    if (status === "idle") {
      setStatus("loading");
      submitBug.mutate({
        title: "Test Bug Report - Message System",
        description: `This is a test bug report to verify the system works end-to-end.

Steps to reproduce:
1. Go to messages page
2. Send a message
3. Message doesn't appear in the thread

Expected: Message should show immediately
Actual: Messages are not displaying

This is BUG-PROD-001 from our active bugs list.`,
        pageUrl: "http://localhost:3000/messages/test-booking-123",
        userAgent: navigator.userAgent,
        screenshots: [],
      });
    }
  }, [status, submitBug]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-4">
          Testing Bug Report System
        </h1>

        {status === "loading" && (
          <div className="flex items-center gap-3 text-slate-300">
            <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
            <p>Submitting test bug report...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-green-400">
              <CheckCircle className="h-8 w-8" />
              <p className="text-xl font-semibold">Test Bug Created Successfully!</p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 space-y-2">
              <p className="text-sm text-slate-400">Bug Report ID:</p>
              <p className="text-lg font-mono text-white break-all">{bugId}</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-white">Next Steps:</h2>
              <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li>
                  Navigate to{" "}
                  <a
                    href="/admin/bug-reports"
                    className="text-cyan-400 hover:text-cyan-300 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    /admin/bug-reports
                  </a>
                </li>
                <li>Verify the test bug appears in the list</li>
                <li>Check that auto-categorization set it to "MESSAGING"</li>
                <li>Test the "Copy as Markdown" button</li>
                <li>Test status update buttons (Confirm → Start Working → Mark Fixed)</li>
                <li>Test filtering by severity, status, and category</li>
              </ol>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <p className="text-sm text-orange-300">
                <strong>Remember:</strong> This is a test bug. You can delete it from the admin
                dashboard after testing, or update its status to mark it as complete.
              </p>
            </div>

            <button
              onClick={() => {
                setStatus("idle");
                setBugId("");
              }}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Submit Another Test Bug
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <XCircle className="h-8 w-8" />
              <p className="text-xl font-semibold">Failed to Create Test Bug</p>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-sm text-red-300">
                Check the console for error details. Make sure:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-red-200">
                <li>Database is running</li>
                <li>tRPC server is accessible</li>
                <li>You're authenticated as a user</li>
              </ul>
            </div>

            <button
              onClick={() => {
                setStatus("idle");
              }}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
