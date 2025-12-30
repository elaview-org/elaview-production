"use client";

import { useRouter } from "next/navigation";
import { useAdminMode } from "../../../../elaview-mvp/src/contexts/AdminModeContext";
import { ArrowLeftRight } from "lucide-react";

export function AdminModeToggle() {
  const router = useRouter();
  const { mode, toggleMode, canToggle } = useAdminMode();

  // Don't render toggle button for marketing-only users
  if (!canToggle) {
    return null;
  }

  const handleToggle = () => {
    // Toggle the mode in context (updates UI)
    toggleMode();

    // Navigate to the appropriate default route for the new mode
    router.push("/overview");
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all hover:shadow-md ${
        mode === "admin"
          ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
          : "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100"
      }`}
    >
      <ArrowLeftRight className="h-4 w-4" />
      <span>Switch to {mode === "admin" ? "Marketing" : "Admin"}</span>
    </button>
  );
}
