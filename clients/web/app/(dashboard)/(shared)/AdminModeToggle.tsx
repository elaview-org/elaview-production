"use client";

import { useRouter } from "next/navigation";
// import { useAdminMode } from "@/shared/src/contexts/AdminModeContext";
import { ArrowLeftRight } from "lucide-react";
import Button from "@/shared/components/atoms/Button/Button";

export function AdminModeToggle() {
  const router = useRouter();
  // const { mode, toggleMode, canToggle } = useAdminMode();
  const mode = "marketing";
  const toggleMode = () => {};
  const canToggle = () => {};
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
    <Button
      onClick={handleToggle}
      variant="outline"
      className={`${
        mode === "admin"
          ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
          : "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100"
      }`}
    >
      <ArrowLeftRight className="h-4 w-4" />
      <span>Switch to {mode === "admin" ? "Marketing" : "Admin"}</span>
    </Button>
  );
}
