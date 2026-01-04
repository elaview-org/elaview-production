"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
// import type { UserRole } from "@prisma/client";
const UserRole = ''
type AdminMode = "admin" | "marketing";

interface AdminModeContextType {
  mode: AdminMode;
  setMode: (mode: AdminMode) => void;
  toggleMode: () => void;
  canToggle: boolean;
  userRole: UserRole;
}

const AdminModeContext = createContext<AdminModeContextType | undefined>(
  undefined
);

interface AdminModeProviderProps {
  children: React.ReactNode;
  userRole: UserRole;
}

export function AdminModeProvider({ children, userRole }: AdminModeProviderProps) {
  // MARKETING users are forced to marketing mode, ADMIN users can toggle
  const isMarketingUser = userRole === 'MARKETING';
  const canToggle = userRole === 'ADMIN';

  // Initialize with safe default based on user role (same on server and client)
  const defaultMode: AdminMode = isMarketingUser ? "marketing" : "admin";
  const [mode, setModeState] = useState<AdminMode>(defaultMode);

  // Load mode from localStorage on mount (only for ADMIN users)
  useEffect(() => {
    if (isMarketingUser) {
      // Marketing users are always in marketing mode
      setModeState("marketing");
    } else {
      // Admin users can load their preference from localStorage
      const savedMode = localStorage.getItem("adminMode") as AdminMode | null;
      if (savedMode === "admin" || savedMode === "marketing") {
        setModeState(savedMode);
      }
    }
  }, [isMarketingUser]);

  // Save mode to localStorage when it changes (only for ADMIN users)
  const setMode = (newMode: AdminMode) => {
    if (isMarketingUser) {
      // Marketing users cannot change mode
      console.warn("Marketing users cannot change admin mode");
      return;
    }
    setModeState(newMode);
    localStorage.setItem("adminMode", newMode);
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

  // Always render children to prevent hydration mismatch
  // Mode will be updated client-side via useEffect if needed
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
