"use client";

import React, { createContext, useContext, useState } from "react";
import type { UserRole } from "@prisma/client";
import { setAdminModeCookie, type AdminMode } from "../../../elaview-mvp/src/lib/admin-mode-cookies";

interface AdminModeContextType {
  mode: AdminMode;
  setMode: (mode: AdminMode) => void;
  toggleMode: () => void;
  canToggle: boolean;
  userRole: UserRole;
}

const AdminModeContext = createContext<AdminModeContextType | undefined>(undefined);

interface AdminModeProviderProps {
  children: React.ReactNode;
  userRole: UserRole;
  initialMode: AdminMode;
}

export function AdminModeProvider({ children, userRole, initialMode }: AdminModeProviderProps) {
  // MARKETING users are forced to marketing mode, ADMIN users can toggle
  const isMarketingUser = userRole === "MARKETING";
  const canToggle = userRole === "ADMIN";

  // Initialize with mode from server (from cookie)
  const [mode, setModeState] = useState<AdminMode>(initialMode);

  // Save mode to cookie when it changes (only for ADMIN users)
  const setMode = (newMode: AdminMode) => {
    if (isMarketingUser) {
      // Marketing users cannot change mode
      console.warn("Marketing users cannot change admin mode");
      return;
    }
    setModeState(newMode);
    // Update cookie via server action
    void setAdminModeCookie(newMode);
  };

  const toggleMode = () => {
    if (isMarketingUser) {
      // Marketing users cannot toggle
      console.warn("Marketing users cannot toggle admin mode");
      return;
    }
    const newMode = mode === "admin" ? "marketing" : "admin";
    setMode(newMode);
  };

  // Mode is initialized from server (cookie), preventing hydration mismatch
  return (
    <AdminModeContext.Provider value={{ mode, setMode, toggleMode, canToggle, userRole }}>
      {children}
    </AdminModeContext.Provider>
  );
}

export function useAdminMode() {
  const context = useContext(AdminModeContext);
  if (context === undefined) {
    throw new Error("useAdminMode must be used within AdminModeProvider");
  }
  return context;
}